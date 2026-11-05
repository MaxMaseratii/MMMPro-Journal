#!/usr/bin/env node
/* MMM V.I.P area - add or update V.I.P tools WITHOUT changing the access codes.
 *
 * vip-build.mjs makes the codes (vip/keys.json) and the payloads together. This script only encrypts tools with the
 * EXISTING content key, so every master code and member code keeps working.
 *
 * Usage (the key is NEVER saved in the repo - it is the Apps Script property VIP_CONTENT_KEY):
 *   node tools/vip-add.mjs --key BASE64 --src prop-scale=/path/prop-scale.html --src proof=/path/proof.html
 *
 * Safety: the key is first checked against the live vip/game-plan/payload.json. A wrong key stops here,
 * so it can never publish a tool that members cannot open.
 * The source HTML files must stay OUTSIDE this repo.
 */
import { webcrypto as crypto } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const val = name => { const out = []; args.forEach((a, i) => { if (a === name && args[i + 1]) out.push(args[i + 1]); }); return out; };
const keyArg = val('--key')[0];
const srcs = val('--src').map(s => { const i = s.indexOf('='); return [s.slice(0, i), s.slice(i + 1)]; });
if (!keyArg || !srcs.length) { console.error('Need --key BASE64 and at least one --src tool=path'); process.exit(1); }
const keyRaw = new Uint8Array(Buffer.from(keyArg, 'base64'));
if (keyRaw.length !== 32) { console.error('--key must be the 32-byte base64 content key (VIP_CONTENT_KEY)'); process.exit(1); }
if (srcs.some(([t]) => !/^[a-z0-9-]+$/.test(t) || t === 'claim')) { console.error('Tool names: lowercase letters, numbers and dashes (not "claim")'); process.exit(1); }

const b64 = u => Buffer.from(u).toString('base64');
const ub = s => new Uint8Array(Buffer.from(s, 'base64'));
const key = await crypto.subtle.importKey('raw', keyRaw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);

// 1. is this the live key?
const probe = JSON.parse(readFileSync(join(ROOT, 'vip', 'game-plan', 'payload.json'), 'utf8'));
try { await crypto.subtle.decrypt({ name: 'AES-GCM', iv: ub(probe.iv) }, key, ub(probe.ct)); }
catch (e) { console.error('This key does not open the live Game Plan Builder. Nothing was written.'); process.exit(1); }

// 2. encrypt each tool with it
for (const [tool, path] of srcs) {
  const html = readFileSync(path);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, gzipSync(html, { level: 9 })));
  const dir = join(ROOT, 'vip', tool); mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'payload.json'), JSON.stringify({ v: 1, iv: b64(iv), ct: b64(ct) }) + '\n');
  console.log(`vip/${tool}/payload.json  ${(html.length / 1024).toFixed(0)} KB → ${(ct.length / 1024).toFixed(0)} KB encrypted`);
}
