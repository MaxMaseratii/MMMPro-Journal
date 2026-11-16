/* Admin · Mail tab (MiniMax OS): every inbox in one place.
   Talks to the MiniMax OS engine (window.MMM_ENGINE_URL in /assets/mmm-config.js) with your admin Firebase login.
   The engine checks the login on every call, so nothing here is visible to anyone else. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var BASE = String(window.MMM_ENGINE_URL || '').replace(/\/+$/, '');
  var started = false, ACC = [], ROWS = [], SEL = {}, OPEN = null, busy = false;

  var CSS = '#mail{display:grid;gap:16px}#mail [hidden]{display:none!important}' +
    '#mail .accs{display:flex;gap:8px;flex-wrap:wrap}' +
    '#mail .acc{display:flex;gap:8px;align-items:center;border:1px solid var(--rule2);background:var(--sheet);border-radius:999px;padding:6px 12px;font-size:13px;cursor:pointer;color:var(--ink)}' +
    '#mail .acc[aria-pressed=true]{border-color:var(--gold);color:var(--gold)}' +
    '#mail .dot{width:8px;height:8px;border-radius:50%;background:var(--faint);flex:none}#mail .dot.ok{background:var(--win)}#mail .dot.bad{background:var(--loss)}#mail .dot.amb{background:var(--amber)}' +
    '#mail .acc b{font-family:var(--mono);font-weight:600}' +
    '#mail .bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center}' +
    '#mail .bar input[type=search]{flex:1;min-width:220px;background:var(--sheet);color:var(--ink);border:1px solid var(--rule2);border-radius:6px;padding:8px 10px;font:13.5px var(--sans)}' +
    '#mail .bar label{color:var(--mute);font-size:13px;display:flex;gap:6px;align-items:center}' +
    '#mail .split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:16px;align-items:start}' +
    '@media (max-width:1000px){#mail .split{grid-template-columns:1fr}}' +
    '#mail .list{border:1px solid var(--rule2);border-radius:6px;background:var(--sheet);overflow:hidden}' +
    '#mail .row{display:grid;grid-template-columns:22px 74px minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 12px;border-top:1px solid var(--rule);cursor:pointer}' +
    '#mail .row:first-child{border-top:0}#mail .row:hover{background:var(--sheet2)}#mail .row.on{background:rgba(245,197,24,.07)}' +
    '#mail .row .who{font-weight:600;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#mail .row.unread .who:before{content:"● ";color:var(--gold)}' +
    '#mail .row .sub{color:var(--mute);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '#mail .row .tag{font:600 10.5px var(--mono);letter-spacing:.04em;text-transform:uppercase;color:var(--teal);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '#mail .row time{color:var(--faint);font-size:12px;white-space:nowrap}' +
    '#mail .read{border:1px solid var(--rule2);border-radius:6px;background:var(--sheet);padding:16px;min-height:200px}' +
    '#mail .read h3{margin:0 0 6px;font-size:17px}#mail .read .meta{color:var(--mute);font-size:12.5px;line-height:1.6;word-break:break-word}' +
    '#mail .read pre{white-space:pre-wrap;word-break:break-word;font:14px/1.6 var(--sans);margin:14px 0 0;max-height:60vh;overflow:auto}' +
    '#mail .acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}' +
    '#mail .empty{color:var(--faint);padding:24px;text-align:center;font-size:13.5px}' +
    '#mail .warn{border:1px solid hsla(45,100%,55%,.45);border-radius:6px;background:var(--sheet);padding:12px 14px;font-size:13.5px;color:var(--mute)}' +
    '#mail .warn b{color:var(--ink)}#mail .warn ul{margin:6px 0 0;padding-left:18px}' +
    '#mail details.conn{border:1px solid var(--rule2);border-radius:6px;background:var(--sheet)}' +
    '#mail details.conn summary{cursor:pointer;padding:12px 14px;font-weight:700;color:var(--gold)}#mail details.conn summary small{color:var(--mute);font-weight:500;margin-left:6px}' +
    '#mail details.conn .in{padding:0 14px 14px;font-size:13.5px;color:var(--mute)}' +
    '#mail .url{display:flex;gap:8px;margin:8px 0}#mail .url input{flex:1;min-width:0;background:var(--paper);color:var(--ink);border:1px solid var(--rule2);border-radius:6px;padding:8px;font:12.5px var(--mono)}' +
    '#mail .err{color:var(--loss);font-size:13.5px}' +
    '#mail .views{display:flex;gap:6px;margin-top:12px}#mail .views button[aria-pressed=true]{border-color:var(--gold);color:var(--gold)}' +
    '#mail iframe.orig{width:100%;height:68vh;border:1px solid var(--rule2);border-radius:6px;background:#fff;margin-top:12px;display:block}';

  function user() { return window.MMM && window.MMM.user && window.MMM.user(); }
  function api(path, body) {
    var u = user();
    if (!u) return Promise.reject(new Error('Log in first.'));
    return u.getIdToken().then(function (tok) {
      return fetch(BASE + '/api' + path, {
        method: body ? 'POST' : 'GET',
        headers: Object.assign({ Authorization: 'Bearer ' + tok }, body ? { 'Content-Type': 'application/json' } : {}),
        body: body ? JSON.stringify(body) : undefined
      });
    }).then(function (r) { return r.json().catch(function () { return { ok: false, error: 'The engine answered ' + r.status }; }); })
      .then(function (j) { if (!j.ok) throw new Error(j.code === 'notadmin' ? 'This login is not an admin email.' : (j.error || 'Something went wrong.')); return j; });
  }
  function toast(t) { var el = document.createElement('div'); el.className = 'toast'; el.textContent = t; document.body.appendChild(el); setTimeout(function () { el.remove(); }, 2600); }
  function when(d) {
    if (!d) return '';
    var t = new Date(d), now = new Date();
    return t.toDateString() === now.toDateString() ? t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : t.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }
  function short(from) { var m = /^"?([^"<]+?)"?\s*</.exec(from || ''); return (m ? m[1] : from || '').trim(); }
  function key(r) { return r.account + '|' + r.folder + '|' + r.uid; }

  function shell() {
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    $('mail').innerHTML =
      '<div class="accs" id="mxAccs"><span class="dim">Loading your inboxes…</span></div>' +
      '<div id="mxWarn"></div>' +
      '<div class="bar"><input type="search" id="mxQ" placeholder="Search like Gmail: is:unread · from:whop · newer_than:3d · has:attachment">' +
      '<label><input type="checkbox" id="mxUnread"> Unread only</label>' +
      '<button class="btn" type="button" id="mxGo">Search</button><button class="btn" type="button" id="mxRef">Refresh</button></div>' +
      '<div class="bar" id="mxBulk" hidden><span class="dim" id="mxCount"></span>' +
      '<button class="btn" type="button" data-bulk="read">Mark read</button><button class="btn" type="button" data-bulk="archive">Archive</button>' +
      '<button class="btn" type="button" data-bulk="trash">Trash</button><button class="btn" type="button" data-bulk="spam">Spam</button></div>' +
      '<div class="split"><div class="list" id="mxList"><div class="empty">Loading…</div></div><div class="read" id="mxRead"><div class="empty">Pick an email to read it here.</div></div></div>' +
      '<details class="conn" id="mxConn"><summary>Claude connector <small>lets Claude read and clean all inboxes for you</small></summary><div class="in" id="mxConnIn"></div></details>';
    $('mxGo').onclick = function () { search(); };
    $('mxRef').onclick = function () { overview(); search(); };
    $('mxQ').addEventListener('keydown', function (e) { if (e.key === 'Enter') search(); });
    $('mxUnread').onchange = function () { search(); };
    $('mxAccs').addEventListener('click', function (e) {
      var b = e.target.closest('[data-acc]'); if (!b) return;
      var on = b.getAttribute('aria-pressed') === 'true';
      [].forEach.call($('mxAccs').querySelectorAll('[data-acc]'), function (x) { x.setAttribute('aria-pressed', 'false'); });
      if (!on) b.setAttribute('aria-pressed', 'true');
      search();
    });
    $('mxList').addEventListener('click', function (e) {
      var cb = e.target.closest('input[type=checkbox]');
      var row = e.target.closest('[data-k]'); if (!row) return;
      if (cb) { if (cb.checked) SEL[row.dataset.k] = true; else delete SEL[row.dataset.k]; bulkBar(); return; }
      open(row.dataset.k);
    });
    $('mxBulk').addEventListener('click', function (e) {
      var b = e.target.closest('[data-bulk]'); if (!b) return;
      var groups = {};
      Object.keys(SEL).forEach(function (k) { var p = k.split('|'); var g = p[0] + '|' + p[1]; (groups[g] = groups[g] || []).push(Number(p[2])); });
      act(b.dataset.bulk, groups);
    });
  }

  function chosenAccount() { var b = $('mxAccs').querySelector('[aria-pressed=true]'); return b ? b.dataset.acc : 'all'; }

  function overview() {
    return api('/overview').then(function (j) {
      ACC = j.accounts || [];
      var cur = chosenAccount();
      $('mxAccs').innerHTML = ACC.map(function (a) {
        var cls = a.status === 'ok' ? 'ok' : /^error/.test(a.status) ? 'bad' : 'amb';
        var extra = a.status === 'ok' ? ' <b>' + (a.inbox_unread || 0) + '</b>' : '';
        return '<button type="button" class="acc" data-acc="' + esc(a.id) + '" aria-pressed="' + (cur === a.id) + '" title="' + esc(a.status) + '"><span class="dot ' + cls + '"></span>' + esc(a.address) + extra + '</button>';
      }).join('');
      var warn = [];
      ACC.forEach(function (a) { if (/^error/.test(a.status)) warn.push('<li><b>' + esc(a.address) + '</b>: ' + esc(a.status) + '</li>'); });
      (j.missing || []).forEach(function (m) { warn.push('<li>Missing on the engine: ' + esc(m) + '</li>'); });
      $('mxWarn').innerHTML = warn.length ? '<div class="warn"><b>Still to fix</b><ul>' + warn.join('') + '</ul></div>' : '';
      var hot = j.hotmail || {};
      $('mxConnIn').innerHTML =
        (j.connector_url
          ? '<div class="url"><input readonly id="mxUrl" value="' + esc(j.connector_url) + '"><button class="btn" type="button" id="mxCopy">Copy</button></div>' +
            '<p>Paste it in Claude → Settings → Connectors → Add custom connector. Keep it secret: anyone with this link can use your email.</p>'
          : '<p>Add HUB_TOKEN on the engine to switch the Claude connector on.</p>') +
        (hot.configured ? '<p><button class="btn gold" type="button" id="mxHot">' + (hot.connected ? 'Reconnect Hotmail' : 'Connect Hotmail') + '</button></p>' : '');
      if ($('mxCopy')) $('mxCopy').onclick = function () { $('mxUrl').select(); try { navigator.clipboard.writeText($('mxUrl').value); } catch (e) {} toast('Copied'); };
      if ($('mxHot')) $('mxHot').onclick = function () { api('/ms/connect').then(function (r) { location.href = r.url; }).catch(function (e) { toast(e.message); }); };
    }).catch(function (e) { $('mxAccs').innerHTML = '<span class="err">' + esc(e.message) + '</span>'; });
  }

  function search() {
    if (busy) return; busy = true;
    $('mxList').innerHTML = '<div class="empty">Loading…</div>';
    SEL = {}; bulkBar();
    var q = '?account=' + encodeURIComponent(chosenAccount()) + '&folder=inbox&limit=30' + ($('mxUnread').checked ? '&unread=1' : '') + ($('mxQ').value.trim() ? '&q=' + encodeURIComponent($('mxQ').value.trim()) : '');
    api('/search' + q).then(function (j) {
      ROWS = []; var errs = [];
      (j.results || []).forEach(function (r) {
        if (r.error) errs.push(r.account + ': ' + r.error);
        (r.messages || []).forEach(function (m) { ROWS.push(m); });
      });
      ROWS.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
      draw(errs);
    }).catch(function (e) { $('mxList').innerHTML = '<div class="empty err">' + esc(e.message) + '</div>'; })
      .finally(function () { busy = false; });
  }

  function draw(errs) {
    var html = ROWS.map(function (m) {
      var k = key(m);
      return '<div class="row' + (m.unread ? ' unread' : '') + (OPEN === k ? ' on' : '') + '" data-k="' + esc(k) + '">' +
        '<input type="checkbox" aria-label="Select"' + (SEL[k] ? ' checked' : '') + '>' +
        '<span class="tag" title="' + esc(m.to) + '">' + esc(m.account) + '</span>' +
        '<div style="min-width:0"><div class="who">' + esc(short(m.from)) + '</div><div class="sub">' + esc(m.subject || '(no subject)') + (m.has_attachments ? ' 📎' : '') + '</div></div>' +
        '<time>' + esc(when(m.date)) + '</time></div>';
    }).join('');
    $('mxList').innerHTML = (errs && errs.length ? '<div class="empty err">' + errs.map(esc).join('<br>') + '</div>' : '') + (html || '<div class="empty">Nothing here. Inbox zero.</div>');
  }

  function bulkBar() {
    var n = Object.keys(SEL).length;
    $('mxBulk').hidden = !n;
    $('mxCount').textContent = n + ' selected';
  }

  function open(k) {
    OPEN = k; var p = k.split('|');
    [].forEach.call($('mxList').querySelectorAll('.row'), function (r) { r.classList.toggle('on', r.dataset.k === k); });
    var row = ROWS.filter(function (r) { return key(r) === k; })[0];
    $('mxRead').innerHTML = row ? '<h3>' + esc(row.subject || '(no subject)') + '</h3><div class="meta">From ' + esc(row.from) + '</div><div class="empty">Opening…</div>' : '<div class="empty">Opening…</div>';
    api('/read?account=' + encodeURIComponent(p[0]) + '&folder=' + encodeURIComponent(p[1]) + '&uid=' + p[2]).then(function (j) {
      var m = j.message;
      $('mxRead').innerHTML = '<h3>' + esc(m.subject || '(no subject)') + '</h3>' +
        '<div class="meta">From ' + esc(m.from) + '<br>To ' + esc(m.to) + (m.cc ? '<br>Cc ' + esc(m.cc) : '') + '<br>' + esc(new Date(m.date).toLocaleString('en-GB')) + ' · ' + esc(m.account) + '</div>' +
        '<div class="acts"><button class="btn" type="button" data-one="read">Mark read</button><button class="btn" type="button" data-one="unread">Mark unread</button>' +
        '<button class="btn" type="button" data-one="archive">Archive</button><button class="btn" type="button" data-one="trash">Trash</button>' +
        (m.list_unsubscribe ? '<button class="btn" type="button" data-one="unsub">Unsubscribe</button>' : '') + '</div>' +
        (m.attachments && m.attachments.length ? '<div class="meta" style="margin-top:10px">📎 ' + m.attachments.map(function (a) { return esc(a.name) + (a.size_kb != null ? ' (' + a.size_kb + ' KB)' : ''); }).join(' · ') + '</div>' : '') +
        (m.html ? '<div class="views"><button class="btn" type="button" data-view="orig" aria-pressed="true">Original</button><button class="btn" type="button" data-view="text" aria-pressed="false">Plain text</button></div>' : '') +
        '<div id="mxBody"></div>';
      var show = function (v) {
        var box = $('mxBody');
        if (v === 'orig' && m.html) {
          var f = document.createElement('iframe');
          f.className = 'orig';
          f.setAttribute('sandbox', 'allow-popups allow-popups-to-escape-sandbox'); // no scripts, no forms, no access to this page
          f.setAttribute('referrerpolicy', 'no-referrer');
          f.srcdoc = '<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="script-src \'none\'; form-action \'none\'"><base target="_blank">' + m.html;
          box.innerHTML = ''; box.appendChild(f);
        } else {
          box.innerHTML = '<pre>' + esc(m.body) + '</pre>';
        }
        [].forEach.call($('mxRead').querySelectorAll('[data-view]'), function (b) { b.setAttribute('aria-pressed', b.dataset.view === v); });
      };
      show(m.html ? 'orig' : 'text');
      if (m.html) $('mxRead').querySelector('.views').onclick = function (e) { var b = e.target.closest('[data-view]'); if (b) show(b.dataset.view); };
      $('mxRead').querySelector('.acts').onclick = function (e) {
        var b = e.target.closest('[data-one]'); if (!b) return;
        if (b.dataset.one === 'unsub') return unsub(p);
        var g = {}; g[p[0] + '|' + p[1]] = [Number(p[2])];
        act(b.dataset.one, g);
      };
    }).catch(function (e) { $('mxRead').innerHTML = '<div class="empty err">' + esc(e.message) + '</div>'; });
  }

  function act(action, groups) {
    var jobs = Object.keys(groups).map(function (g) { var p = g.split('|'); return api('/act', { action: action, account: p[0], folder: p[1], uids: groups[g] }); });
    Promise.all(jobs).then(function () {
      toast({ trash: 'Moved to Trash', archive: 'Archived', spam: 'Moved to Spam', read: 'Marked read', unread: 'Marked unread' }[action] || 'Done');
      if (action === 'trash' || action === 'archive' || action === 'spam') { $('mxRead').innerHTML = '<div class="empty">Pick an email to read it here.</div>'; OPEN = null; }
      overview(); search();
    }).catch(function (e) { toast(e.message); });
  }

  function unsub(p) {
    api('/unsubscribe', { account: p[0], folder: p[1], uid: Number(p[2]) }).then(function (j) {
      var r = j.result || {};
      if (r.done) toast('Unsubscribed');
      else if (r.link) { toast('This one needs their website'); window.open(r.link, '_blank', 'noopener'); }
      else toast(r.note || 'No unsubscribe option');
    }).catch(function (e) { toast(e.message); });
  }

  window.MMMMail = function () {
    if (!BASE) { $('mail').innerHTML = '<div class="warn"><b>The MiniMax OS engine is not connected yet.</b> Put its address in <code>/assets/mmm-config.js</code> (MMM_ENGINE_URL).</div>'; return; }
    if (started) return;
    started = true; shell(); overview(); search();
  };
})();
