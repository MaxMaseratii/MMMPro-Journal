/* MMM V.I.P area - unlock, decrypt, sign-up links.
 * The VIP tools are stored ENCRYPTED in this public repo (AES-256-GCM): nothing readable is on the server.
 * Two kinds of codes open them:
 *   - master codes (Max): checked offline against vip/keys.json (PBKDF2-SHA256 key wrap)
 *   - member codes: one per person, made by a private sign-up link, kept in Firebase (Firestore vipCodes).
 *     Revoked codes stop working; unlocked devices re-check every 12 hours and lock themselves.
 * Private sign-up links (Firestore vipLinks) are made by Max on maxmaserati.com/admin/: they expire after
 * 5-60 minutes and take a set number of people. Firestore security rules enforce all of it (tools/vip-firestore.rules).
 */
(function () {
  'use strict';
  var KEY_STORE = 'mmmVipKey', CODE_STORE = 'mmmVipCode', CHECK_STORE = 'mmmVipCheck';
  var RECHECK_MS = 12 * 3600 * 1000;
  var FB_KEY = 'AIzaSyDcrEEhcY6kHLQxZ7RQ37KmAcCDPgol0gg'; // public web key (same as the rest of the site)
  var FS = window.MMM_VIP_FS || 'https://firestore.googleapis.com/v1/projects/mmm-pro-journal/databases/(default)/documents';
  var DOCS = FS.replace(/^https?:\/\/[^/]+\/v1\//, '');
  var ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var enc = new TextEncoder();

  function b64(s) { var bin = atob(s), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
  function tob64(u) { var s = ''; for (var i = 0; i < u.length; i++) s += String.fromCharCode(u[i]); return btoa(s); }
  function norm(code) { return String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
  function pretty(id) { id = norm(id); return id.length === 15 ? id.slice(0, 3) + '-' + id.slice(3, 7) + '-' + id.slice(7, 11) + '-' + id.slice(11) : id; }
  function rand(n) { var b = crypto.getRandomValues(new Uint8Array(n)), s = ''; for (var i = 0; i < n; i++) s += ALPHA.charAt(b[i] % 32); return s; }
  function put(k, v) { try { localStorage.setItem(k, v); } catch (e) {} try { sessionStorage.setItem(k, v); } catch (e) {} }
  function get(k) { var v = null; try { v = localStorage.getItem(k); } catch (e) {} if (!v) { try { v = sessionStorage.getItem(k); } catch (e) {} } return v; }
  function del(k) { try { localStorage.removeItem(k); } catch (e) {} try { sessionStorage.removeItem(k); } catch (e) {} }
  function supported() { return !!(window.crypto && crypto.subtle && window.DecompressionStream); }

  /* ---------- Firestore REST (no SDK needed) ---------- */
  function val(v) {
    if (v === null || v === undefined) return { nullValue: null };
    if (v instanceof Date) return { timestampValue: v.toISOString() };
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    if (typeof v === 'boolean') return { booleanValue: v };
    return { stringValue: String(v) };
  }
  function fields(o) { var f = {}; Object.keys(o).forEach(function (k) { f[k] = val(o[k]); }); return f; }
  function plain(doc) {
    var o = { id: (doc.name || '').split('/').pop() }, f = doc.fields || {};
    Object.keys(f).forEach(function (k) { var x = f[k]; o[k] = 'integerValue' in x ? Number(x.integerValue) : 'doubleValue' in x ? x.doubleValue : 'timestampValue' in x ? Date.parse(x.timestampValue) : 'booleanValue' in x ? x.booleanValue : 'stringValue' in x ? x.stringValue : null; });
    return o;
  }
  function req(method, path, body, token) {
    var h = { 'Content-Type': 'application/json' }; if (token) h.Authorization = 'Bearer ' + token;
    var url = (path.indexOf('http') === 0 ? path : FS + path) + (path.indexOf('?') >= 0 ? '&' : '?') + 'key=' + FB_KEY;
    return fetch(url, { method: method, headers: h, body: body ? JSON.stringify(body) : undefined }).then(function (r) {
      return r.text().then(function (t) { var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {} return { status: r.status, json: j }; });
    });
  }
  function docName(col, id) { return DOCS + '/' + col + '/' + id; }

  /* ---------- keys ---------- */
  function storeKey(k) { put(KEY_STORE, k); }
  async function wrapKey(code, salt, iter) {
    var base = await crypto.subtle.importKey('raw', enc.encode(norm(code)), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  }
  /* member code -> Firestore; returns the content key, or null (revoked / unknown), or throws (no network) */
  async function memberKey(code) {
    var id = norm(code); if (id.length < 15) return null;
    var r = await req('GET', '/vipCodes/' + id);
    if (r.status === 200 && r.json && r.json.fields && r.json.fields.key) return r.json.fields.key.stringValue;
    if (r.status === 403 || r.status === 404) return null;
    throw new Error('net');
  }
  async function unlock(code) {
    if (!norm(code)) return false;
    try {
      var k = await memberKey(code);
      if (k) {
        if (!(await keyWorks(k))) return 'stale'; // a real code, made with an old key: Max's admin page fixes it
        storeKey(k); put(CODE_STORE, norm(code)); put(CHECK_STORE, String(Date.now())); return true;
      }
    } catch (e) { /* offline: master codes below */ }
    var res = await fetch('/vip/keys.json', { cache: 'no-store' }); if (!res.ok) throw new Error('keys');
    var kj = await res.json();
    for (var i = 0; i < kj.slots.length; i++) {
      var s = kj.slots[i];
      try {
        var wk = await wrapKey(code, b64(s.salt), kj.iter);
        var raw = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(s.iv) }, wk, b64(s.ct)));
        storeKey(tob64(raw)); del(CODE_STORE); return true;
      } catch (e) { /* not this slot */ }
    }
    return false;
  }
  function lock() { [KEY_STORE, CODE_STORE, CHECK_STORE].forEach(del); }
  /* does this key open the V.I.P tools that are live now? (an old key from an earlier build does not) */
  var PROBE = '/vip/game-plan/payload.json', okKeys = {};
  async function keyWorks(k) {
    if (!k) return false; if (okKeys[k] !== undefined) return okKeys[k];
    var res = await fetch(PROBE, { cache: 'no-store' }); if (!res.ok) throw new Error('payload');
    var p = await res.json();
    try { var key = await crypto.subtle.importKey('raw', b64(k), { name: 'AES-GCM' }, false, ['decrypt']); await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(p.iv) }, key, b64(p.ct)); okKeys[k] = true; }
    catch (e) { okKeys[k] = false; }
    return okKeys[k];
  }
  /* twice a day: is this device's member code still active? revoked -> lock; no network -> keep */
  async function recheck() {
    var code = get(CODE_STORE); if (!code) return true;
    if (Date.now() - Number(get(CHECK_STORE) || 0) < RECHECK_MS) return true;
    try { var k = await memberKey(code); if (k) { storeKey(k); put(CHECK_STORE, String(Date.now())); return true; } lock(); return false; }
    catch (e) { return true; }
  }
  async function contentKey() { var k = get(KEY_STORE); return k ? crypto.subtle.importKey('raw', b64(k), { name: 'AES-GCM' }, false, ['decrypt']) : null; }
  async function open(url, again) {
    var key = await contentKey(); if (!key) return null;
    var res = await fetch(url, { cache: 'no-store' }); if (!res.ok) throw new Error('payload');
    var p = await res.json(), plainBuf;
    try { plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(p.iv) }, key, b64(p.ct)); }
    catch (e) {
      // the key on this device is old: a member code fetches its (fixed) key again before giving up
      var code = get(CODE_STORE);
      if (code && !again) { try { var k2 = await memberKey(code); if (k2 && k2 !== get(KEY_STORE) && await keyWorks(k2)) { storeKey(k2); put(CHECK_STORE, String(Date.now())); return open(url, true); } } catch (x) {} }
      lock(); return null;
    }
    return await new Response(new Blob([plainBuf]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
  }

  /* ---------- sign-up link (public side) ---------- */
  async function checkLink(t) {
    if (!/^[A-Z0-9]{16,40}$/.test(String(t || ''))) return { ok: false, reason: 'expired' };
    var r = await req('GET', '/vipLinks/' + t);
    if (r.status !== 200) { if (r.status === 403 || r.status === 404) return { ok: false, reason: 'expired' }; throw new Error('net'); }
    var L = plain(r.json);
    if (L.used >= L.max) return { ok: false, reason: 'full' };
    return { ok: true, left: Math.max(0, Math.round((L.expires - Date.now()) / 1000)), link: L };
  }
  async function claim(t, email) {
    email = String(email || '').trim().toLowerCase();
    if (!/^[^\s@\/]{1,64}@[^\s@\/]{1,190}\.[^\s@\/]{2,24}$/.test(email)) return { ok: false, error: 'email' };
    var c = await checkLink(t); if (!c.ok) return { ok: false, error: c.reason };
    var id = 'MMM' + rand(12);
    var body = { writes: [
      { transform: { document: docName('vipLinks', t), fieldTransforms: [{ fieldPath: 'used', increment: { integerValue: '1' } }] }, currentDocument: { exists: true } },
      { update: { name: docName('vipCodes', id), fields: fields({ email: email, link: t, key: c.link.key, status: 'active', note: c.link.note || '' }) },
        updateTransforms: [{ fieldPath: 'created', setToServerValue: 'REQUEST_TIME' }], currentDocument: { exists: false } },
      { update: { name: docName('vipEmails', email), fields: fields({ code: id }) }, currentDocument: { exists: false } }
    ] };
    var r = await req('POST', ':commit', body);
    if (r.status === 200) { storeKey(c.link.key); put(CODE_STORE, id); put(CHECK_STORE, String(Date.now())); return { ok: true, code: pretty(id) }; }
    var again = await checkLink(t).catch(function () { return { ok: false, reason: 'expired' }; });
    if (!again.ok) return { ok: false, error: again.reason };
    return { ok: false, error: 'taken' }; // this email already has a code
  }

  /* ---------- admin side (Max, logged in on /admin/) ---------- */
  async function adminNewLink(idToken, minutes, people, note, by) {
    var key = get(KEY_STORE); if (!key) return { ok: false, error: 'nokey' };
    if (!(await keyWorks(key))) { lock(); return { ok: false, error: 'oldkey' }; }
    var t = rand(22), expires = new Date(Date.now() + minutes * 60000);
    var body = { writes: [{ update: { name: docName('vipLinks', t), fields: fields({ key: key, expires: expires, max: people, used: 0, note: String(note || '').slice(0, 80), by: by || '' }) },
      updateTransforms: [{ fieldPath: 'created', setToServerValue: 'REQUEST_TIME' }], currentDocument: { exists: false } }] };
    var r = await req('POST', ':commit', body, idToken);
    if (r.status !== 200) return { ok: false, error: r.status === 403 ? 'notadmin' : 'error' };
    return { ok: true, link: location.origin + '/vip/claim/?t=' + t, expires: expires.getTime(), people: people };
  }
  async function adminQuery(idToken, col, limit) {
    var r = await req('POST', ':runQuery', { structuredQuery: { from: [{ collectionId: col }], orderBy: [{ field: { fieldPath: 'created' }, direction: 'DESCENDING' }], limit: limit } }, idToken);
    if (r.status !== 200) throw new Error(r.status === 403 ? 'notadmin' : 'error');
    return (r.json || []).filter(function (x) { return x.document; }).map(function (x) { return plain(x.document); });
  }
  async function adminList(idToken) {
    var links = await adminQuery(idToken, 'vipLinks', 12), codes = await adminQuery(idToken, 'vipCodes', 60);
    links = links.filter(function (l) { return l.id !== HOLD; });
    links.forEach(function (l) { delete l.key; l.live = l.expires > Date.now() && l.used < l.max; });
    codes.forEach(function (c) { delete c.key; c.code = pretty(c.id); });
    return { ok: true, links: links, codes: codes };
  }
  /* codes and links made with an old key: give them the key that opens the tools now (members keep their codes) */
  async function adminRepair(idToken) {
    var key = get(KEY_STORE); if (!key || !(await keyWorks(key))) return { ok: false, error: 'oldkey' };
    var fixed = 0, cols = ['vipCodes', 'vipLinks'];
    for (var c = 0; c < cols.length; c++) {
      var docs = await adminQuery(idToken, cols[c], 1000);
      for (var i = 0; i < docs.length; i++) {
        if (docs[i].key && docs[i].key !== key) {
          var r = await req('PATCH', '/' + cols[c] + '/' + docs[i].id + '?updateMask.fieldPaths=key&currentDocument.exists=true', { fields: fields({ key: key }) }, idToken);
          if (r.status === 200 && cols[c] === 'vipCodes') fixed++;
        }
      }
    }
    return { ok: true, fixed: fixed };
  }
  async function adminSetStatus(idToken, code, status) {
    var r = await req('PATCH', '/vipCodes/' + norm(code) + '?updateMask.fieldPaths=status&currentDocument.exists=true', { fields: fields({ status: status === 'active' ? 'active' : 'revoked' }) }, idToken);
    return { ok: r.status === 200 };
  }

  /* ---------- admin auto-unlock: Max logged in with the admin email opens V.I.P with no code ----------
   * The content key already sits in the sign-up links and member codes he made (only the admin account can read them,
   * see tools/vip-firestore.rules). This takes the newest key that opens the live tools. After a master-code unlock the
   * key is also saved in one hidden admin-only record (vipLinks/ADMINKEYHOLDER…: expired, 0 places, so nobody can use it
   * as a sign-up link). */
  var ADMIN = 'infotrade@maxmaserati.com', HOLD = 'ADMINKEYHOLDER0000000000';
  function isAdmin(u) { return !!(u && String(u.email || '').toLowerCase() === ADMIN && u.emailVerified); }
  function vipEvent(n) { try { document.dispatchEvent(new CustomEvent(n)); } catch (e) {} }
  async function adminAuto(tok) {
    var cols = ['vipLinks', 'vipCodes'];
    for (var c = 0; c < cols.length; c++) {
      var docs = await adminQuery(tok, cols[c], 40);
      for (var i = 0; i < docs.length; i++) {
        if (docs[i].key && await keyWorks(docs[i].key)) { storeKey(docs[i].key); del(CODE_STORE); put(CHECK_STORE, String(Date.now())); return true; }
      }
    }
    return false;
  }
  async function adminHold(tok) {
    var key = get(KEY_STORE); if (!key || get('mmmVipHold') === key || !(await keyWorks(key))) return;
    var body = { writes: [{ update: { name: docName('vipLinks', HOLD), fields: fields({ key: key, expires: new Date(0), max: 0, used: 0, note: 'Admin auto-unlock (not a sign-up link)', by: 'admin' }) },
      updateTransforms: [{ fieldPath: 'created', setToServerValue: 'REQUEST_TIME' }] }] };
    var r = await req('POST', ':commit', body, tok);
    if (r.status === 200) { try { sessionStorage.setItem('mmmVipHold', key); } catch (e) {} }
  }
  document.addEventListener('mmm:auth', function (e) {
    var u = e.detail;
    if (!isAdmin(u)) { vipEvent('mmm:vipnone'); return; }
    u.getIdToken().then(function (tok) {
      if (get(KEY_STORE)) return adminHold(tok).then(function () { vipEvent('mmm:vip'); });
      return adminAuto(tok).then(function (ok) { vipEvent(ok ? 'mmm:vip' : 'mmm:vipnone'); });
    }).catch(function () { vipEvent('mmm:vipnone'); });
  });
  /* tool pages: wait a moment for the admin auto-unlock before sending a visitor back to the code box */
  function ready(ms) {
    if (get(KEY_STORE)) return Promise.resolve(true);
    return new Promise(function (res) {
      var done = false; function fin() { if (!done) { done = true; res(!!get(KEY_STORE)); } }
      document.addEventListener('mmm:vip', fin); document.addEventListener('mmm:vipnone', fin);
      setTimeout(fin, ms || 6000);
    });
  }

  window.MMMVip = { supported: supported, unlock: unlock, open: open, lock: lock, recheck: recheck, checkLink: checkLink, claim: claim,
    hasKey: function () { return !!get(KEY_STORE); }, pretty: pretty, ready: ready,
    admin: { newLink: adminNewLink, list: adminList, setStatus: adminSetStatus, repair: adminRepair } };
})();
