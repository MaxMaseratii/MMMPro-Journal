// Live inbox cache: the engine keeps every Inbox in memory and checks each one every 30 seconds,
// so the Mail tab opens from memory in milliseconds. The newest emails are also opened ahead of time,
// so clicking them is instant.
import { ACCOUNTS } from './accounts.js';
import * as mail from './mail.js';

const SYNC_MS = 30 * 1000;
const LIST_SIZE = 50; // newest Inbox emails kept per account
const PREFETCH = 10; // newest emails per account opened ahead of time
const READ_MAX = 150; // opened emails kept in memory

const state = new Map(); // account id -> { status, unread, total, uidNext, folder, rows, syncedAt }
const reads = new Map(); // "account|folder|uid" -> message (oldest first, trimmed to READ_MAX)
const busy = new Map(); // account id -> running sync promise
let first = null;

export const readKey = (account, folder, uid) => `${account}|${folder}|${uid}`;

export function getRead(key) {
  const m = reads.get(key);
  if (!m) return null;
  reads.delete(key);
  reads.set(key, m);
  return m;
}

export function putRead(key, msg) {
  reads.delete(key);
  reads.set(key, msg);
  while (reads.size > READ_MAX) reads.delete(reads.keys().next().value);
}

const snippetOf = (body) => String(body || '').replace(/\[https?:[^\]]*\]/g, '').replace(/\s+/g, ' ').trim().slice(0, 160);

async function prefetch(acc, folder, rows) {
  for (const r of rows) {
    const key = readKey(acc.id, folder, r.uid);
    let msg = reads.get(key);
    if (!msg) {
      try {
        msg = await mail.readEmail({ account: acc.id, folder, uid: r.uid, includeHtml: true });
        putRead(key, msg);
      } catch {
        continue;
      }
    }
    r.snippet = r.snippet || snippetOf(msg.body);
  }
}

function syncAccount(acc, force = false) {
  if (busy.has(acc.id)) return busy.get(acc.id);
  const job = (async () => {
    const prev = state.get(acc.id);
    const problem = mail.setupProblem(acc);
    if (problem) {
      state.set(acc.id, { status: problem, rows: [], syncedAt: Date.now() });
      return;
    }
    try {
      const st = await mail.withImap(acc, (c) => c.status('INBOX', { unseen: true, messages: true, uidNext: true }));
      const same = !force && prev?.status === 'ok' && prev.uidNext === st.uidNext && prev.unread === st.unseen && prev.total === st.messages;
      let rows = prev?.rows || [];
      let folder = prev?.folder || 'INBOX';
      if (!same) {
        const r = await mail.searchOne(acc, { folder: 'inbox', limit: LIST_SIZE });
        folder = r.folder;
        const old = new Map((prev?.rows || []).map((x) => [x.uid, x]));
        rows = r.messages.map((m) => ({ ...m, snippet: old.get(m.uid)?.snippet || snippetOf(reads.get(readKey(acc.id, folder, m.uid))?.body) || '' }));
      }
      state.set(acc.id, { status: 'ok', unread: st.unseen, total: st.messages, uidNext: st.uidNext, folder, rows, syncedAt: Date.now() });
      prefetch(acc, folder, rows.slice(0, PREFETCH)).catch(() => {});
    } catch (e) {
      state.set(acc.id, { ...(prev || { rows: [] }), status: `error: ${mail.cleanError(e)}`, syncedAt: Date.now() });
    }
  })().finally(() => busy.delete(acc.id));
  busy.set(acc.id, job);
  return job;
}

export function syncAll(force = false) {
  return Promise.all(ACCOUNTS.map((a) => syncAccount(a, force)));
}

export function start() {
  first = syncAll(true);
  setInterval(() => syncAll(false), SYNC_MS);
}

export function ready(ms = 15000) {
  return Promise.race([first || syncAll(true), new Promise((r) => setTimeout(r, ms))]);
}

export function snapshot({ account = 'all', unreadOnly = false, limit = 80 } = {}) {
  const accounts = ACCOUNTS.map((a) => {
    const s = state.get(a.id) || { status: 'starting', rows: [] };
    return { id: a.id, address: a.email, type: a.kind, status: s.status, inbox_unread: s.unread ?? null, inbox_total: s.total ?? null, synced_at: s.syncedAt || null };
  });
  let rows = [];
  for (const a of ACCOUNTS) {
    if (account !== 'all' && account !== a.id) continue;
    rows = rows.concat((state.get(a.id)?.rows || []).filter((r) => !unreadOnly || r.unread));
  }
  rows.sort((x, y) => String(y.date).localeCompare(String(x.date)));
  const times = accounts.map((a) => a.synced_at).filter(Boolean);
  return { accounts, rows: rows.slice(0, limit), synced_at: times.length ? Math.min(...times) : null };
}

// After an action on the page, update memory at once, then re-check that inbox for real.
export function applyAction(account, folder, uids, action) {
  const acc = ACCOUNTS.find((a) => a.id === account);
  const s = state.get(account);
  if (!acc || !s) return;
  const set = new Set((uids || []).map(Number));
  if (folder === s.folder) {
    if (action === 'trash' || action === 'archive' || action === 'spam') {
      const gone = s.rows.filter((r) => set.has(r.uid));
      s.unread = Math.max(0, (s.unread || 0) - gone.filter((r) => r.unread).length);
      s.rows = s.rows.filter((r) => !set.has(r.uid));
    } else if (action === 'read' || action === 'unread') {
      for (const r of s.rows) {
        if (!set.has(r.uid)) continue;
        if (r.unread && action === 'read') s.unread = Math.max(0, (s.unread || 0) - 1);
        if (!r.unread && action === 'unread') s.unread = (s.unread || 0) + 1;
        r.unread = action === 'unread';
      }
    }
  }
  if (action === 'trash' || action === 'archive' || action === 'spam') for (const u of set) reads.delete(readKey(account, folder, u));
  setTimeout(() => syncAccount(acc, true), 1500);
}
