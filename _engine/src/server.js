// MiniMax OS engine: the server behind maxmaserati.com/admin.
// - /api/*      used by the admin page (Mail tab); needs the admin's Firebase login.
// - /mcp/<HUB_TOKEN>  the Claude custom connector (all mailboxes as tools).
import crypto from 'node:crypto';
import express from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { buildServer } from './tools.js';
import { ACCOUNTS } from './accounts.js';
import * as mail from './mail.js';
import * as ms from './ms.js';
import { messagePage } from './admin.js';

const PORT = Number(process.env.PORT) || 3000;
const TOKEN = process.env.HUB_TOKEN || '';
const TOKEN_OK = TOKEN.length >= 32;
const PROJECT = process.env.FIREBASE_PROJECT_ID || 'mmm-pro-journal';
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'infotrade@maxmaserati.com').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
const ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://www.maxmaserati.com,https://maxmaserati.com').split(',').map((s) => s.trim());
const ADMIN_PAGE = process.env.ADMIN_PAGE_URL || 'https://www.maxmaserati.com/admin/#mail';
if (!TOKEN_OK) console.error('HUB_TOKEN is missing or shorter than 32 characters: the Claude connector (/mcp) is switched off.');

const JWKS = createRemoteJWKSet(new URL(process.env.FIREBASE_JWKS_URL || 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));
const digest = (s) => crypto.createHash('sha256').update(String(s)).digest();
const tokenMatches = (t) => TOKEN_OK && crypto.timingSafeEqual(digest(t), digest(TOKEN));

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', true);

// Logging without secrets: method, first path segment, status.
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const path = (req.originalUrl || '').split('?')[0];
    const seg = path.split('/')[1] || '';
    const shown = seg === 'mcp' || seg === 'oauth' ? `/${seg}/***` : seg === 'api' ? path : path === '/healthz' ? '/healthz' : '/(other)';
    console.log(`${req.method} ${shown} ${res.statusCode} ${Date.now() - start}ms`);
  });
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cache-Control', 'no-store');
  next();
});

const notFound = (_req, res) => res.status(404).type('text/plain').send('Not found');
app.get('/healthz', (_req, res) => res.type('text/plain').send('ok'));

// ---------- Claude connector (stateless Streamable HTTP) ----------
const guard = (req, res, next) => (tokenMatches(req.params.token) ? next() : notFound(req, res));
app.post('/mcp/:token', guard, express.json({ limit: '2mb' }), async (req, res) => {
  const server = buildServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  res.on('close', () => {
    transport.close();
    server.close();
  });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (e) {
    console.error('MCP error:', e?.message);
    if (!res.headersSent) res.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal error' }, id: null });
  }
});
app.all('/mcp/:token', guard, (_req, res) =>
  res.status(405).set('Allow', 'POST').json({ jsonrpc: '2.0', error: { code: -32000, message: 'Method not allowed' }, id: null }),
);

// ---------- Admin page API ----------
const api = express.Router();
api.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Max-Age', '600');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});
api.use(async (req, res, next) => {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || '');
  if (!m) return res.status(401).json({ ok: false, code: 'auth', error: 'Log in on the admin page first.' });
  try {
    const { payload } = await jwtVerify(m[1], JWKS, { issuer: `https://securetoken.google.com/${PROJECT}`, audience: PROJECT });
    const email = String(payload.email || '').toLowerCase();
    if (!ADMIN_EMAILS.includes(email)) return res.status(403).json({ ok: false, code: 'notadmin', email });
    if (!payload.email_verified) return res.status(403).json({ ok: false, code: 'unverified', email });
    req.admin = email;
    next();
  } catch {
    res.status(401).json({ ok: false, code: 'auth', error: 'Login expired. Reload the page.' });
  }
});
api.use(express.json({ limit: '1mb' }));

const run = (fn) => async (req, res) => {
  try {
    res.json({ ok: true, ...(await fn(req)) });
  } catch (e) {
    res.status(400).json({ ok: false, error: mail.cleanError(e) });
  }
};

api.get('/overview', run(async () => {
  const missing = ACCOUNTS.filter((a) => a.secret && !process.env[a.secret]).map((a) => `${a.secret} (app password for ${a.email})`);
  if (!ms.msConfigured()) missing.push('MS_CLIENT_ID and MS_CLIENT_SECRET (only for Hotmail)');
  if (!TOKEN_OK) missing.push('HUB_TOKEN (32+ random characters, turns on the Claude connector)');
  return {
    accounts: await mail.listAccounts(),
    connector_url: TOKEN_OK ? `${ms.publicBase()}/mcp/${TOKEN}` : null,
    hotmail: { configured: ms.msConfigured(), connected: ms.msConnected() },
    missing,
  };
}));

api.get('/search', run(async (req) => {
  const q = req.query;
  return {
    results: await mail.searchEmails({
      account: q.account || 'all',
      query: q.q || undefined,
      folder: q.folder || 'inbox',
      unread_only: q.unread === '1',
      limit: Math.min(Number(q.limit) || 25, 50),
    }),
  };
}));

api.get('/read', run(async (req) => ({ message: await mail.readEmail({ account: req.query.account, folder: req.query.folder, uid: Number(req.query.uid) }) })));

const ACTIONS = {
  trash: mail.trashEmails,
  archive: mail.archiveEmails,
  spam: mail.markSpam,
  read: (a) => mail.markRead({ ...a, read: true }),
  unread: (a) => mail.markRead({ ...a, read: false }),
};
api.post('/act', run(async (req) => {
  const { action, account, folder, uids } = req.body || {};
  if (!ACTIONS[action]) throw new Error(`Unknown action "${action}"`);
  return { result: await ACTIONS[action]({ account, folder, uids }) };
}));

api.post('/unsubscribe', run(async (req) => ({ result: await mail.unsubscribe(req.body || {}) })));

api.get('/ms/connect', run(async () => {
  if (!ms.msConfigured()) throw new Error('Add MS_CLIENT_ID and MS_CLIENT_SECRET first.');
  return { url: ms.authUrl(ACCOUNTS.find((a) => a.kind === 'outlook')?.email) };
}));

app.use('/api', api);

// Microsoft sends the browser back here after the Hotmail sign-in.
app.get('/oauth/ms/callback', async (req, res) => {
  const { code, state, error, error_description: desc } = req.query;
  if (!state || !ms.checkState(String(state))) return notFound(req, res);
  if (error) return res.status(400).type('html').send(messagePage('Hotmail not connected', String(desc || error), ADMIN_PAGE));
  try {
    await ms.exchangeCode(String(code));
    res.type('html').send(messagePage('Hotmail connected', 'Go back to the admin page.', ADMIN_PAGE));
  } catch (e) {
    res.status(400).type('html').send(messagePage('Hotmail not connected', e.message, ADMIN_PAGE));
  }
});

app.use(notFound);

app.listen(PORT, () => {
  console.log(`MiniMax OS engine listening on ${PORT}`);
  const missing = ACCOUNTS.filter((a) => a.secret && !process.env[a.secret]).map((a) => a.secret);
  if (missing.length) console.log(`Missing app passwords: ${missing.join(', ')}`);
});
