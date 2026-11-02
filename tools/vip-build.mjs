#!/usr/bin/env node
/* MMM V.I.P area - build the encrypted files.
 *
 * The repo is PUBLIC, so VIP tools are never committed as readable files. This script:
 *   1. makes a new random content key,
 *   2. wraps that key once per access code (PBKDF2-SHA256, 300,000 rounds → AES-256-GCM)  → vip/keys.json
 *   3. gzips + encrypts each VIP tool with the content key                                 → vip/<tool>/payload.json
 *
 * Usage (codes are NEVER saved in the repo - keep them somewhere private):
 *   node tools/vip-build.mjs --codes "CODE-ONE,CODE-TWO" --src game-plan=/path/to/MMM_Game_Plan_Builder.html [--key BASE64]
 *
 *   --key     reuse the content key (member codes from the sign-up link keep working). Leave it out only to
 *             start fresh: every saved device and the Apps Script key must then be updated.
 *   --codes   comma-separated access codes. Letters and numbers only count; case and dashes are ignored.
 *   --src     one or more tool=path pairs (repeat --src). Each becomes vip/<tool>/payload.json.
 *
 * --codes are MASTER codes (yours): they open the V.I.P area even if the sign-up server is down.
 * Member codes are made by the private sign-up link (tools/vip-apps-script.gs) and live in the Google Sheet.
 * The source HTML files must stay OUTSIDE this repo.
 */
import { webcrypto as crypto } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ITER = 300000;
const args = process.argv.slice(2);
const val = name => { const out = []; args.forEach((a, i) => { if (a === name && args[i + 1]) out.push(args[i + 1]); }); return out; };
const codes = (val('--codes')[0] || '').split(',').map(c => c.toUpperCase().replace(/[^A-Z0-9]/g, '')).filter(Boolean);
const srcs = val('--src').map(s => { const i = s.indexOf('='); return [s.slice(0, i), s.slice(i + 1)]; });
if (!codes.length || !srcs.length) { console.error('Need --codes "A,B" and at least one --src tool=path'); process.exit(1); }
if (codes.some(c => c.length < 10)) { console.error('Each code needs at least 10 letters/numbers.'); process.exit(1); }

const b64 = u => Buffer.from(u).toString('base64');
const rnd = n => crypto.getRandomValues(new Uint8Array(n));
const enc = new TextEncoder();

// --key keeps the same content key (needed once the sign-up link is live: the Apps Script hands this key to member codes).
// Without --key a new key is made and printed: put it in the Apps Script property VIP_CONTENT_KEY.
const keyArg = val('--key')[0];
const keyRaw = keyArg ? new Uint8Array(Buffer.from(keyArg, 'base64')) : rnd(32);
if (keyRaw.length !== 32) { console.error('--key must be the 32-byte base64 content key'); process.exit(1); }
const contentKey = await crypto.subtle.importKey('raw', keyRaw, { name: 'AES-GCM' }, false, ['encrypt']);

const slots = [];
for (const code of codes) {
  const salt = rnd(16), iv = rnd(12);
  const base = await crypto.subtle.importKey('raw', enc.encode(code), 'PBKDF2', false, ['deriveKey']);
  const wk = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, wk, keyRaw));
  slots.push({ salt: b64(salt), iv: b64(iv), ct: b64(ct) });
}
// shuffle so the slot order says nothing about which code is which
for (let i = slots.length - 1; i > 0; i--) { const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1); [slots[i], slots[j]] = [slots[j], slots[i]]; }
writeFileSync(join(ROOT, 'vip', 'keys.json'), JSON.stringify({ v: 1, iter: ITER, slots }) + '\n');

for (const [tool, path] of srcs) {
  const html = readFileSync(path);
  const iv = rnd(12);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, contentKey, gzipSync(html, { level: 9 })));
  const dir = join(ROOT, 'vip', tool); mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'payload.json'), JSON.stringify({ v: 1, iv: b64(iv), ct: b64(ct) }) + '\n');
  console.log(`vip/${tool}/payload.json  ${(html.length / 1024).toFixed(0)} KB → ${(ct.length / 1024).toFixed(0)} KB encrypted`);
}
console.log(`vip/keys.json  ${slots.length} master code slot(s)`);
if (!keyArg) console.log(`\nNEW CONTENT KEY (keep private; put in Apps Script property VIP_CONTENT_KEY, and pass --key next time):\n${b64(keyRaw)}`);
