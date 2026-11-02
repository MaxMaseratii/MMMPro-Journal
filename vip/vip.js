/* MMM V.I.P area - unlock + decrypt.
 * The VIP tools are stored ENCRYPTED in this public repo (AES-256-GCM). Nothing readable is on the server.
 * An access code unlocks the content key (PBKDF2-SHA256 → AES-GCM key wrap, one "slot" per code in keys.json).
 * The content key is then kept in this browser (localStorage) so the member does not type the code every time.
 * Build / change codes: node tools/vip-build.mjs (see the notes at the top of that file).
 */
(function () {
  'use strict';
  var KEY_STORE = 'mmmVipKey', CODE_STORE = 'mmmVipCode', CHECK_STORE = 'mmmVipCheck';
  var RECHECK_MS = 12 * 3600 * 1000; // re-check a member code with the server twice a day
  var enc = new TextEncoder();

  function b64(s) { var bin = atob(s), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
  function tob64(u) { var s = ''; for (var i = 0; i < u.length; i++) s += String.fromCharCode(u[i]); return btoa(s); }
  function norm(code) { return String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
  function store(k) { try { localStorage.setItem(KEY_STORE, k); } catch (e) {} try { sessionStorage.setItem(KEY_STORE, k); } catch (e) {} }
  function saved() { var k = null; try { k = localStorage.getItem(KEY_STORE); } catch (e) {} if (!k) { try { k = sessionStorage.getItem(KEY_STORE); } catch (e) {} } return k; }

  function supported() { return !!(window.crypto && crypto.subtle && window.DecompressionStream); }

  async function wrapKey(code, salt, iter) {
    var base = await crypto.subtle.importKey('raw', enc.encode(norm(code)), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  }

  function api() { return (window.MMM_VIP_API || '').trim(); }
  async function call(body) {
    var res = await fetch(api(), { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error('api');
    return res.json();
  }
  function put(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* Member codes are checked by the server (so a revoked code stops working); master codes open keys.json offline.
   * Returns true and remembers the content key when the code is good. */
  async function unlock(code) {
    if (!norm(code)) return false;
    if (api()) {
      try {
        var r = await call({ action: 'verify', code: code });
        if (r && r.ok && r.key) { store(r.key); put(CODE_STORE, code); put(CHECK_STORE, String(Date.now())); return true; }
      } catch (e) { /* server not reachable: try the master codes below */ }
    }
    var res = await fetch('/vip/keys.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('keys');
    var k = await res.json();
    for (var i = 0; i < k.slots.length; i++) {
      var s = k.slots[i];
      try {
        var wk = await wrapKey(code, b64(s.salt), k.iter);
        var raw = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(s.iv) }, wk, b64(s.ct)));
        store(tob64(raw));
        return true;
      } catch (e) { /* not this slot */ }
    }
    return false;
  }

  async function contentKey() {
    var k = saved(); if (!k) return null;
    return crypto.subtle.importKey('raw', b64(k), { name: 'AES-GCM' }, false, ['decrypt']);
  }

  /* Fetch + decrypt + gunzip one payload file. Returns the text, or null if this device has no (valid) key. */
  async function open(url) {
    var key = await contentKey(); if (!key) return null;
    var res = await fetch(url, { cache: 'no-store' }); if (!res.ok) throw new Error('payload');
    var p = await res.json();
    var plain;
    try { plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(p.iv) }, key, b64(p.ct)); }
    catch (e) { lock(); return null; } // codes were changed: the old key no longer opens anything
    var stream = new Blob([plain]).stream().pipeThrough(new DecompressionStream('gzip'));
    return await new Response(stream).text();
  }

  function lock() { [KEY_STORE, CODE_STORE, CHECK_STORE].forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} try { sessionStorage.removeItem(k); } catch (e) {} }); }

  /* Twice a day, ask the server if this device's member code is still active. Revoked -> lock. No network -> keep. */
  async function recheck() {
    var code = get(CODE_STORE); if (!code || !api()) return true;
    if (Date.now() - Number(get(CHECK_STORE) || 0) < RECHECK_MS) return true;
    try {
      var r = await call({ action: 'verify', code: code });
      if (r && r.ok && r.key) { store(r.key); put(CHECK_STORE, String(Date.now())); return true; }
      if (r && (r.revoked || r.unknown)) { lock(); return false; }
    } catch (e) {}
    return true;
  }

  async function checkLink(t) { return call({ action: 'check', t: t }); }
  async function claim(t, email) { return call({ action: 'claim', t: t, email: email }); }

  window.MMMVip = { supported: supported, unlock: unlock, open: open, lock: lock, recheck: recheck, checkLink: checkLink, claim: claim, hasApi: function () { return !!api(); }, hasKey: function () { return !!saved(); } };
})();
