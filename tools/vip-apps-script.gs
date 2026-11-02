/**
 * MMM V.I.P - private sign-up link + code issuing (Google Apps Script, bound to a Google Sheet).
 *
 * What it does
 *   - Makes a PRIVATE sign-up link that changes every 15 minutes. Only Max can see it (admin page, needs ADMIN_KEY).
 *   - A person opens the link, types their email -> gets their own V.I.P code BY EMAIL (proves the email is real).
 *   - Every code is saved in the "Codes" tab. Set Status to "revoked" to switch someone off.
 *   - The V.I.P pages ask this script to check a code; a good code receives the key that opens the V.I.P tools.
 *
 * Secrets live in Project Settings -> Script properties (never in the website):
 *   VIP_CONTENT_KEY  the key printed by tools/vip-build.mjs (required)
 *   LINK_SECRET      made by setup()
 *   ADMIN_KEY        made by setup()  - your admin page password
 *   MAX_PER_LINK     how many emails one 15-minute link may sign up (default 3)
 * Setup steps: see the "V.I.P setup" guide.
 */

var SITE = 'https://www.maxmaserati.com';
var WINDOW_SEC = 900;          // 15 minutes
var GRACE_SEC = 120;           // a link still works 2 minutes after it changes
var SHEET = 'Codes';
var HEAD = ['Created', 'Email', 'Code', 'Status', 'Link window', 'Last used', 'Uses', 'Note'];
var ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O, 1/I

function P_() { return PropertiesService.getScriptProperties(); }

/* ---------- run once from the editor ---------- */
function setup() {
  var p = P_();
  if (!p.getProperty('LINK_SECRET')) p.setProperty('LINK_SECRET', randomCode_(40));
  if (!p.getProperty('ADMIN_KEY')) p.setProperty('ADMIN_KEY', randomCode_(24));
  if (!p.getProperty('MAX_PER_LINK')) p.setProperty('MAX_PER_LINK', '3');
  sheet_();
  var url = ScriptApp.getService().getUrl();
  Logger.log('ADMIN_KEY: ' + p.getProperty('ADMIN_KEY'));
  Logger.log('Admin page (after you deploy): ' + (url ? url : '<your web app URL>') + '?admin=' + p.getProperty('ADMIN_KEY'));
  if (!p.getProperty('VIP_CONTENT_KEY')) Logger.log('Still missing: add VIP_CONTENT_KEY in Project Settings -> Script properties.');
}

/* Change the admin key (old admin bookmark stops working). */
function newAdminKey() { P_().setProperty('ADMIN_KEY', randomCode_(24)); setup(); }

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
function windowNow_() { return Math.floor(Date.now() / 1000 / WINDOW_SEC); }
function token_(w) {
  var sig = Utilities.computeHmacSha256Signature(String(w), P_().getProperty('LINK_SECRET'));
  return sig.slice(0, 15).map(function (b) { return ALPHA.charAt((b + 256) % 32); }).join('');
}
function linkFor_(w) { return SITE + '/vip/claim/?t=' + token_(w); }
/* returns the link window the token belongs to, or -1 */
function checkToken_(t) {
  t = String(t || '');
  if (t.length < 10) return -1;
  var w = windowNow_();
  if (t === token_(w)) return w;
  var into = Date.now() / 1000 - w * WINDOW_SEC;
  if (into < GRACE_SEC && t === token_(w - 1)) return w - 1;
  return -1;
}
function secondsLeft_() { return Math.ceil((windowNow_() + 1) * WINDOW_SEC - Date.now() / 1000); }
function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (sh.getLastRow() === 0) { sh.appendRow(HEAD); sh.setFrozenRows(1); sh.getRange(1, 1, 1, HEAD.length).setFontWeight('bold'); }
  return sh;
}
function rows_() { var sh = sheet_(); var n = sh.getLastRow(); return n < 2 ? [] : sh.getRange(2, 1, n - 1, HEAD.length).getValues(); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function esc_(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function throttle_(key, max, sec) {
  var c = CacheService.getScriptCache(), n = Number(c.get(key) || 0);
  if (n >= max) return false;
  c.put(key, String(n + 1), sec); return true;
}

/* ---------- admin page (only with ADMIN_KEY) ---------- */
function doGet(e) {
  var p = (e && e.parameter) || {};
  if (!p.admin || p.admin !== P_().getProperty('ADMIN_KEY')) return HtmlService.createHtmlOutput('<p style="font-family:sans-serif">Not found.</p>');
  var w = windowNow_(), link = linkFor_(w), left = secondsLeft_();
  var list = rows_().slice(-15).reverse().map(function (r) {
    return '<tr><td>' + esc_(Utilities.formatDate(new Date(r[0]), 'Europe/London', 'dd MMM HH:mm')) + '</td><td>' + esc_(r[1]) + '</td><td style="font-family:monospace">' + esc_(r[2]) + '</td><td>' + esc_(r[3]) + '</td><td>' + esc_(r[6]) + '</td></tr>';
  }).join('');
  var html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MMM V.I.P admin</title>' +
    '<style>body{font-family:Inter,system-ui,sans-serif;background:#0a0a0a;color:#eee;margin:0;padding:24px}main{max-width:760px;margin:0 auto}' +
    'h1{font-size:22px;margin:0 0 4px;color:#f5c518}.box{background:#151515;border:1px solid #333;border-radius:12px;padding:18px;margin:16px 0}' +
    'input{width:100%;box-sizing:border-box;background:#000;color:#fff;border:1px solid #444;border-radius:8px;padding:12px;font:14px monospace}' +
    'button{margin-top:10px;background:#f5c518;color:#000;border:0;border-radius:8px;padding:11px 16px;font-weight:800;cursor:pointer}' +
    'table{width:100%;border-collapse:collapse;font-size:13px}td,th{text-align:left;padding:7px;border-bottom:1px solid #2a2a2a}small{color:#999}</style></head><body><main>' +
    '<h1>MMM V.I.P · private sign-up link</h1><small>Only you can see this page. Send the link to one buyer at a time.</small>' +
    '<div class="box"><input id="l" readonly value="' + esc_(link) + '"><button onclick="var i=document.getElementById(\'l\');i.select();document.execCommand(\'copy\');this.textContent=\'Copied\'">Copy link</button>' +
    '<p>This link stops working in <b id="t">' + Math.floor(left / 60) + ':' + ('0' + left % 60).slice(-2) + '</b> (+2 min grace). Max ' + esc_(P_().getProperty('MAX_PER_LINK') || '3') + ' sign-ups per link. The page refreshes by itself.</p></div>' +
    '<div class="box"><b>Last 15 codes</b> <small>· switch someone off: open the Sheet, set Status to <b>revoked</b></small><table><tr><th>When (London)</th><th>Email</th><th>Code</th><th>Status</th><th>Uses</th></tr>' + list + '</table></div>' +
    '<script>var s=' + left + ';setInterval(function(){s--;if(s<=0){location.reload();return}document.getElementById("t").textContent=Math.floor(s/60)+":"+("0"+s%60).slice(-2)},1000)</script>' +
    '</main></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle('MMM V.I.P admin').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/* ---------- API for the website (POST, text/plain JSON) ---------- */
function doPost(e) {
  var b = {};
  try { b = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) { return json_({ ok: false, error: 'bad request' }); }
  if (!throttle_('all', 300, 60)) return json_({ ok: false, error: 'busy, try again in a minute' });
  if (b.action === 'check') return json_({ ok: checkToken_(b.t) >= 0, left: secondsLeft_() });
  if (b.action === 'claim') return claim_(b);
  if (b.action === 'verify') return verify_(b);
  return json_({ ok: false, error: 'unknown action' });
}

function claim_(b) {
  var w = checkToken_(b.t);
  if (w < 0) return json_({ ok: false, error: 'expired' });
  var email = String(b.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) return json_({ ok: false, error: 'email' });
  var lock = LockService.getScriptLock(); lock.waitLock(15000);
  try {
    var sh = sheet_(), data = rows_(), code = null, status = null, rowIx = -1;
    for (var i = 0; i < data.length; i++) if (String(data[i][1]).toLowerCase() === email) { code = data[i][2]; status = String(data[i][3]).toLowerCase(); rowIx = i; }
    if (status === 'revoked') return json_({ ok: false, error: 'revoked' });
    if (!code) {
      var max = Number(P_().getProperty('MAX_PER_LINK') || 3);
      var used = data.filter(function (r) { return Number(r[4]) === w; }).length;
      if (used >= max) return json_({ ok: false, error: 'full' });
      code = newVipCode_();
      sh.appendRow([new Date(), email, code, 'active', w, '', 0, '']);
    }
    mail_(email, code);
    return json_({ ok: true, resent: rowIx >= 0 });
  } finally { lock.releaseLock(); }
}

function verify_(b) {
  var c = norm_(b.code);
  if (c.length < 10) return json_({ ok: false });
  if (!throttle_('v' + c.slice(0, 6), 30, 600)) return json_({ ok: false, error: 'busy' });
  var sh = sheet_(), data = rows_();
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
    '<p>1. Open <a style="color:#4fd1c5" href="' + SITE + '/vip/">' + SITE.replace('https://', '') + '/vip/</a><br>2. Type your code<br>3. Open the MMM Game Plan Builder</p>' +
    '<p style="color:#999;font-size:13px">This code is for you only. Do not share it: shared codes get switched off.</p>' +
    '<p style="color:#999;font-size:13px">Max Maserati · MMM Trading</p></div>';
  MailApp.sendEmail({ to: email, subject: 'Your MMM V.I.P access code', htmlBody: html, name: 'MMM Trading', body: 'Your MMM V.I.P code: ' + code + '\nOpen ' + SITE + '/vip/ and type your code. Do not share it.' });
}
