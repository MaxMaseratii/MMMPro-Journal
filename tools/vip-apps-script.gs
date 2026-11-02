/**
 * MMM V.I.P - private sign-up links + code issuing (Google Apps Script, bound to a Google Sheet).
 *
 * What it does
 *   - Max makes a sign-up link from his admin page (maxmaserati.com/admin/): he picks how long it lives
 *     (5 or 15 minutes, up to 60) and how many people can use it. Only the admin email can make links:
 *     the script checks his MMM log-in with Google before it does anything.
 *   - A person opens the link and types their email -> their own V.I.P code is EMAILED to them.
 *   - Every link is saved in the "Links" tab, every code in the "Codes" tab.
 *     Revoke a code from the admin page (or set Status to "revoked" in the Sheet) to switch someone off.
 *   - The V.I.P pages ask this script to check a code; a good code receives the key that opens the V.I.P tools.
 *
 * Script properties (Project Settings -> Script properties):
 *   VIP_CONTENT_KEY  required: copy it from maxmaserati.com/vip/?setup=1 after unlocking with the master code
 *   ADMIN_EMAILS     optional: more admin emails, comma-separated (infotrade@maxmaserati.com is always admin)
 * Setup: see the "V.I.P setup" guide.
 */

var CFG = {
  SITE: 'https://www.maxmaserati.com',
  FIREBASE_API_KEY: 'AIzaSyDcrEEhcY6kHLQxZ7RQ37KmAcCDPgol0gg', // public web key (same as the website)
  ADMIN_EMAILS: ['infotrade@maxmaserati.com'],
  MINUTES: [5, 15, 30, 60],      // link lifetimes Max can choose
  MAX_PEOPLE: 50                 // most people one link can sign up
};
var LINK_HEAD = ['Created', 'Token', 'Expires', 'Max people', 'Used', 'Note', 'Made by'];
var CODE_HEAD = ['Created', 'Email', 'Code', 'Status', 'Link', 'Last used', 'Uses', 'Note'];
var ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O, 1/I

function P_() { return PropertiesService.getScriptProperties(); }

/* ---------- run once from the editor ---------- */
function setup() {
  sheet_('Links', LINK_HEAD); sheet_('Codes', CODE_HEAD);
  Logger.log('Sheet ready: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
  Logger.log('Emails left today: ' + MailApp.getRemainingDailyQuota());
  UrlFetchApp.fetch('https://www.google.com', { muteHttpExceptions: true });
  if (!P_().getProperty('VIP_CONTENT_KEY')) Logger.log('Still missing: add VIP_CONTENT_KEY in Project Settings -> Script properties.');
}

/* ---------- helpers ---------- */
function randomCode_(n) {
  var out = '';
  while (out.length < n) {
    var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, Utilities.getUuid() + Utilities.getUuid() + Date.now());
    for (var i = 0; i < bytes.length && out.length < n; i++) out += ALPHA.charAt((bytes[i] + 256) % 32);
  }
  return out;
}
function newVipCode_() { var r = randomCode_(12); return 'MMM-' + r.slice(0, 4) + '-' + r.slice(4, 8) + '-' + r.slice(8, 12); }
function norm_(c) { return String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
function sheet_(name, head) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sh.getLastRow() === 0) { sh.appendRow(head); sh.setFrozenRows(1); sh.getRange(1, 1, 1, head.length).setFontWeight('bold'); }
  return sh;
}
function rows_(name, head) { var sh = sheet_(name, head), n = sh.getLastRow(); return n < 2 ? [] : sh.getRange(2, 1, n - 1, head.length).getValues(); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function ms_(v) { return v instanceof Date ? v.getTime() : Number(v) || 0; }
function throttle_(key, max, sec) {
  var c = CacheService.getScriptCache(), n = Number(c.get(key) || 0);
  if (n >= max) return false;
  c.put(key, String(n + 1), sec); return true;
}

/* ---------- admin log-in check (same Firebase log-in as the website) ---------- */
function adminUser_(idToken) {
  if (!idToken) return null;
  var res = UrlFetchApp.fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + CFG.FIREBASE_API_KEY, {
    method: 'post', contentType: 'application/json', payload: JSON.stringify({ idToken: String(idToken) }), muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) return null;
  var u = (JSON.parse(res.getContentText()).users || [])[0];
  if (!u || u.disabled) return null;
  var email = String(u.email || '').toLowerCase();
  var google = (u.providerUserInfo || []).some(function (p) { return p.providerId === 'google.com'; });
  var extra = String(P_().getProperty('ADMIN_EMAILS') || '').toLowerCase().split(/[\s,;]+/);
  var admins = CFG.ADMIN_EMAILS.map(function (e) { return e.toLowerCase(); }).concat(extra).filter(function (e) { return e; });
  if (admins.indexOf(email) < 0 || (!u.emailVerified && !google)) return null;
  return { email: email };
}

/* find a link row by token: returns { i, row, left (seconds), usesLeft } or null */
function link_(t) {
  t = String(t || '');
  if (t.length < 16) return null;
  var data = rows_('Links', LINK_HEAD);
  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i][1] !== t) continue;
    var left = Math.floor((ms_(data[i][2]) - Date.now()) / 1000), usesLeft = Number(data[i][3]) - Number(data[i][4] || 0);
    return { i: i, row: data[i], left: left, usesLeft: usesLeft };
  }
  return null;
}

/* ---------- API (POST, text/plain JSON) ---------- */
function doGet() { return json_({ ok: true, service: 'MMM V.I.P' }); }

function doPost(e) {
  var b = {};
  try { b = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) { return json_({ ok: false, error: 'bad request' }); }
  if (!throttle_('all', 300, 60)) return json_({ ok: false, error: 'busy' });
  try {
    switch (b.action) {
      case 'check': { var L = link_(b.t); var good = !!(L && L.left > 0 && L.usesLeft > 0);
        return json_({ ok: good, reason: good ? '' : (L && L.left > 0 ? 'full' : 'expired'), left: L ? Math.max(0, L.left) : 0 }); }
      case 'claim': return claim_(b);
      case 'verify': return verify_(b);
      case 'newLink': case 'list': case 'setStatus': {
        var me = adminUser_(b.idToken);
        if (!me) return json_({ ok: false, error: 'notadmin' });
        if (b.action === 'newLink') return newLink_(b, me);
        if (b.action === 'setStatus') return setStatus_(b);
        return list_();
      }
    }
    return json_({ ok: false, error: 'unknown action' });
  } catch (err) { console.error(err); return json_({ ok: false, error: 'error' }); }
}

/* Max: make a fresh link */
function newLink_(b, me) {
  var minutes = CFG.MINUTES.indexOf(Number(b.minutes)) >= 0 ? Number(b.minutes) : 15;
  var people = Math.max(1, Math.min(CFG.MAX_PEOPLE, Math.round(Number(b.people) || 1)));
  var note = String(b.note || '').replace(/[\u0000-\u001f]/g, ' ').slice(0, 80);
  var token = randomCode_(22), expires = new Date(Date.now() + minutes * 60000);
  var lock = LockService.getScriptLock(); lock.waitLock(15000);
  try { sheet_('Links', LINK_HEAD).appendRow([new Date(), token, expires, people, 0, note, me.email]); }
  finally { lock.releaseLock(); }
  return json_({ ok: true, link: CFG.SITE + '/vip/claim/?t=' + token, expires: expires.getTime(), people: people, minutes: minutes });
}

/* Max: last links + last codes */
function list_() {
  var now = Date.now();
  var links = rows_('Links', LINK_HEAD).slice(-12).reverse().map(function (r) {
    return { created: ms_(r[0]), expires: ms_(r[2]), people: Number(r[3]), used: Number(r[4] || 0), note: r[5], live: ms_(r[2]) > now && Number(r[4] || 0) < Number(r[3]) };
  });
  var codes = rows_('Codes', CODE_HEAD).slice(-40).reverse().map(function (r) {
    return { created: ms_(r[0]), email: r[1], code: r[2], status: String(r[3]).toLowerCase(), lastUsed: ms_(r[5]), uses: Number(r[6] || 0), note: r[7] };
  });
  return json_({ ok: true, links: links, codes: codes, sheet: SpreadsheetApp.getActiveSpreadsheet().getUrl(), quota: MailApp.getRemainingDailyQuota() });
}

/* Max: revoke or restore one code */
function setStatus_(b) {
  var c = norm_(b.code), to = b.status === 'active' ? 'active' : 'revoked';
  var sh = sheet_('Codes', CODE_HEAD), data = rows_('Codes', CODE_HEAD);
  for (var i = 0; i < data.length; i++) if (norm_(data[i][2]) === c) { sh.getRange(i + 2, 4).setValue(to); return json_({ ok: true, status: to }); }
  return json_({ ok: false, error: 'notfound' });
}

/* person on the link: email -> their own code by email */
function claim_(b) {
  var email = String(b.email || '').trim().toLowerCase();
  if (!/^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/.test(email)) return json_({ ok: false, error: 'email' });
  if (!throttle_('c' + email, 5, 3600)) return json_({ ok: false, error: 'busy' });
  var lock = LockService.getScriptLock(); lock.waitLock(15000);
  try {
    var L = link_(b.t);
    if (!L || L.left <= 0) return json_({ ok: false, error: 'expired' });
    var csh = sheet_('Codes', CODE_HEAD), data = rows_('Codes', CODE_HEAD), code = null, status = null;
    for (var i = 0; i < data.length; i++) if (String(data[i][1]).toLowerCase() === email) { code = data[i][2]; status = String(data[i][3]).toLowerCase(); }
    if (status === 'revoked') return json_({ ok: false, error: 'revoked' });
    if (!code) {
      if (L.usesLeft <= 0) return json_({ ok: false, error: 'full' });
      code = newVipCode_();
      csh.appendRow([new Date(), email, code, 'active', b.t.slice(0, 6), '', 0, L.row[5] || '']);
      sheet_('Links', LINK_HEAD).getRange(L.i + 2, 5).setValue(Number(L.row[4] || 0) + 1);
    }
    if (MailApp.getRemainingDailyQuota() < 1) return json_({ ok: false, error: 'quota' });
    mail_(email, code);
    return json_({ ok: true });
  } finally { lock.releaseLock(); }
}

/* V.I.P pages: is this code good? */
function verify_(b) {
  var c = norm_(b.code);
  if (c.length < 10) return json_({ ok: false });
  if (!throttle_('v' + c.slice(0, 6), 30, 600)) return json_({ ok: false, error: 'busy' });
  var sh = sheet_('Codes', CODE_HEAD), data = rows_('Codes', CODE_HEAD);
  for (var i = 0; i < data.length; i++) {
    if (norm_(data[i][2]) !== c) continue;
    if (String(data[i][3]).toLowerCase() !== 'active') return json_({ ok: false, revoked: true });
    sh.getRange(i + 2, 6, 1, 2).setValues([[new Date(), Number(data[i][6] || 0) + 1]]);
    return json_({ ok: true, key: P_().getProperty('VIP_CONTENT_KEY') });
  }
  return json_({ ok: false, unknown: true });
}

function mail_(email, code) {
  var html = '<div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:auto;padding:24px;background:#0a0a0a;color:#eee;border-radius:14px">' +
    '<h2 style="color:#f5c518;margin:0 0 6px">Welcome to MMM V.I.P</h2><p>Here is your personal access code:</p>' +
    '<p style="font:700 24px monospace;letter-spacing:3px;background:#000;border:1px solid #f5c518;border-radius:10px;padding:14px;text-align:center;color:#f5c518">' + code + '</p>' +
    '<p>1. Open <a style="color:#4fd1c5" href="' + CFG.SITE + '/vip/">' + CFG.SITE.replace('https://', '') + '/vip/</a><br>2. Type your code<br>3. Open the MMM Game Plan Builder</p>' +
    '<p style="color:#999;font-size:13px">This code is for you only. Do not share it: shared codes get switched off.</p>' +
    '<p style="color:#999;font-size:13px">Max Maserati · MMM Trading</p></div>';
  MailApp.sendEmail({ to: email, subject: 'Your MMM V.I.P access code', htmlBody: html, name: 'MMM Trading', body: 'Your MMM V.I.P code: ' + code + '\nOpen ' + CFG.SITE + '/vip/ and type your code. Do not share it.' });
}
