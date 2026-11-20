/* Admin · Mail tab — MiniMax OS "Mail Core".
   A Jarvis-style command screen for every inbox. Talks to the MiniMax OS engine
   (window.MMM_ENGINE_URL in /assets/mmm-config.js) with your admin Firebase login;
   the engine checks that login on every call.
   Speed: the engine keeps every inbox in memory and opens the newest emails ahead of time;
   this page also shows the last list it saw the moment you open the tab, then updates. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var BASE = String(window.MMM_ENGINE_URL || '').replace(/\/+$/, '');
  var LS_KEY = 'mmm.mail.snapshot.v1';
  var COLORS = { dr: '#3ee8ff', infotrade: '#f5c518', bmb: '#b28cff', misterbme: '#36f1a1' };
  var NAMES = { dr: 'DR', infotrade: 'INFOTRADE', bmb: 'BMB', misterbme: 'MISTERBME' };
  var FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'today', label: 'Today', q: 'in:inbox newer_than:1d' },
    { id: 'money', label: 'Money', q: 'in:inbox (payment OR payout OR invoice OR receipt OR refund OR declined OR transaction OR wages)' },
    { id: 'people', label: 'People', q: 'in:inbox category:primary -from:(noreply OR no-reply OR notifications OR donotreply)' },
    { id: 'promos', label: 'Promos', q: 'in:inbox category:promotions' }
  ];

  var started = false, ACC = [], ROWS = [], SEL = {}, OPEN = null, CUR = -1, FILTER = 'all', POD = 'all', QUERY = '';
  var READS = {}, INFLIGHT = {}, LAST_MS = null, SYNCED = null, LIVE = false;

  var STYLE = [
    '#mail{--jc:#3ee8ff;--jc2:#9ff6ff;--jt:#d8f4fb;--jd:#6f8c98;--jf:#4a6370;--jl:rgba(62,232,255,.16);--jl2:rgba(62,232,255,.32);--jp:rgba(8,20,27,.78);--jok:#36f1a1;--jwarn:#ffb23e;--jbad:#ff5d6c;',
    'position:relative;display:grid;gap:14px;padding:18px;border-radius:10px;color:var(--jt);',
    'background:radial-gradient(1200px 400px at 15% -10%,rgba(62,232,255,.10),transparent 60%),radial-gradient(900px 500px at 110% 120%,rgba(178,140,255,.07),transparent 60%),',
    'linear-gradient(rgba(62,232,255,.035) 1px,transparent 1px) 0 0/28px 28px,linear-gradient(90deg,rgba(62,232,255,.035) 1px,transparent 1px) 0 0/28px 28px,#04080c;border:1px solid var(--jl)}',
    '#mail [hidden]{display:none!important}',
    '#mail kbd{font:600 10px var(--mono);color:var(--jc);border:1px solid var(--jl2);border-radius:3px;padding:0 4px}',
    '#mail .lbl{font:600 10.5px/1 var(--mono);letter-spacing:.18em;text-transform:uppercase;color:var(--jd)}',
    '#mail .pnl{position:relative;background:var(--jp);border:1px solid var(--jl);border-radius:6px}',
    '#mail .pnl:before,#mail .pnl:after{content:"";position:absolute;width:14px;height:14px;border:2px solid var(--jc);opacity:.75;pointer-events:none}',
    '#mail .pnl:before{top:-1px;left:-1px;border-right:0;border-bottom:0;border-radius:6px 0 0 0}',
    '#mail .pnl:after{bottom:-1px;right:-1px;border-left:0;border-top:0;border-radius:0 0 6px 0}',
    '#mail .tag{position:absolute;top:-6px;left:18px;padding:0 6px;background:#04080c;z-index:1}',
    /* HUD */
    '#mail .hud{display:grid;grid-template-columns:170px minmax(0,1fr);gap:18px;align-items:center;padding:16px 18px}',
    '#mail .core{position:relative;width:160px;height:160px}',
    '#mail .core svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}',
    '#mail .spin{transform-origin:80px 80px;animation:mxspin 24s linear infinite}#mail .spin2{transform-origin:80px 80px;animation:mxspin 60s linear infinite reverse}',
    '@keyframes mxspin{to{transform:rotate(360deg)}}',
    '#mail .core .ctr{position:absolute;inset:0;display:grid;place-content:center;text-align:center}',
    '#mail .core .big{font:700 28px/1 var(--mono);color:var(--jc2);text-shadow:0 0 18px rgba(62,232,255,.55)}',
    '#mail .core .sm{font:600 9.5px/1 var(--mono);letter-spacing:.22em;color:var(--jd);margin-top:6px}',
    '#mail h2.ttl{margin:0;font:700 19px/1.1 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:#eafcff}',
    '#mail h2.ttl b{color:var(--jc)}',
    '#mail .stat{display:flex;flex-wrap:wrap;gap:6px 18px;margin:8px 0 14px;font:600 11px var(--mono);letter-spacing:.08em;color:var(--jd)}',
    '#mail .stat i{font-style:normal;color:var(--jt)}#mail .stat .on{color:var(--jok)}#mail .stat .warn{color:var(--jwarn)}#mail .stat .bad{color:var(--jbad)}',
    '#mail .blink{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--jok);box-shadow:0 0 8px var(--jok);margin-right:6px;animation:mxpulse 2s ease-in-out infinite}',
    '@keyframes mxpulse{50%{opacity:.35}}',
    '#mail .pods{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px}',
    '#mail .pod{--pc:var(--jc);text-align:left;cursor:pointer;color:var(--jt);background:rgba(4,12,17,.7);border:1px solid var(--jl);border-radius:6px;padding:10px 12px;position:relative;overflow:hidden;transition:border-color .15s,box-shadow .15s,transform .15s}',
    '#mail .pod:hover{border-color:var(--jl2);transform:translateY(-1px)}',
    '#mail .pod[aria-pressed=true]{border-color:var(--pc);box-shadow:0 0 0 1px var(--pc) inset,0 0 22px -6px var(--pc)}',
    '#mail .pod .nm{font:700 11px var(--mono);letter-spacing:.16em;color:var(--pc)}',
    '#mail .pod .ad{font-size:11.5px;color:var(--jd);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}',
    '#mail .pod .n{font:700 24px/1.1 var(--mono);margin-top:6px;color:#f1fdff}#mail .pod .n small{font-size:10px;color:var(--jd);letter-spacing:.14em;margin-left:6px}',
    '#mail .pod .bar{position:absolute;left:0;bottom:0;height:2px;background:var(--pc);box-shadow:0 0 10px var(--pc);transition:width .4s}',
    '#mail .pod .st{position:absolute;top:10px;right:10px;width:7px;height:7px;border-radius:50%;background:var(--jok);box-shadow:0 0 8px var(--jok)}',
    '#mail .pod .st.bad{background:var(--jbad);box-shadow:0 0 8px var(--jbad)}#mail .pod .st.amb{background:var(--jwarn);box-shadow:0 0 8px var(--jwarn)}',
    /* command bar */
    '#mail .cmd{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:12px}',
    '#mail .prompt{flex:1;min-width:240px;display:flex;align-items:center;gap:8px;border:1px solid var(--jl2);border-radius:6px;padding:0 10px;background:rgba(2,8,12,.85)}',
    '#mail .prompt:focus-within{border-color:var(--jc);box-shadow:0 0 0 3px rgba(62,232,255,.12)}',
    '#mail .prompt span{font:700 15px var(--mono);color:var(--jc)}',
    '#mail .prompt input{flex:1;min-width:0;background:transparent;border:0;outline:0;color:#eafcff;font:13.5px var(--mono);padding:10px 0}',
    '#mail .prompt input::placeholder{color:var(--jf)}',
    '#mail .chips{display:flex;gap:6px;flex-wrap:wrap}',
    '#mail .chip,#mail .hb{font:600 11px var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--jd);background:transparent;border:1px solid var(--jl);border-radius:4px;padding:7px 10px;cursor:pointer;transition:all .15s}',
    '#mail .chip:hover,#mail .hb:hover{color:var(--jt);border-color:var(--jl2)}',
    '#mail .chip[aria-pressed=true]{color:#02131a;background:var(--jc);border-color:var(--jc);box-shadow:0 0 16px -4px var(--jc)}',
    '#mail .hb kbd{margin-right:6px}',
    '#mail .hb.dg:hover{color:var(--jbad);border-color:var(--jbad)}',
    '#mail .hb:disabled{opacity:.5;cursor:wait}',
    '#mail .bulk{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:10px 12px}',
    /* stream + decoder */
    '#mail .grid{display:grid;grid-template-columns:minmax(0,.95fr) minmax(0,1.25fr);gap:14px;align-items:start}',
    '@media (max-width:1050px){#mail .grid{grid-template-columns:1fr}#mail .hud{grid-template-columns:1fr;justify-items:center;text-align:center}#mail .stat{justify-content:center}#mail .pods{width:100%}}',
    '@media (max-width:560px){#mail{padding:12px}#mail .pods{grid-template-columns:1fr 1fr}#mail .keys{display:none}}',
    '#mail .stream{max-height:calc(100vh - 150px);min-height:300px;overflow:auto;padding:8px 0;scrollbar-color:var(--jl2) transparent}',
    '#mail .row{--pc:var(--jc);display:grid;grid-template-columns:20px minmax(0,1fr) auto;gap:3px 10px;padding:10px 14px 10px 16px;border-top:1px solid rgba(62,232,255,.07);cursor:pointer;position:relative;transition:background .12s,opacity .2s,transform .2s}',
    '#mail .row:first-child{border-top:0}',
    '#mail .row:before{content:"";position:absolute;left:0;top:8px;bottom:8px;width:2px;border-radius:2px;background:var(--pc);opacity:.5}',
    '#mail .row:hover{background:rgba(62,232,255,.045)}',
    '#mail .row.cur{background:rgba(62,232,255,.07)}#mail .row.cur:before{opacity:1;box-shadow:0 0 10px var(--pc)}',
    '#mail .row.on{background:rgba(62,232,255,.11)}',
    '#mail .row.out{opacity:0;transform:translateX(24px)}',
    '#mail .row input{grid-row:span 2;margin:3px 0 0;-webkit-appearance:none;appearance:none;width:14px;height:14px;border:1px solid var(--jl2);border-radius:3px;background:rgba(2,8,12,.8);cursor:pointer}',
    '#mail .row input:checked{background:var(--jc);border-color:var(--jc);box-shadow:0 0 10px -2px var(--jc),inset 0 0 0 2px #04080c}',
    '#mail .row .who{font-weight:600;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#b9d4dc}',
    '#mail .row.un .who{color:#f3fdff}#mail .row.un .who:after{content:"";display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--jc);box-shadow:0 0 8px var(--jc);margin-left:7px;vertical-align:middle}',
    '#mail .row time{font:600 11px var(--mono);color:var(--jd);white-space:nowrap}',
    '#mail .row .sub{grid-column:2/4;font-size:13px;color:#93aeb7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#mail .row.un .sub{color:#d6eef4}',
    '#mail .row .sn{grid-column:2/4;font-size:12px;color:var(--jf);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '#mail .row .ac{font:700 9.5px var(--mono);letter-spacing:.14em;color:var(--pc);margin-right:8px}',
    '#mail .empty{padding:34px 18px;text-align:center;color:var(--jd);font:12.5px var(--mono);letter-spacing:.06em}',
    '#mail .err{color:var(--jbad)}',
    '#mail .dec{padding:18px;min-height:360px}',
    '#mail .dec h3{margin:4px 0 10px;font:700 19px/1.3 var(--sans);color:#f3fdff}',
    '#mail .meta{display:grid;grid-template-columns:auto minmax(0,1fr);gap:3px 12px;font:12px/1.5 var(--mono);color:#a9c6cf;word-break:break-word}',
    '#mail .meta b{color:var(--jd);font-weight:600;letter-spacing:.12em;font-size:10.5px;padding-top:2px}',
    '#mail .acts{display:flex;gap:6px;flex-wrap:wrap;margin:14px 0 0}',
    '#mail .views{display:flex;gap:6px;margin-top:14px}',
    '#mail .att{margin-top:10px;font:12px var(--mono);color:var(--jd)}',
    '#mail iframe.orig{width:100%;height:calc(100vh - 330px);min-height:420px;border:1px solid var(--jl);border-radius:6px;background:#fff;margin-top:12px;display:block}',
    '#mail pre.txt{white-space:pre-wrap;word-break:break-word;font:14px/1.65 var(--sans);color:#d6eef4;margin:14px 0 0;max-height:calc(100vh - 330px);overflow:auto}',
    '#mail .scan{position:absolute;left:0;right:0;top:0;height:2px;background:linear-gradient(90deg,transparent,var(--jc),transparent);opacity:0;pointer-events:none}',
    '#mail .scan.go{animation:mxscan .8s ease-out}',
    '@keyframes mxscan{0%{opacity:.9;top:0}100%{opacity:0;top:100%}}',
    '#mail .sk{height:12px;border-radius:3px;background:linear-gradient(90deg,rgba(62,232,255,.05),rgba(62,232,255,.14),rgba(62,232,255,.05));background-size:200% 100%;animation:mxsk 1.2s linear infinite;margin:8px 0}',
    '@keyframes mxsk{to{background-position:-200% 0}}',
    '#mail .warnbox{padding:14px;font-size:13px;color:#cfe3e9}#mail .warnbox ul{margin:6px 0 0;padding-left:18px}#mail .warnbox b{color:var(--jwarn)}',
    '#mail details.conn summary{cursor:pointer;padding:14px;list-style:none}#mail details.conn summary::-webkit-details-marker{display:none}',
    '#mail details.conn .in{padding:0 14px 14px;font-size:13px;color:var(--jd)}',
    '#mail .url{display:flex;gap:8px;margin:8px 0}#mail .url input{flex:1;min-width:0;background:#02080c;color:var(--jt);border:1px solid var(--jl2);border-radius:5px;padding:8px;font:12px var(--mono)}',
    '#mail .keys{font:11px var(--mono);color:var(--jf);letter-spacing:.06em;text-align:center}#mail .keys kbd{color:var(--jd);border-color:var(--jl);margin:0 3px}',
    '.mx-toast{position:fixed;bottom:22px;left:50%;transform:translateX(-50%);z-index:9999;font:600 12px ui-monospace,Menlo,monospace;letter-spacing:.08em;color:#02131a;background:#3ee8ff;padding:9px 14px;border-radius:5px;box-shadow:0 0 24px -4px #3ee8ff}',
    '@media (prefers-reduced-motion:reduce){#mail *{animation:none!important;transition:none!important}}'
  ].join('\n');

  /* ---------- data ---------- */
  function user() { return window.MMM && window.MMM.user && window.MMM.user(); }
  function api(path, body) {
    var u = user();
    if (!u) return Promise.reject(new Error('Log in first.'));
    var t0 = performance.now();
    return u.getIdToken().then(function (tok) {
      return fetch(BASE + '/api' + path, {
        method: body ? 'POST' : 'GET',
        headers: Object.assign({ Authorization: 'Bearer ' + tok }, body ? { 'Content-Type': 'application/json' } : {}),
        body: body ? JSON.stringify(body) : undefined
      });
    }).then(function (r) { return r.json().catch(function () { return { ok: false, error: 'The engine answered ' + r.status }; }); })
      .then(function (j) {
        LAST_MS = Math.round(performance.now() - t0);
        if (!j.ok) throw new Error(j.code === 'notadmin' ? 'This login is not an admin email.' : (j.error || 'Something went wrong.'));
        return j;
      });
  }
  function save(snap) { try { localStorage.setItem(LS_KEY, JSON.stringify(snap)); } catch (e) {} }
  function load() { try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch (e) { return null; } }

  function toast(t) {
    var el = document.createElement('div'); el.className = 'mx-toast'; el.textContent = t;
    document.body.appendChild(el); setTimeout(function () { el.remove(); }, 2200);
  }
  function when(d) {
    if (!d) return '';
    var t = new Date(d), now = new Date();
    return t.toDateString() === now.toDateString() ? t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : t.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }
  function short(from) { var m = /^"?([^"<]+?)"?\s*</.exec(from || ''); return (m ? m[1] : from || '').trim(); }
  function key(r) { return r.account + '|' + r.folder + '|' + r.uid; }
  function color(id) { return COLORS[id] || '#3ee8ff'; }
  function cssEsc(s) { return window.CSS && window.CSS.escape ? window.CSS.escape(s) : String(s).replace(/["\\]/g, '\\$&'); }

  /* ---------- layout ---------- */
  function shell() {
    var st = document.createElement('style'); st.textContent = STYLE; document.head.appendChild(st);
    $('mail').innerHTML =
      '<section class="pnl hud"><span class="tag lbl">// mail core</span>' +
        '<div class="core" id="mxCore"></div>' +
        '<div style="min-width:0;width:100%"><h2 class="ttl">MiniMax OS <b>· Mail</b></h2>' +
        '<div class="stat" id="mxStat"><span>BOOTING…</span></div><div class="pods" id="mxPods"></div></div>' +
      '</section>' +
      '<div id="mxWarn"></div>' +
      '<section class="pnl cmd"><span class="tag lbl">// command</span>' +
        '<label class="prompt"><span>›</span><input id="mxQ" type="search" autocomplete="off" spellcheck="false" placeholder="search like Gmail · from:whop · is:unread · has:attachment"></label>' +
        '<div class="chips" id="mxChips">' + FILTERS.map(function (f) { return '<button type="button" class="chip" data-f="' + f.id + '" aria-pressed="' + (f.id === 'all') + '">' + f.label + '</button>'; }).join('') + '</div>' +
        '<button type="button" class="hb" id="mxSync"><kbd>R</kbd>Sync</button>' +
      '</section>' +
      '<section class="pnl bulk" id="mxBulk" hidden><span class="lbl" id="mxCount"></span>' +
        '<button type="button" class="hb" data-bulk="read">Mark read</button><button type="button" class="hb" data-bulk="archive"><kbd>E</kbd>Archive</button>' +
        '<button type="button" class="hb dg" data-bulk="trash"><kbd>#</kbd>Trash</button><button type="button" class="hb dg" data-bulk="spam">Spam</button>' +
        '<button type="button" class="hb" id="mxClear">Clear</button></section>' +
      '<div class="grid">' +
        '<section class="pnl"><span class="tag lbl" id="mxStreamTag">// inbox stream</span><div class="stream" id="mxList"></div></section>' +
        '<section class="pnl dec" id="mxRead"></section>' +
      '</div>' +
      '<details class="pnl conn" id="mxConn"><summary><span class="lbl">// claude link</span> <span style="margin-left:8px;color:var(--jc);font-weight:700">Claude connector</span> <span style="color:var(--jd);font-size:12.5px">— lets Claude read and clean every inbox</span></summary><div class="in" id="mxConnIn"></div></details>' +
      '<div class="keys"><kbd>/</kbd>search <kbd>J</kbd><kbd>K</kbd>move <kbd>Enter</kbd>open <kbd>X</kbd>select <kbd>E</kbd>archive <kbd>#</kbd>trash <kbd>U</kbd>unread <kbd>R</kbd>sync <kbd>Esc</kbd>close</div>';
    closeReader(true);

    $('mxQ').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { QUERY = $('mxQ').value.trim(); setFilter(QUERY ? null : 'all'); refresh(); }
      if (e.key === 'Escape') $('mxQ').blur();
    });
    $('mxChips').addEventListener('click', function (e) {
      var b = e.target.closest('[data-f]'); if (!b) return;
      $('mxQ').value = ''; QUERY = ''; setFilter(b.dataset.f); ROWS = []; refresh();
    });
    $('mxSync').onclick = function () { sync(); };
    $('mxPods').addEventListener('click', function (e) {
      var b = e.target.closest('[data-acc]'); if (!b) return;
      POD = POD === b.dataset.acc ? 'all' : b.dataset.acc;
      drawPods(); refresh();
    });
    $('mxList').addEventListener('click', function (e) {
      var row = e.target.closest('[data-k]'); if (!row) return;
      if (e.target.closest('input[type=checkbox]')) { toggleSel(row.dataset.k, e.target.checked); return; }
      CUR = ROWS.findIndex(function (r) { return key(r) === row.dataset.k; });
      open(row.dataset.k);
    });
    $('mxList').addEventListener('mouseover', function (e) {
      var row = e.target.closest('[data-k]'); if (row) prefetch(row.dataset.k);
    });
    $('mxBulk').addEventListener('click', function (e) {
      if (e.target.closest('#mxClear')) { SEL = {}; drawList(); return; }
      var b = e.target.closest('[data-bulk]'); if (!b) return;
      act(b.dataset.bulk, Object.keys(SEL));
    });
    document.addEventListener('keydown', keys);
    document.addEventListener('visibilitychange', function () { if (!document.hidden && visible()) refresh(true); });
  }

  function setFilter(id) {
    FILTER = id;
    [].forEach.call($('mxChips').querySelectorAll('[data-f]'), function (b) { b.setAttribute('aria-pressed', String(b.dataset.f === id)); });
  }
  function visible() { var m = $('mail'); return !!(m && !m.hidden && m.offsetParent !== null); }

  /* ---------- HUD ---------- */
  function drawCore() {
    var ok = ACC.filter(function (a) { return a.status === 'ok'; });
    var total = ok.reduce(function (s, a) { return s + (a.inbox_unread || 0); }, 0);
    var C = 2 * Math.PI * 62, off = 0, segs = '';
    ok.forEach(function (a) {
      var share = total ? (a.inbox_unread || 0) / total : 1 / Math.max(ok.length, 1);
      var len = Math.max(share * C - 4, 2);
      segs += '<circle cx="80" cy="80" r="62" fill="none" stroke="' + color(a.id) + '" stroke-width="7" stroke-dasharray="' + len.toFixed(1) + ' ' + (C - len).toFixed(1) + '" stroke-dashoffset="' + (-off).toFixed(1) + '" transform="rotate(-90 80 80)" style="filter:drop-shadow(0 0 5px ' + color(a.id) + ')"/>';
      off += share * C;
    });
    var ticks = '';
    for (var i = 0; i < 60; i++) {
      var a = i * 6 * Math.PI / 180, r1 = 74, r2 = i % 5 ? 77 : 80;
      ticks += '<line x1="' + (80 + r1 * Math.cos(a)).toFixed(1) + '" y1="' + (80 + r1 * Math.sin(a)).toFixed(1) + '" x2="' + (80 + r2 * Math.cos(a)).toFixed(1) + '" y2="' + (80 + r2 * Math.sin(a)).toFixed(1) + '" stroke="rgba(62,232,255,' + (i % 5 ? '.25' : '.6') + ')" stroke-width="1"/>';
    }
    $('mxCore').innerHTML =
      '<svg viewBox="0 0 160 160" aria-hidden="true">' +
        '<g class="spin2">' + ticks + '</g>' +
        '<circle cx="80" cy="80" r="62" fill="none" stroke="rgba(62,232,255,.08)" stroke-width="7"/>' + segs +
        '<g class="spin"><circle cx="80" cy="80" r="50" fill="none" stroke="rgba(62,232,255,.35)" stroke-width="1" stroke-dasharray="3 6"/></g>' +
        '<circle cx="80" cy="80" r="42" fill="rgba(62,232,255,.05)" stroke="rgba(62,232,255,.25)"/>' +
      '</svg><div class="ctr"><div class="big">' + (ok.length ? total.toLocaleString('en-GB') : '—') + '</div><div class="sm">UNREAD</div></div>';
  }

  function drawStat() {
    var ok = ACC.filter(function (a) { return a.status === 'ok'; }).length, n = ACC.length;
    var cls = !n ? 'warn' : ok === n ? 'on' : ok ? 'warn' : 'bad';
    $('mxStat').innerHTML =
      '<span><span class="blink"' + (cls === 'on' ? '' : ' style="background:var(--jwarn);box-shadow:0 0 8px var(--jwarn)"') + '></span>LINKS <i class="' + cls + '">' + ok + '/' + n + ' ONLINE</i></span>' +
      '<span>SYNC <i>' + (SYNCED ? new Date(SYNCED).toLocaleTimeString('en-GB') : '—') + '</i></span>' +
      '<span>RESPONSE <i>' + (LAST_MS != null ? LAST_MS + ' ms' : '—') + '</i></span>' +
      '<span>STREAM <i>' + ROWS.length + '</i></span>' +
      (LIVE ? '' : '<span class="warn">LAST VIEW · UPDATING…</span>');
  }

  function drawPods() {
    var max = Math.max.apply(null, ACC.map(function (a) { return a.inbox_unread || 0; }).concat([1]));
    $('mxPods').innerHTML = ACC.map(function (a) {
      var st = a.status === 'ok' ? '' : (/^error/.test(a.status) ? 'bad' : 'amb');
      var n = a.status === 'ok' ? (a.inbox_unread || 0).toLocaleString('en-GB') : '—';
      return '<button type="button" class="pod" style="--pc:' + color(a.id) + '" data-acc="' + esc(a.id) + '" aria-pressed="' + (POD === a.id) + '" title="' + esc(a.status === 'ok' ? a.address : a.status) + '">' +
        '<span class="st ' + st + '"></span><div class="nm">' + esc(NAMES[a.id] || String(a.id).toUpperCase()) + '</div><div class="ad">' + esc(a.address) + '</div>' +
        '<div class="n">' + n + '<small>UNREAD</small></div><span class="bar" style="width:' + (a.status === 'ok' ? Math.max(4, Math.round(100 * (a.inbox_unread || 0) / max)) : 0) + '%"></span></button>';
    }).join('');
  }

  function drawWarn(j) {
    var w = [];
    ACC.forEach(function (a) { if (/^error/.test(a.status)) w.push('<li>' + esc(a.address) + ': ' + esc(a.status) + '</li>'); });
    (j.missing || []).forEach(function (m) { w.push('<li>Missing on the engine: ' + esc(m) + '</li>'); });
    $('mxWarn').innerHTML = w.length ? '<section class="pnl warnbox"><span class="tag lbl">// alerts</span><b>Needs attention</b><ul>' + w.join('') + '</ul></section>' : '';
  }

  function drawConn(j) {
    $('mxConnIn').innerHTML = j.connector_url
      ? '<div class="url"><input readonly id="mxUrl" value="' + esc(j.connector_url) + '"><button type="button" class="hb" id="mxCopy">Copy</button></div><p>Paste it in Claude → Settings → Connectors → Add custom connector. Keep it secret: anyone with this link can use your email.</p>'
      : '<p>Add HUB_TOKEN on the engine to switch the Claude connector on.</p>';
    if ($('mxCopy')) $('mxCopy').onclick = function () { $('mxUrl').select(); try { navigator.clipboard.writeText($('mxUrl').value); } catch (e) {} toast('LINK COPIED'); };
  }

  /* ---------- stream ---------- */
  function drawList(msg) {
    var html = ROWS.map(function (m, i) {
      var k = key(m);
      return '<div class="row' + (m.unread ? ' un' : '') + (OPEN === k ? ' on' : '') + (i === CUR ? ' cur' : '') + '" style="--pc:' + color(m.account) + '" data-k="' + esc(k) + '">' +
        '<input type="checkbox" aria-label="Select"' + (SEL[k] ? ' checked' : '') + '>' +
        '<div class="who"><span class="ac">' + esc(NAMES[m.account] || m.account) + '</span>' + esc(short(m.from)) + '</div>' +
        '<time>' + esc(when(m.date)) + '</time>' +
        '<div class="sub">' + esc(m.subject || '(no subject)') + (m.has_attachments ? ' · 📎' : '') + '</div>' +
        (m.snippet ? '<div class="sn">' + esc(m.snippet) + '</div>' : '') + '</div>';
    }).join('');
    $('mxList').innerHTML = (msg || '') + (html || (msg ? '' : '<div class="empty">INBOX CLEAR · NOTHING HERE</div>'));
    var n = Object.keys(SEL).length;
    $('mxBulk').hidden = !n;
    $('mxCount').textContent = n + ' SELECTED';
    var f = FILTERS.filter(function (x) { return x.id === FILTER; })[0];
    $('mxStreamTag').textContent = '// ' + (QUERY ? 'search' : (f ? f.label.toLowerCase() : 'inbox')) + ' stream' + (POD !== 'all' ? ' · ' + (NAMES[POD] || POD).toLowerCase() : '');
    drawStat();
  }

  function skeleton() {
    var s = '';
    for (var i = 0; i < 8; i++) s += '<div style="padding:10px 16px"><div class="sk" style="width:' + (40 + (i * 13) % 40) + '%"></div><div class="sk" style="width:' + (60 + (i * 7) % 35) + '%"></div></div>';
    $('mxList').innerHTML = s;
  }

  function useSnapshot(j) {
    if (j.accounts) ACC = j.accounts;
    if (j.synced_at) SYNCED = j.synced_at;
    drawCore(); drawPods(); drawWarn(j); drawConn(j);
  }

  /* The Inbox comes from the engine's memory; filters and searches ask Gmail live. */
  function refresh(quiet) {
    var f = FILTERS.filter(function (x) { return x.id === FILTER; })[0];
    var q = QUERY || (f && f.q) || '';
    if (!quiet || !ROWS.length) skeleton();
    var req;
    if (!q) {
      req = api('/boot?account=' + encodeURIComponent(POD) + (FILTER === 'unread' ? '&unread=1' : '')).then(function (j) {
        LIVE = true; useSnapshot(j); ROWS = j.rows || [];
        if (POD === 'all' && FILTER === 'all') save({ accounts: j.accounts, rows: ROWS, synced_at: j.synced_at, connector_url: j.connector_url, missing: j.missing });
        return '';
      });
    } else {
      req = api('/search?account=' + encodeURIComponent(POD) + '&q=' + encodeURIComponent(q) + '&limit=25').then(function (j) {
        LIVE = true; var errs = [];
        ROWS = [];
        (j.results || []).forEach(function (r) { if (r.error) errs.push(r.account + ': ' + r.error); (r.messages || []).forEach(function (m) { ROWS.push(m); }); });
        ROWS.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
        return errs.length ? '<div class="empty err">' + errs.map(esc).join('<br>') + '</div>' : '';
      });
    }
    return req.then(function (msg) {
      var keep = {}; ROWS.forEach(function (r) { if (SEL[key(r)]) keep[key(r)] = true; }); SEL = keep;
      if (CUR >= ROWS.length) CUR = ROWS.length - 1;
      drawList(msg);
      ROWS.slice(0, 4).forEach(function (r) { prefetch(key(r)); });
    }).catch(function (e) { drawList('<div class="empty err">' + esc(e.message) + '</div>'); });
  }

  function sync() {
    $('mxSync').disabled = true; toast('SYNCING ALL LINKS');
    api('/sync', {}).then(function (j) { useSnapshot(j); return refresh(true); })
      .catch(function (e) { toast(e.message); }).finally(function () { $('mxSync').disabled = false; });
  }

  /* ---------- reading ---------- */
  function prefetch(k) {
    if (READS[k]) return Promise.resolve(READS[k]);
    if (INFLIGHT[k]) return INFLIGHT[k];
    var p = k.split('|');
    var job = api('/read?account=' + encodeURIComponent(p[0]) + '&folder=' + encodeURIComponent(p[1]) + '&uid=' + p[2])
      .then(function (j) { READS[k] = j.message; return j.message; });
    INFLIGHT[k] = job;
    job.then(function () { delete INFLIGHT[k]; }, function () { delete INFLIGHT[k]; });
    return job;
  }

  function head(m, row) {
    var acc = row ? row.account : '';
    return '<h3>' + esc(m.subject || '(no subject)') + '</h3><div class="meta">' +
      '<b>FROM</b><span>' + esc(m.from) + '</span>' + (m.to ? '<b>TO</b><span>' + esc(m.to) + '</span>' : '') + (m.cc ? '<b>CC</b><span>' + esc(m.cc) + '</span>' : '') +
      (m.date ? '<b>TIME</b><span>' + esc(new Date(m.date).toLocaleString('en-GB')) + '</span>' : '') +
      (acc ? '<b>LINK</b><span style="color:' + color(acc) + '">' + esc(NAMES[acc] || acc) + '</span>' : '') + '</div>';
  }

  function open(k) {
    OPEN = k;
    var row = ROWS.filter(function (r) { return key(r) === k; })[0];
    drawList();
    var box = $('mxRead');
    var top = '<span class="tag lbl">// decoder</span><div class="scan go"></div>';
    if (!READS[k]) box.innerHTML = top + (row ? head(row, row) : '') + '<div class="sk" style="width:90%;margin-top:22px"></div><div class="sk" style="width:75%"></div><div class="sk" style="width:82%"></div>';
    prefetch(k).then(function (m) {
      if (OPEN !== k) return;
      box.innerHTML = top + head(m, row) +
        '<div class="acts"><button type="button" class="hb" data-one="archive"><kbd>E</kbd>Archive</button><button type="button" class="hb dg" data-one="trash"><kbd>#</kbd>Trash</button>' +
        '<button type="button" class="hb" data-one="unread"><kbd>U</kbd>Unread</button><button type="button" class="hb dg" data-one="spam">Spam</button>' +
        (m.list_unsubscribe ? '<button type="button" class="hb dg" data-one="unsub">Unsubscribe</button>' : '') + '</div>' +
        (m.attachments && m.attachments.length ? '<div class="att">📎 ' + m.attachments.map(function (a) { return esc(a.name) + (a.size_kb != null ? ' (' + a.size_kb + ' KB)' : ''); }).join(' · ') + '</div>' : '') +
        (m.html ? '<div class="views"><button type="button" class="chip" data-view="orig" aria-pressed="true">Original</button><button type="button" class="chip" data-view="text" aria-pressed="false">Text</button></div>' : '') +
        '<div id="mxBody"></div>';
      var show = function (v) {
        var b = $('mxBody');
        if (v === 'orig' && m.html) {
          var f = document.createElement('iframe');
          f.className = 'orig';
          f.setAttribute('sandbox', 'allow-popups allow-popups-to-escape-sandbox'); // no scripts, no forms, no access to this page
          f.setAttribute('referrerpolicy', 'no-referrer');
          f.srcdoc = '<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="script-src \'none\'; form-action \'none\'"><base target="_blank">' + m.html;
          b.innerHTML = ''; b.appendChild(f);
        } else b.innerHTML = '<pre class="txt">' + esc(m.body) + '</pre>';
        [].forEach.call(box.querySelectorAll('[data-view]'), function (x) { x.setAttribute('aria-pressed', String(x.dataset.view === v)); });
      };
      show(m.html ? 'orig' : 'text');
      if (m.html) box.querySelector('.views').onclick = function (e) { var b = e.target.closest('[data-view]'); if (b) show(b.dataset.view); };
      box.querySelector('.acts').onclick = function (e) {
        var b = e.target.closest('[data-one]'); if (!b) return;
        if (b.dataset.one === 'unsub') return unsub(k);
        act(b.dataset.one, [k]);
      };
      if (row && row.unread) act('read', [k], true); // opening an email marks it read, like Gmail
    }).catch(function (e) { if (OPEN === k) box.innerHTML = top + '<div class="empty err">' + esc(e.message) + '</div>'; });
  }

  function closeReader(noDraw) {
    OPEN = null;
    $('mxRead').innerHTML = '<span class="tag lbl">// decoder</span><div class="empty">SELECT A MESSAGE · <kbd>J</kbd> <kbd>K</kbd> TO MOVE · <kbd>ENTER</kbd> TO OPEN</div>';
    if (!noDraw) drawList();
  }

  /* ---------- actions: instant on screen, then confirmed by the engine ---------- */
  function toggleSel(k, on) { if (on) SEL[k] = true; else delete SEL[k]; drawList(); }

  function act(action, keys, silent) {
    if (!keys.length) return;
    var removes = action === 'trash' || action === 'archive' || action === 'spam';
    var before = ROWS.map(function (r) { return Object.assign({}, r); });
    var beforeAcc = ACC.map(function (a) { return Object.assign({}, a); });
    var groups = {};
    keys.forEach(function (k) { var p = k.split('|'); var g = p[0] + '|' + p[1]; (groups[g] = groups[g] || []).push(Number(p[2])); });
    var hit = function (r) { return keys.indexOf(key(r)) >= 0; };
    ACC.forEach(function (a) {
      var d = 0;
      ROWS.forEach(function (r) {
        if (r.account !== a.id || !hit(r)) return;
        if (r.unread && (removes || action === 'read')) d--;
        if (!r.unread && action === 'unread') d++;
      });
      if (a.inbox_unread != null) a.inbox_unread = Math.max(0, a.inbox_unread + d);
    });
    var finish = function () {
      if (removes) {
        var idx = OPEN ? ROWS.findIndex(function (r) { return key(r) === OPEN; }) : -1;
        ROWS = ROWS.filter(function (r) { return !hit(r); });
        keys.forEach(function (k) { delete READS[k]; delete SEL[k]; });
        if (keys.indexOf(OPEN) >= 0) {
          var next = ROWS[Math.min(Math.max(idx, 0), ROWS.length - 1)];
          if (next) { CUR = ROWS.indexOf(next); open(key(next)); } else closeReader(true);
        } else if (CUR >= ROWS.length) CUR = ROWS.length - 1;
      } else {
        ROWS.forEach(function (r) { if (hit(r)) r.unread = action === 'unread'; });
      }
      drawList(); drawCore(); drawPods();
    };
    if (removes) {
      keys.forEach(function (k) { var el = $('mxList').querySelector('[data-k="' + cssEsc(k) + '"]'); if (el) el.classList.add('out'); });
      setTimeout(finish, 180);
    } else finish();
    if (!silent) toast({ trash: 'MOVED TO TRASH', archive: 'ARCHIVED', spam: 'MOVED TO SPAM', read: 'MARKED READ', unread: 'MARKED UNREAD' }[action] || 'DONE');
    Promise.all(Object.keys(groups).map(function (g) { var p = g.split('|'); return api('/act', { action: action, account: p[0], folder: p[1], uids: groups[g] }); }))
      .catch(function (e) { ROWS = before; ACC = beforeAcc; drawList(); drawCore(); drawPods(); toast('UNDONE · ' + e.message); });
  }

  function unsub(k) {
    var p = k.split('|');
    api('/unsubscribe', { account: p[0], folder: p[1], uid: Number(p[2]) }).then(function (j) {
      var r = j.result || {};
      if (r.done) toast('UNSUBSCRIBED');
      else if (r.link) { toast('OPENING THEIR PAGE'); window.open(r.link, '_blank', 'noopener'); }
      else toast(String(r.note || 'No unsubscribe option').toUpperCase());
    }).catch(function (e) { toast(e.message); });
  }

  /* ---------- keyboard ---------- */
  function keys(e) {
    if (!visible() || e.metaKey || e.ctrlKey || e.altKey) return;
    if (/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '')) return;
    var k = e.key;
    var move = function (d) {
      if (!ROWS.length) return;
      CUR = Math.min(ROWS.length - 1, Math.max(0, CUR + d));
      drawList(); prefetch(key(ROWS[CUR])).catch(function () {});
      var el = $('mxList').querySelector('.row.cur'); if (el) el.scrollIntoView({ block: 'nearest' });
    };
    var target = function () { var s = Object.keys(SEL); return s.length ? s : OPEN ? [OPEN] : ROWS[CUR] ? [key(ROWS[CUR])] : []; };
    if (k === '/') { e.preventDefault(); $('mxQ').focus(); }
    else if (k === 'j' || k === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (k === 'k' || k === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if ((k === 'Enter' || k === 'o') && ROWS[CUR]) { e.preventDefault(); open(key(ROWS[CUR])); }
    else if (k === 'x' && ROWS[CUR]) { var kk = key(ROWS[CUR]); toggleSel(kk, !SEL[kk]); }
    else if (k === 'e') act('archive', target());
    else if (k === '#' || k === 'Delete') act('trash', target());
    else if (k === 'u') { var t = target(); var r = ROWS.filter(function (x) { return t.indexOf(key(x)) >= 0; })[0]; act(r && r.unread ? 'read' : 'unread', t); }
    else if (k === 'r') sync();
    else if (k === 'Escape') { if (Object.keys(SEL).length) { SEL = {}; drawList(); } else closeReader(); }
  }

  /* ---------- start ---------- */
  window.MMMMail = function () {
    if (!BASE) { $('mail').innerHTML = '<div class="pnl warnbox"><b>The MiniMax OS engine is not connected yet.</b> Put its address in <code>/assets/mmm-config.js</code> (MMM_ENGINE_URL).</div>'; return; }
    if (started) { refresh(true); return; }
    started = true; shell();
    var snap = load();
    if (snap && snap.rows) { useSnapshot(snap); ROWS = snap.rows; drawList(); } else { drawCore(); skeleton(); }
    drawStat();
    refresh(true);
    setInterval(function () { if (visible() && !document.hidden && !QUERY && (FILTER === 'all' || FILTER === 'unread')) refresh(true); }, 30000);
  };
})();
