// All mailbox work: connect, search, read, move, flag, send, unsubscribe.
import { ImapFlow } from 'imapflow';
import nodemailer from 'nodemailer';
import { simpleParser } from 'mailparser';
import { ACCOUNTS, SERVERS, SIGNATURES, getAccount } from './accounts.js';
import * as ms from './ms.js';

const OP_TIMEOUT = 60000;
const FULL_PARSE_LIMIT = 15 * 1024 * 1024; // above this size, only the text part is downloaded
const BODY_LIMIT = 20000;

export function setupProblem(acc) {
  if (acc.kind === 'gmail') return process.env[acc.secret] ? null : `not set up (missing ${acc.secret})`;
  if (!ms.msConfigured()) return 'needs Microsoft app setup (MS_CLIENT_ID, MS_CLIENT_SECRET)';
  if (!ms.msConnected()) return 'not connected yet (press "Connect Hotmail" on the admin page)';
  return null;
}

async function imapAuth(acc) {
  if (acc.kind === 'gmail') return { user: acc.email, pass: process.env[acc.secret].replace(/\s+/g, '') };
  return { user: acc.email, accessToken: await ms.accessToken() };
}

function withTimeout(promise, ms_, label) {
  let t;
  const timer = new Promise((_, rej) => {
    t = setTimeout(() => rej(new Error(`${label} timed out`)), ms_);
  });
  return Promise.race([promise, timer]).finally(() => clearTimeout(t));
}

// One open connection per mailbox, reused for 4 minutes, so each click does not log in again.
const POOL = new Map(); // account id -> { client, connecting, timer }
const IDLE_MS = 4 * 60 * 1000;

function dropClient(id) {
  const e = POOL.get(id);
  POOL.delete(id);
  if (e?.timer) clearTimeout(e.timer);
  if (e?.client) e.client.logout().catch(() => e.client.close());
}

function touch(id, entry) {
  clearTimeout(entry.timer);
  entry.timer = setTimeout(() => { if (POOL.get(id) === entry) dropClient(id); }, IDLE_MS);
  entry.timer.unref?.();
}

async function getClient(acc) {
  const have = POOL.get(acc.id);
  if (have?.client?.usable) { touch(acc.id, have); return have.client; }
  if (have?.connecting) return have.connecting;
  if (have) dropClient(acc.id);
  const entry = { client: null, connecting: null, timer: null };
  POOL.set(acc.id, entry);
  entry.connecting = (async () => {
    const client = new ImapFlow({
      ...SERVERS[acc.kind].imap,
      auth: await imapAuth(acc),
      logger: false,
      connectionTimeout: 20000,
      greetingTimeout: 15000,
      socketTimeout: 90000,
    });
    client.on('error', () => {}); // surfaced through the awaited calls
    client.on('close', () => { if (POOL.get(acc.id) === entry) POOL.delete(acc.id); });
    await client.connect();
    entry.client = client;
    entry.connecting = null;
    touch(acc.id, entry);
    return client;
  })().catch((err) => {
    if (POOL.get(acc.id) === entry) POOL.delete(acc.id);
    throw err;
  });
  return entry.connecting;
}

export async function withImap(acc, fn) {
  const problem = setupProblem(acc);
  if (problem) throw new Error(`${acc.email}: ${problem}`);
  const attempt = async () => {
    const client = await getClient(acc);
    try {
      return await fn(client);
    } catch (e) {
      if (!client.usable) dropClient(acc.id);
      throw e;
    }
  };
  const run = async () => {
    try {
      return await attempt();
    } catch (e) {
      // A reused connection may have been closed by the server: try once more on a fresh one.
      if (POOL.has(acc.id) || !/closed|ECONNRESET|EPIPE|not usable|Connection not available|NoConnection/i.test(String(e?.message || e?.code))) throw e;
      return attempt();
    }
  };
  return withTimeout(run(), OP_TIMEOUT, `${acc.email}`);
}

// ---------- folders ----------

const ALIASES = { inbox: 'INBOX', all: '\\All', trash: '\\Trash', spam: '\\Junk', junk: '\\Junk', sent: '\\Sent', archive: '\\Archive', drafts: '\\Drafts' };

async function specialPath(client, use) {
  if (use === 'INBOX') return 'INBOX';
  const list = await client.list();
  const hit = list.find((f) => f.specialUse === use);
  if (hit) return hit.path;
  if (use === '\\Archive') {
    const byName = list.find((f) => /^archive$/i.test(f.name));
    if (byName) return byName.path;
  }
  throw new Error(`This mailbox has no ${use} folder`);
}

async function resolveFolder(client, acc, folder, fallback) {
  const f = folder || fallback || (acc.kind === 'gmail' ? 'all' : 'inbox');
  const alias = ALIASES[String(f).toLowerCase()];
  return alias ? specialPath(client, alias) : f;
}

export async function listFolders(accountId) {
  const acc = getAccount(accountId);
  return withImap(acc, async (client) => {
    const list = await client.list();
    return list.map((f) => ({ path: f.path, specialUse: f.specialUse || null }));
  });
}

// ---------- accounts overview ----------

export async function accountStatus(acc) {
  const base = { id: acc.id, address: acc.email, type: acc.kind };
  const problem = setupProblem(acc);
  if (problem) return { ...base, status: problem };
  try {
    const st = await withImap(acc, (c) => c.status('INBOX', { unseen: true, messages: true }));
    return { ...base, status: 'ok', inbox_unread: st.unseen, inbox_total: st.messages };
  } catch (e) {
    return { ...base, status: `error: ${cleanError(e)}` };
  }
}

export async function listAccounts() {
  return Promise.all(ACCOUNTS.map(accountStatus));
}

export function cleanError(e) {
  if (e?.errors?.length) e = e.errors[0]; // network errors arrive as AggregateError
  const msg = e?.responseText || e?.message || e?.code || String(e);
  if (/AUTHENTICATIONFAILED|Invalid credentials|authenticat/i.test(msg)) {
    return `${msg} (check the app password / sign-in)`;
  }
  return msg;
}

// ---------- search ----------

function hasAttachment(node) {
  if (!node) return false;
  if (node.disposition === 'attachment') return true;
  return (node.childNodes || []).some(hasAttachment);
}

const addr = (list) => (list || []).map((a) => (a.name ? `${a.name} <${a.address}>` : a.address)).join(', ');

async function searchOne(acc, opts) {
  const limit = Math.min(Math.max(opts.limit || 20, 1), 50);
  return withImap(acc, async (client) => {
    const path = await resolveFolder(client, acc, opts.folder);
    const lock = await client.getMailboxLock(path, { readOnly: true });
    try {
      let criteria;
      if (acc.kind === 'gmail') {
        const parts = [];
        if (opts.query) parts.push(opts.query);
        if (opts.unread_only) parts.push('is:unread');
        if (opts.from) parts.push(`from:(${opts.from})`);
        if (opts.since) parts.push(`after:${opts.since.replaceAll('-', '/')}`);
        criteria = parts.length ? { gmraw: parts.join(' ') } : { all: true };
      } else {
        criteria = {};
        if (opts.query) criteria.or = [{ subject: opts.query }, { body: opts.query }];
        if (opts.unread_only) criteria.seen = false;
        if (opts.from) criteria.from = opts.from;
        if (opts.since) criteria.since = new Date(opts.since);
        if (!Object.keys(criteria).length) criteria.all = true;
      }
      const uids = (await client.search(criteria, { uid: true })) || [];
      const pick = uids.sort((a, b) => b - a).slice(0, limit);
      if (!pick.length) return { folder: path, total_matches: uids.length, messages: [] };
      const fields = { uid: true, envelope: true, flags: true, bodyStructure: true, internalDate: true, size: true };
      if (acc.kind === 'gmail') fields.labels = true;
      const messages = [];
      for await (const m of client.fetch(pick, fields, { uid: true })) {
        messages.push({
          account: acc.id,
          folder: path,
          uid: m.uid,
          date: (m.envelope?.date || m.internalDate)?.toISOString?.() || null,
          from: addr(m.envelope?.from),
          to: addr(m.envelope?.to),
          subject: m.envelope?.subject || '',
          unread: !m.flags?.has('\\Seen'),
          has_attachments: hasAttachment(m.bodyStructure),
          size_kb: Math.round((m.size || 0) / 1024),
          ...(m.labels ? { labels: [...m.labels] } : {}),
        });
      }
      messages.sort((a, b) => String(b.date).localeCompare(String(a.date)));
      return { folder: path, total_matches: uids.length, messages };
    } finally {
      lock.release();
    }
  });
}

export async function searchEmails(opts) {
  const targets = !opts.account || opts.account === 'all' ? ACCOUNTS : [getAccount(opts.account)];
  const results = await Promise.all(
    targets.map(async (acc) => {
      const problem = setupProblem(acc);
      if (problem && targets.length > 1) return { account: acc.id, skipped: problem };
      try {
        return { account: acc.id, ...(await searchOne(acc, opts)) };
      } catch (e) {
        return { account: acc.id, error: cleanError(e) };
      }
    }),
  );
  return results;
}

// ---------- read ----------

function rawHeaderBlock(source) {
  const s = source.toString('utf8', 0, Math.min(source.length, 200000));
  const end = s.search(/\r?\n\r?\n/);
  return (end === -1 ? s : s.slice(0, end)).replace(/\r?\n[ \t]+/g, ' ');
}

function headerFromBlock(block, name) {
  const re = new RegExp(`^${name}:[ \\t]*(.*)$`, 'im');
  const m = block.match(re);
  return m ? m[1].trim() : null;
}

function findTextPart(node, type) {
  if (!node) return null;
  if (node.type === type && node.disposition !== 'attachment') return node.part || '1';
  for (const c of node.childNodes || []) {
    const hit = findTextPart(c, type);
    if (hit) return hit;
  }
  return null;
}

async function streamToString(stream) {
  const chunks = [];
  for await (const c of stream) chunks.push(c);
  return Buffer.concat(chunks).toString('utf8');
}

const htmlToText = (html) =>
  html
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<(style|script|title)[\s\S]*?<\/\1>/gi, '')
    .replace(/<(span|div|p|td)[^>]*display\s*:\s*none[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<a\b[^>]*href="(https?:[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (m, href, inner) => {
      const label = inner.replace(/<[^>]+>/g, '').trim();
      return label && !/^https?:/.test(label) && label.length < 60 ? `${label} [${href.length > 120 ? href.slice(0, 120) + '…' : href}]` : label || '';
    })
    .replace(/<br\s*\/?>|<\/(p|div|tr|li|h\d)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (m, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/[\u034f\u00ad\u200b-\u200f\u2007\u2060\ufeff]/g, '')
    .replace(/[ \t\u00a0]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

function bestText(parsed) {
  const t = parsed.text || '';
  const looksHtml = /<(html|body|table|div|!doctype)\b/i.test(t);
  if (parsed.html && (!t.trim() || looksHtml)) return htmlToText(parsed.html);
  return looksHtml ? htmlToText(t) : t;
}

async function fetchMessage(client, uid) {
  const meta = await client.fetchOne(uid, { uid: true, size: true, bodyStructure: true, flags: true }, { uid: true });
  if (!meta) throw new Error(`No message with uid ${uid} in this folder`);
  if (meta.size <= FULL_PARSE_LIMIT) {
    const full = await client.fetchOne(uid, { source: true }, { uid: true });
    const parsed = await simpleParser(full.source);
    const block = rawHeaderBlock(full.source);
    return {
      parsed,
      block,
      text: bestText(parsed),
      html: typeof parsed.html === 'string' ? parsed.html : null,
      attachments: (parsed.attachments || []).map((a) => ({ name: a.filename || '(no name)', type: a.contentType, size_kb: Math.round(a.size / 1024) })),
      flags: meta.flags,
    };
  }
  // Large message: headers + first text part only.
  const head = await client.fetchOne(uid, { headers: true }, { uid: true });
  const parsed = await simpleParser(head.headers);
  const block = rawHeaderBlock(head.headers);
  let text = '(message too large to read in full)';
  const plain = findTextPart(meta.bodyStructure, 'text/plain');
  const html = findTextPart(meta.bodyStructure, 'text/html');
  const part = plain || html;
  if (part) {
    const dl = await client.download(uid, part, { uid: true });
    const body = await streamToString(dl.content);
    text = plain ? body : htmlToText(body);
  }
  return { parsed, block, text, attachments: [{ name: '(large message: attachments not listed)' }], flags: meta.flags };
}

export async function readEmail({ account, folder, uid, includeHtml = false }) {
  const acc = getAccount(account);
  return withImap(acc, async (client) => {
    const path = await resolveFolder(client, acc, folder, 'inbox');
    const lock = await client.getMailboxLock(path, { readOnly: true }); // read-only: does not mark as read
    try {
      const m = await fetchMessage(client, Number(uid));
      const p = m.parsed;
      let body = m.text || '';
      const cut = body.length > BODY_LIMIT;
      if (cut) body = body.slice(0, BODY_LIMIT) + `\n\n[cut at ${BODY_LIMIT} characters of ${m.text.length}]`;
      return {
        account: acc.id,
        folder: path,
        uid: Number(uid),
        from: p.from?.text || '',
        to: p.to?.text || '',
        cc: p.cc?.text || '',
        date: p.date?.toISOString?.() || null,
        subject: p.subject || '',
        message_id: p.messageId || null,
        unread: !m.flags?.has('\\Seen'),
        body,
        attachments: m.attachments,
        ...(includeHtml && m.html && m.html.length < 600000 ? { html: m.html } : {}),
        list_unsubscribe: headerFromBlock(m.block, 'List-Unsubscribe'),
        list_unsubscribe_post: headerFromBlock(m.block, 'List-Unsubscribe-Post'),
      };
    } finally {
      lock.release();
    }
  });
}

// ---------- changes ----------

const toUids = (uids) => (Array.isArray(uids) ? uids : [uids]).map(Number).filter((n) => Number.isInteger(n) && n > 0);

async function changeMessages(account, folder, uids, action) {
  const acc = getAccount(account);
  const list = toUids(uids);
  if (!list.length) throw new Error('No valid uids given');
  return withImap(acc, async (client) => {
    const path = await resolveFolder(client, acc, folder, 'inbox');
    const lock = await client.getMailboxLock(path);
    try {
      const result = await action(client, acc, path, list);
      return { account: acc.id, folder: path, uids: list, ...result };
    } finally {
      lock.release();
    }
  });
}

export const markRead = ({ account, folder, uids, read = true }) =>
  changeMessages(account, folder, uids, async (client, _acc, _path, list) => {
    if (read) await client.messageFlagsAdd(list, ['\\Seen'], { uid: true });
    else await client.messageFlagsRemove(list, ['\\Seen'], { uid: true });
    return { done: read ? 'marked as read' : 'marked as unread' };
  });

export const archiveEmails = ({ account, folder, uids }) =>
  changeMessages(account, folder, uids, async (client, acc, path, list) => {
    if (acc.kind === 'gmail' && client.capabilities.has('X-GM-EXT-1')) {
      await client.messageFlagsRemove(list, ['\\Inbox'], { uid: true, useLabels: true });
      return { done: 'archived (removed from Inbox, still in All Mail)' };
    }
    const dest = await specialPath(client, '\\Archive');
    if (dest === path) return { done: 'already in Archive' };
    await client.messageMove(list, dest, { uid: true });
    return { done: `moved to ${dest}` };
  });

export const trashEmails = ({ account, folder, uids }) =>
  changeMessages(account, folder, uids, async (client, _acc, path, list) => {
    const dest = await specialPath(client, '\\Trash');
    if (dest === path) return { done: 'already in Trash (nothing deleted for good)' };
    await client.messageMove(list, dest, { uid: true });
    return { done: `moved to ${dest} (can be restored)` };
  });

export const markSpam = ({ account, folder, uids }) =>
  changeMessages(account, folder, uids, async (client, _acc, path, list) => {
    const dest = await specialPath(client, '\\Junk');
    if (dest === path) return { done: 'already in Spam' };
    await client.messageMove(list, dest, { uid: true });
    return { done: `moved to ${dest}` };
  });

// ---------- sending ----------

async function transportFor(acc) {
  const problem = setupProblem(acc);
  if (problem) throw new Error(`${acc.email}: ${problem}`);
  const auth =
    acc.kind === 'gmail'
      ? { user: acc.email, pass: process.env[acc.secret].replace(/\s+/g, '') }
      : { type: 'OAuth2', user: acc.email, accessToken: await ms.accessToken() };
  return nodemailer.createTransport({ ...SERVERS[acc.kind].smtp, auth, connectionTimeout: 20000, socketTimeout: 60000 });
}

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function withSignature(body, sigName = 'general') {
  const sig = SIGNATURES[sigName] ?? SIGNATURES.general;
  const text = sig.length ? `${body.trimEnd()}\n\n${sig.join('\n')}` : body;
  const htmlBody = `<div>${escapeHtml(body.trimEnd()).replace(/\n/g, '<br>')}</div>`;
  const htmlSig = sig.length
    ? `<br><div><b>${escapeHtml(sig[0])}</b>${sig.slice(1).map((l) => `<br>${escapeHtml(l)}`).join('')}</div>`
    : '';
  return { text, html: `${htmlBody}${htmlSig}` };
}

const asList = (v) => (Array.isArray(v) ? v : v ? [v] : []).map(String).filter(Boolean);

export async function sendEmail({ account, to, cc, bcc, subject, body, signature = 'general', reply_to }) {
  const acc = getAccount(account);
  const toList = asList(to);
  if (!toList.length) throw new Error('At least one "to" address is needed');
  let inReplyTo;
  let references;
  let finalSubject = subject;
  if (reply_to) {
    const orig = await withImap(acc, async (client) => {
      const path = await resolveFolder(client, acc, reply_to.folder, 'inbox');
      const lock = await client.getMailboxLock(path, { readOnly: true });
      try {
        const head = await client.fetchOne(Number(reply_to.uid), { headers: true }, { uid: true });
        if (!head) throw new Error('Original message not found for reply');
        return simpleParser(head.headers);
      } finally {
        lock.release();
      }
    });
    inReplyTo = orig.messageId;
    const refs = Array.isArray(orig.references) ? orig.references : orig.references ? [orig.references] : [];
    references = [...refs, orig.messageId].filter(Boolean);
    if (!finalSubject) finalSubject = /^re:/i.test(orig.subject || '') ? orig.subject : `Re: ${orig.subject || ''}`;
  }
  if (!finalSubject) throw new Error('A subject is needed');
  const { text, html } = withSignature(String(body || ''), signature);
  const transport = await transportFor(acc);
  const info = await transport.sendMail({
    from: { name: 'Bachelin Max Etienne', address: acc.email },
    to: toList,
    cc: asList(cc),
    bcc: asList(bcc),
    subject: finalSubject,
    text,
    html,
    inReplyTo,
    references,
  });
  return { account: acc.id, sent: true, message_id: info.messageId, accepted: info.accepted, rejected: info.rejected };
}

// ---------- unsubscribe ----------

export function parseListUnsubscribe(value) {
  const out = { https: null, mailto: null };
  if (!value) return out;
  for (const m of value.matchAll(/<([^>]+)>/g)) {
    const link = m[1].trim();
    if (/^https:\/\//i.test(link) && !out.https) out.https = link;
    if (/^mailto:/i.test(link) && !out.mailto) out.mailto = link;
  }
  return out;
}

export function parseMailto(link) {
  const u = new URL(link);
  return {
    to: decodeURIComponent(u.pathname),
    subject: u.searchParams.get('subject') || 'unsubscribe',
    body: u.searchParams.get('body') || 'unsubscribe',
  };
}

export async function unsubscribe({ account, folder, uid }) {
  const msg = await readEmail({ account, folder, uid });
  const links = parseListUnsubscribe(msg.list_unsubscribe);
  const base = { account: msg.account, from: msg.from, subject: msg.subject };
  if (links.https && /one-click/i.test(msg.list_unsubscribe_post || '')) {
    const res = await fetch(links.https, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: 'List-Unsubscribe=One-Click',
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    });
    return { ...base, method: 'one-click', http_status: res.status, done: res.ok };
  }
  if (links.mailto) {
    const m = parseMailto(links.mailto);
    const acc = getAccount(account);
    const transport = await transportFor(acc);
    await transport.sendMail({ from: acc.email, to: m.to, subject: m.subject, text: m.body });
    return { ...base, method: 'email', sent_to: m.to, done: true };
  }
  if (links.https) return { ...base, method: 'website', done: false, link: links.https, note: 'needs a click on their website' };
  return { ...base, method: 'none', done: false, note: 'this email has no unsubscribe header' };
}
