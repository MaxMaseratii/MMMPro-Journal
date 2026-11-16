// Microsoft OAuth for the Outlook.com / Hotmail account (IMAP + SMTP with XOAUTH2).
import crypto from 'node:crypto';
import * as store from './store.js';

const AUTH = 'https://login.microsoftonline.com/consumers/oauth2/v2.0';
const SCOPES = [
  'offline_access',
  'https://outlook.office.com/IMAP.AccessAsUser.All',
  'https://outlook.office.com/SMTP.Send',
].join(' ');

const pendingStates = new Map(); // state -> expiry time
let cached = { token: null, expires: 0 };

export function publicBase() {
  if (process.env.PUBLIC_URL) return process.env.PUBLIC_URL.replace(/\/+$/, '');
  if (process.env.RENDER_EXTERNAL_URL) return process.env.RENDER_EXTERNAL_URL.replace(/\/+$/, '');
  if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  return `http://localhost:${process.env.PORT || 3000}`;
}

export const redirectUri = () => `${publicBase()}/oauth/ms/callback`;
export const msConfigured = () => Boolean(process.env.MS_CLIENT_ID && process.env.MS_CLIENT_SECRET);
export const msConnected = () => Boolean(store.get('ms_refresh_token') || process.env.MS_REFRESH_TOKEN);

export function authUrl(loginHint) {
  const state = crypto.randomBytes(24).toString('hex');
  pendingStates.set(state, Date.now() + 10 * 60 * 1000);
  const p = new URLSearchParams({
    client_id: process.env.MS_CLIENT_ID,
    response_type: 'code',
    redirect_uri: redirectUri(),
    response_mode: 'query',
    scope: SCOPES,
    state,
    prompt: 'select_account',
    login_hint: loginHint,
  });
  return `${AUTH}/authorize?${p}`;
}

export function checkState(state) {
  const exp = pendingStates.get(state);
  pendingStates.delete(state);
  for (const [s, e] of pendingStates) if (e < Date.now()) pendingStates.delete(s);
  return Boolean(exp && exp > Date.now());
}

async function tokenRequest(params) {
  const body = new URLSearchParams({
    client_id: process.env.MS_CLIENT_ID,
    client_secret: process.env.MS_CLIENT_SECRET,
    scope: SCOPES,
    ...params,
  });
  const res = await fetch(`${AUTH}/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
    signal: AbortSignal.timeout(20000),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) {
    throw new Error(`Microsoft sign-in failed: ${json.error_description || json.error || res.status}`);
  }
  if (json.refresh_token) store.set('ms_refresh_token', json.refresh_token);
  cached = { token: json.access_token, expires: Date.now() + (json.expires_in || 3600) * 1000 };
  return json.access_token;
}

export function exchangeCode(code) {
  return tokenRequest({ grant_type: 'authorization_code', code, redirect_uri: redirectUri() });
}

export async function accessToken() {
  if (!msConfigured()) throw new Error('Hotmail needs Microsoft app setup (MS_CLIENT_ID and MS_CLIENT_SECRET).');
  if (cached.token && cached.expires - 120000 > Date.now()) return cached.token;
  const refresh = store.get('ms_refresh_token') || process.env.MS_REFRESH_TOKEN;
  if (!refresh) throw new Error('Hotmail is not connected yet. Open the admin page and press "Connect Hotmail".');
  return tokenRequest({ grant_type: 'refresh_token', refresh_token: refresh });
}
