/* Admin · Ayiti P2P tab: run the Ayiti P2P marketplace from here.
   Talks to the marketplace API at ayitip2p.com. Owner login: your owner phone + a code sent to your email.
   The login token is kept only in this browser. Draws the first time the tab opens, refreshes every 60 s while open. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} } };
  var DEFAULT_API = 'https://ayitip2p.com';
  // The old onrender.com address is switched off: move saved logins to the real domain.
  if (/onrender\.com/.test(store.get('hp2p_api') || '')) { store.set('hp2p_api', null); store.set('hp2p_token', null); }
  var BASE = (store.get('hp2p_api') || DEFAULT_API).replace(/\/+$/, '');
  var TOKEN = store.get('hp2p_token');
  var n0 = function (x) { return Number(x || 0).toLocaleString('en-US', { maximumFractionDigits: 0 }); };
  var n2 = function (x) { return Number(x || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var ago = function (d) { var s = (Date.now() - new Date(d).getTime()) / 1000; return s < 60 ? 'now' : s < 3600 ? Math.round(s / 60) + ' min ago' : s < 86400 ? Math.round(s / 3600) + ' h ago' : Math.round(s / 86400) + ' d ago'; };
  var when = function (d) { return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); };
  var PAY = { MONCASH: 'MonCash', NATCASH: 'NatCash', BANK: 'Bank' };
  var STATE = { ORDER_CREATED: ['Locking', 'dim'], AWAITING_PAYMENT: ['Waiting for pay', 'amb'], PAID_CLAIMED: ['Paid · seller must release', 'amb'], DISPUTED: ['Dispute', 'bad'],
    RELEASING: ['Releasing', 'dim'], COMPLETED: ['Done', 'ok'], REFUNDING: ['Refunding', 'dim'], REFUNDED: ['Refunded', 'dim'], CANCELLED_TIMEOUT: ['Cancelled', 'dim'] };

  var CSS = '#hx{display:grid;gap:16px}#hx .kpis{margin-top:0}' +
    '#hx .ok{color:var(--win)}#hx .bad{color:var(--loss)}#hx .amb{color:var(--amber)}#hx .dim{color:var(--faint)}' +
    '#hx .bar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between;color:var(--mute);font-size:13.5px}' +
    '#hx .bar .r{display:flex;gap:8px;flex-wrap:wrap;align-items:center}' +
    '#hx input,#hx select,#hx textarea{font:13px var(--sans);color:var(--ink);background:var(--sheet2);border:1px solid var(--rule2);border-radius:4px;padding:8px 10px}' +
    '#hx textarea{width:100%;box-sizing:border-box;min-height:64px}' +
    '#hx .g2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}@media (max-width:1000px){#hx .g2{grid-template-columns:minmax(0,1fr)}}' +
    '#hx table{width:100%;border-collapse:collapse;font-size:13px}#hx .tw{overflow-x:auto}' +
    '#hx th{text-align:left;font:600 11px var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--mute);padding:8px;border-bottom:1px solid var(--rule2);background:var(--sheet2);white-space:nowrap}' +
    '#hx td{padding:8px;border-bottom:1px solid var(--rule);vertical-align:top}#hx td.num{font-family:var(--mono);text-align:right;white-space:nowrap}' +
    '#hx .chip{display:inline-block;font:600 11px/1 var(--mono);padding:4px 6px;border-radius:3px;margin:0 3px 3px 0;border:1px solid var(--rule2);color:var(--mute)}' +
    '#hx .chip.MONCASH{color:#ff8f8f;border-color:rgba(255,143,143,.4)}#hx .chip.NATCASH{color:#ffc56b;border-color:rgba(255,197,107,.4)}#hx .chip.BANK{color:#9cb8ff;border-color:rgba(156,184,255,.4)}' +
    '#hx .btn.sm{padding:6px 9px;font-size:12px}#hx .btn.red{border-color:rgba(242,115,106,.6);color:var(--loss)}#hx .btn.grn{border-color:rgba(79,211,154,.6);color:var(--win)}' +
    '#hx .login{max-width:460px;border:1px solid var(--rule2);background:var(--sheet);padding:22px}#hx .login label{display:block;font-size:12.5px;color:var(--mute);margin:12px 0 4px}#hx .login input{width:100%;box-sizing:border-box}' +
    '#hx .chart{display:flex;align-items:flex-end;gap:3px;height:120px;padding-top:6px}#hx .chart i{flex:1;background:var(--gold);opacity:.85;min-height:1px;border-radius:2px 2px 0 0;position:relative}' +
    '#hx .chart i:hover{opacity:1}#hx .ax{display:flex;justify-content:space-between;font:11px var(--mono);color:var(--faint);margin-top:4px}' +
    '#hx .item{border-bottom:1px solid var(--rule);padding:10px 0}#hx .item:last-child{border:0}#hx .item .t{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}' +
    '#hx .quote{border-left:3px solid var(--loss);padding:6px 10px;margin:8px 0;background:var(--sheet2);white-space:pre-wrap;font-size:13px}' +
    '#hx .chat{max-height:220px;overflow:auto;background:var(--sheet2);padding:8px 10px;font-size:12.5px;margin:8px 0}#hx .chat div{padding:2px 0}' +
    '#hx .kv{display:grid;grid-template-columns:auto 1fr;gap:4px 14px;font-size:13px}#hx .kv span{color:var(--mute)}' +
    '#hx .kmed{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin:8px 0}#hx .kmed img,#hx .kmed video{width:100%;max-height:220px;object-fit:contain;background:#000;border-radius:4px;display:block}#hx .slot{font-size:12px;color:var(--faint)}' +
    '#hx .robot{border:1px solid var(--rule2);background:var(--sheet2);padding:8px 10px;margin:8px 0;font-size:13px}#hx .robot ul{list-style:none;padding:0;margin:6px 0}#hx .robot li{padding:2px 0}' +
    '#hx .warn{border:1px solid rgba(240,179,65,.5);background:rgba(240,179,65,.08);padding:10px 12px;font-size:13px}';

  var drawn = false, timer = null;

  function api(method, path, body) {
    return fetch(BASE + '/api' + path, { method: method, headers: Object.assign({ 'content-type': 'application/json' }, TOKEN ? { authorization: 'Bearer ' + TOKEN } : {}), body: body ? JSON.stringify(body) : undefined })
      .then(function (r) {
        return r.text().then(function (t) {
          var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {}
          if (r.status === 401) { TOKEN = null; store.set('hp2p_token', null); draw(); }
          if (!r.ok) throw new Error((j && j.error) || ('Server error ' + r.status));
          return j;
        });
      }, function () { throw new Error('Cannot reach ayitip2p.com. Check your internet, then press Refresh.'); });
  }
  function toast(msg, bad) {
    var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; if (bad) t.style.background = 'var(--loss)';
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3500);
  }
  // Two-step button for things that cannot be undone: first click asks, second click does it.
  function sure(b) {
    if (b.dataset.armed === '1') { b.dataset.armed = ''; b.textContent = b.dataset.label; return true; }
    b.dataset.label = b.textContent; b.dataset.armed = '1'; b.textContent = 'Sure? Click again';
    setTimeout(function () { if (b.dataset.armed === '1') { b.dataset.armed = ''; b.textContent = b.dataset.label; } }, 4000);
    return false;
  }
  function run(btn, fn) { btn.disabled = true; return Promise.resolve().then(fn).catch(function (e) { toast(e.message, true); }).then(function () { btn.disabled = false; }); }

  // ---------- login ----------
  function loginForm() {
    $('hx').innerHTML = '<div class="login"><h2 style="margin:0 0 6px;font-family:var(--serif)">Ayiti P2P owner login</h2>' +
      '<p class="more">Press <b>Send me a code</b>, type the 6-digit code from your email, then press <b>Log in</b>. No password needed here. The login stays in this browser only.</p>' +
      '<label for="hpPhone">Your phone or email</label><input id="hpPhone" autocomplete="username" placeholder="+44 7415 991172 or you@email.com" value="' + esc(store.get('hp2p_phone') || '') + '">' +
      '<label for="hpCode">Code</label><div style="display:flex;gap:8px"><input id="hpCode" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="6 digits"><button class="btn" id="hpSend" type="button" style="white-space:nowrap">Send me a code</button></div>' +
      '<details style="margin-top:12px"><summary class="more" style="cursor:pointer">Server address</summary><input id="hpApi" value="' + esc(BASE) + '" style="margin-top:6px"></details>' +
      '<div style="margin-top:14px;display:flex;gap:8px"><button class="btn gold" id="hpGo" type="button">Log in</button><a class="btn" href="' + esc(BASE) + '" target="_blank" rel="noopener">Open the app</a></div></div>';
    var go = function () {
      var phone = $('hpPhone').value.trim(), code = $('hpCode').value.trim(), base = $('hpApi').value.trim().replace(/\/+$/, '');
      if (base) { BASE = base; store.set('hp2p_api', base === DEFAULT_API ? null : base); }
      return run($('hpGo'), function () {
        return api('POST', '/auth/login', { login: phone, code: code }).then(function (r) {
          if (!r.user || r.user.role !== 'ADMIN') throw new Error('This account is not the owner account.');
          TOKEN = r.token; store.set('hp2p_token', TOKEN); store.set('hp2p_phone', phone); draw();
        });
      });
    };
    $('hpGo').onclick = go;
    $('hpSend').onclick = function () {
      var phone = $('hpPhone').value.trim();
      return run($('hpSend'), function () {
        return api('POST', '/auth/request-code', { login: phone, mode: 'login' }).then(function (r) {
          toast('Code sent' + (r.to ? ' to ' + r.to : '') + '. Check your email (and spam).');
        });
      });
    };
    $('hpCode').onkeydown = function (e) { if (e.key === 'Enter') go(); };
  }

  // ---------- dashboard ----------
  function shell() {
    $('hx').innerHTML =
      '<div class="bar"><span id="hpWhere">Connected to <code>' + esc(BASE.replace(/^https?:\/\//, '')) + '</code></span><span class="r">' +
      '<span class="dim" id="hpUpd"></span><button class="btn sm" id="hpRef" type="button">Refresh</button>' +
      '<a class="btn sm" href="' + esc(BASE) + '" target="_blank" rel="noopener">Open the app</a>' +
      '<a class="btn sm" href="https://dashboard.render.com" target="_blank" rel="noopener">Render</a>' +
      '<button class="btn sm" id="hpOut" type="button">Log out</button></span></div>' +
      '<div id="hpWarn"></div><div class="kpis" id="hpK"></div>' +
      '<section class="panel"><div class="ph"><h2>Contract &amp; money on Arbitrum</h2><span class="r" style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn sm gold" id="hpOwnTab" target="_blank" rel="noopener" href="#">Open Owner tools (new tab)</a><button class="btn sm" id="hpOwnShow" type="button">Show Owner tools here</button></span></div>' +
      '<div class="kv" id="hpChain"><span>Status</span><b class="dim">loading…</b></div>' +
      '<div id="hpOwnBox" style="display:none;margin-top:14px"><p class="more">Take out fees, pause, or decide a dispute. If your wallet does not open inside this box, use <b>Open Owner tools (new tab)</b>.</p><iframe id="hpOwnFrame" title="Owner tools" allow="clipboard-write" style="width:100%;height:1500px;border:1px solid var(--line,#ddd);border-radius:12px;background:#fff"></iframe></div></section>' +
      '<div class="g2"><section class="panel"><div class="ph"><h2>Completed trades · 30 days</h2><small id="hpCh2"></small></div><div class="chart" id="hpCh"></div><div class="ax" id="hpAx"></div></section>' +
      '<section class="panel"><h2>Server</h2><div class="kv" id="hpSrv"></div><div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" id="hpTim" type="button">Run timers now</button><button class="btn sm" id="hpRec" type="button">Check the books (reconcile)</button><a class="btn sm" id="hpOwner" target="_blank" rel="noopener" href="#">Owner tools: contract, fees, pause</a></div><p class="more">Server settings (codes, SMS, escrow) are environment variables. Change them on Render, then it restarts by itself.</p></section></div>' +
      '<section class="panel"><div class="ph"><h2>Automatic ID check</h2><span class="r" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><label class="more" style="display:flex;gap:6px;align-items:center;margin:0"><input type="checkbox" id="hpAuto"> Approve clear cases by itself</label><button class="btn sm" id="hpRun" type="button">Check the next ID now</button></span></div>' +
      '<p class="more">Free, on our own server. For every ID it reads the name and number on the card, compares the face on the ID with the face in the video, checks the head turns left and right (a live person, not a photo), and checks the face and ID number are not already on another account. All clear = approved in about a minute. Anything unsure waits for you below, with the reasons. It never rejects anyone by itself.</p>' +
      '<div id="hpAutoList"></div></section>' +
      '<section class="panel"><div class="ph"><h2>Commercial Sellers</h2><span class="r" style="display:flex;gap:8px;align-items:center"><small id="hpBc"></small><select id="hpBs"><option value="PENDING">Waiting</option><option value="APPROVED">Approved</option><option value="ALL">All</option></select></span></div>' +
      '<p class="more">Businesses asking for the Commercial Seller badge. Approve = their business name and badge show on the MarketPlace. They get an email either way.</p><div id="hpBiz"></div></section>' +
      '<section class="panel"><div class="ph"><h2>Help messages</h2><span class="r" style="display:flex;gap:8px;align-items:center"><small id="hpHc"></small><select id="hpHs"><option value="OPEN">Waiting</option><option value="ANSWERED">Answered</option><option value="ALL">All</option></select></span></div>' +
      '<p class="more">Questions the help bot could not answer. Your answer shows in the person\'s app and goes to their email.</p><div id="hpHelp"></div></section>' +
      '<div class="g2"><section class="panel"><div class="ph"><h2>ID checks waiting for you</h2><small id="hpKc"></small></div><div id="hpKyc"></div></section>' +
      '<section class="panel"><div class="ph"><h2>Disputes</h2><small id="hpDc"></small></div><div id="hpDis"></div></section></div>' +
      '<section class="panel"><div class="ph"><h2>Orders</h2><select id="hpOs"><option value="">All</option>' + Object.keys(STATE).map(function (k) { return '<option value="' + k + '">' + STATE[k][0] + '</option>'; }).join('') + '</select></div><div class="tw" id="hpOrd"></div></section>' +
      '<section class="panel"><div class="ph"><h2>Ads on the market</h2><small>You can pause or close any ad</small></div><div class="tw" id="hpAds"></div></section>' +
      '<section class="panel"><div class="ph"><h2>Users</h2><span class="r" style="display:flex;gap:8px"><input id="hpQ" type="search" placeholder="Phone or name"><button class="btn sm" id="hpQs" type="button">Search</button></span></div><div class="tw" id="hpUsr"></div></section>' +
      '<div class="g2"><section class="panel"><h2>Limits per tier</h2><div class="tw" id="hpLim"></div></section>' +
      '<section class="panel"><h2>Blocklist</h2><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px"><select id="hpBk"><option>PHONE</option><option>WALLET</option><option>PAY_ACCOUNT</option><option>NAME</option></select><input id="hpBv" placeholder="Value"><button class="btn sm" id="hpBa" type="button">Block</button></div><div class="tw" id="hpBl"></div></section></div>';
    $('hpOwner').href = BASE + '/owner.html';
    $('hpOwnTab').href = BASE + '/owner.html';
    $('hpOwnShow').onclick = function () {
      var box = $('hpOwnBox'), on = box.style.display === 'none';
      if (on && !$('hpOwnFrame').src) $('hpOwnFrame').src = BASE + '/owner.html';
      box.style.display = on ? '' : 'none'; $('hpOwnShow').textContent = on ? 'Hide Owner tools' : 'Show Owner tools here';
    };
    $('hpRef').onclick = function () { run($('hpRef'), loadAll); };
    $('hpOut').onclick = function () { TOKEN = null; store.set('hp2p_token', null); draw(); };
    $('hpOs').onchange = loadOrders;
    $('hpQs').onclick = loadUsers; $('hpQ').onkeydown = function (e) { if (e.key === 'Enter') loadUsers(); };
    $('hpTim').onclick = function () { run($('hpTim'), function () { return api('POST', '/admin/run-timers').then(function (r) { toast('Timers ran: ' + JSON.stringify(r)); loadAll(); }); }); };
    $('hpRec').onclick = function () { run($('hpRec'), function () { return api('GET', '/admin/reconcile').then(function (r) { toast('Reconcile: ' + JSON.stringify(r)); }); }); };
    $('hpHs').onchange = loadHelp;
    $('hpBs').onchange = loadBiz;
    $('hpAuto').onchange = function () { var on = $('hpAuto').checked; api('POST', '/admin/idcheck', { auto_approve: on }).then(function () { toast(on ? 'Auto-approve is ON.' : 'Auto-approve is OFF: every ID waits for you.'); }, function (e) { toast(e.message, true); $('hpAuto').checked = !on; }); };
    $('hpRun').onclick = function () { run($('hpRun'), function () { return api('POST', '/admin/idcheck/run').then(function (r) { toast(r.done.length ? 'Checked: ' + r.done.map(function (d) { return d.status === 'AUTO_APPROVED' ? 'approved' : 'needs you'; }).join(', ') : 'Nothing waiting for the robot.'); loadKyc(); loadRobot(); loadOverview(); }); }); };
    $('hpBa').onclick = function () { run($('hpBa'), function () { return api('POST', '/admin/blocklist', { kind: $('hpBk').value, value: $('hpBv').value.trim(), reason: 'Admin' }).then(function () { $('hpBv').value = ''; loadBlock(); }); }); };
  }

  function loadOverview() {
    return api('GET', '/admin/overview').then(function (o) {
      var K = [
        [n0(o.users.verified) + '<small> / ' + n0(o.users.total) + '</small>', 'Users with ID checked', '+' + o.users.new_7d + ' new in 7 days'],
        [o.users.kyc_pending, 'ID checks waiting', o.users.kyc_pending ? 'Approve below' : 'Nothing waiting', o.users.kyc_pending ? 'amb' : ''],
        [o.disputes.open, 'Open disputes', o.disputes.total + ' ever', o.disputes.open ? 'bad' : ''],
        [o.orders.open, 'Open orders', o.orders.waiting_release + ' waiting for the seller'],
        [o.orders.done_24h + '<small> / ' + o.orders.done_7d + '</small>', 'Trades done', '24 h / 7 days · ' + o.orders.done_all + ' ever'],
        [n0(o.volume.htg_7d) + '<small> HTG</small>', 'Volume, 7 days', n2(o.volume.usd_7d) + ' USDT'],
        [n2(o.wallets.fees) + '<small> USDT</small>', 'Fees earned', 'Fee ' + (Number(o.server.fee_rate) * 100).toFixed(2) + '% from sellers'],
        [n2(o.wallets.locked) + '<small> USDT</small>', 'Held in escrow now', n2(o.wallets.available) + ' free in user wallets'],
        [(o.ads.best_sell ? n2(o.ads.best_sell) : '—') + '<small> / ' + (o.ads.best_buy ? n2(o.ads.best_buy) : '—') + '</small>', 'Best price HTG', 'sell / buy · ' + o.ads.sell + ' sell, ' + o.ads.buy + ' buy ads'],
      ];
      $('hpK').innerHTML = K.map(function (k) { return '<div class="kpi"><b class="' + (k[3] || '') + '">' + k[0] + '</b><span>' + esc(k[1]) + '<br><small>' + esc(k[2]) + '</small></span></div>'; }).join('');
      var mx = Math.max.apply(null, o.daily.map(function (d) { return Number(d.htg); }).concat([1]));
      $('hpCh').innerHTML = o.daily.map(function (d) { return '<i style="height:' + Math.max(1, Number(d.htg) / mx * 100) + '%" title="' + esc(d.day + ': ' + n0(d.htg) + ' HTG · ' + d.n + ' trades') + '"></i>'; }).join('');
      $('hpAx').innerHTML = '<span>' + esc(o.daily[0].day) + '</span><span>today</span>';
      $('hpCh2').textContent = n0(o.volume.htg_all) + ' HTG all time';
      var s = o.server;
      $('hpSrv').innerHTML = [
        ['Money', '<span class="ok">REAL · ' + esc(s.escrow_mode) + '</span>'],
        ['Login codes', '<span class="ok">' + (s.sms === 'email' ? 'by email (Brevo)' : esc(s.sms)) + '</span>'],
        ['Escrow network', esc(s.network)],
        ['Version', esc(s.commit || '—')], ['Running since', esc(when(s.started_at)) + ' <span class="dim">(' + ago(s.started_at) + ')</span>'],
      ].map(function (r) { return '<span>' + r[0] + '</span><b>' + r[1] + '</b>'; }).join('');
      var w = [];
      $('hpWarn').innerHTML = w.length ? '<div class="warn">' + w.map(esc).join('<br>') + '</div>' : '';
      $('hpKc').textContent = o.users.kyc_pending + ' waiting'; $('hpDc').textContent = o.disputes.open + ' open';
      $('hpUpd').textContent = 'Updated ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    });
  }

  // What the automatic check saw on one ID.
  function robot(k) {
    var r = k.auto_result || {}, st = k.auto_status;
    if (!st || st === 'QUEUED' || st === 'RUNNING') return '<div class="robot"><b>🤖 ' + (st === 'RUNNING' ? 'Checking now…' : 'Waiting for the automatic check (about 1 minute)') + '</b></div>';
    return '<div class="robot"><b>🤖 ' + (r.pass ? 'Automatic check: everything passed' : 'Automatic check: needs you') + '</b>' + (r.note ? '<div class="dim">' + esc(r.note) + '</div>' : '') +
      '<ul>' + (r.checks || []).map(function (c) { return '<li class="' + (c.ok ? 'ok' : c.blocking ? 'bad' : 'amb') + '">' + (c.ok ? '✓ ' : c.blocking ? '✗ ' : '• ') + esc(c.label) + (c.detail ? ' <span class="dim">— ' + esc(c.detail) + '</span>' : '') + '</li>'; }).join('') + '</ul>' +
      '<button class="btn sm" data-rechk="' + k.id + '" type="button">Check again</button></div>';
  }
  // The on/off switch and the last IDs the robot approved (undo if one looks wrong).
  function loadRobot() {
    return api('GET', '/admin/idcheck').then(function (s) {
      $('hpAuto').checked = !!s.auto_approve;
      $('hpAutoList').innerHTML = '<b style="font-size:13px">Approved by itself, latest first</b>' + (s.recent.length ? '<div class="tw"><table><thead><tr><th>When</th><th>Name</th><th>Phone</th><th>Face match</th><th>Files</th><th></th></tr></thead><tbody>' + s.recent.map(function (k) {
        return '<tr><td>' + esc(when(k.reviewed_at)) + '</td><td>' + esc(k.full_name) + '</td><td>' + esc(k.phone) + '</td><td class="num">' + Math.round(((k.auto_result || {}).best || 0) * 100) + '%</td>' +
          '<td>' + ['FRONT', 'BACK', 'VIDEO'].map(function (f) { return '<a href="#" data-kview="' + k.id + '/' + f + '">' + { FRONT: 'front', BACK: 'back', VIDEO: 'video' }[f] + '</a>'; }).join(' · ') + '</td>' +
          '<td><button class="btn sm red" data-undo="' + k.id + '" type="button">Undo</button></td></tr>';
      }).join('') + '</tbody></table></div>' : '<p class="more">None yet.</p>');
    });
  }

  var BIZT = { EXCHANGE: 'Exchange business (kanbis)', SHOP: 'Shop or store', SERVICES: 'Services', OTHER: 'Other' };
  function loadBiz() {
    return api('GET', '/admin/business?status=' + $('hpBs').value).then(function (list) {
      $('hpBc').textContent = list.length + ' shown';
      $('hpBiz').innerHTML = list.length ? list.map(function (b) {
        return '<div class="item" id="hb-' + b.id + '"><div class="t"><b>' + esc(b.business_name) + '</b><span class="dim">' + esc(b.business_status) + ' · ' + esc(ago(b.business_at)) + '</span></div>' +
          '<div class="more">' + esc(b.full_name) + ' · ' + esc(b.phone) + ' · level ' + esc(b.tier) + ' · ' + esc(b.trades) + ' sales done</div>' +
          '<div class="more">' + esc(BIZT[b.business_type] || b.business_type) + (b.business_reg ? ' · Reg: ' + esc(b.business_reg) : '') + '</div>' +
          (b.business_note ? '<div class="quote">' + esc(b.business_note) + '</div>' : '') +
          (b.business_status === 'PENDING' ? '<input placeholder="Reason, if you say no" style="margin-top:6px"><div style="display:flex;gap:8px;margin-top:6px"><button class="btn sm grn" data-bok="' + b.id + '" type="button">Approve</button><button class="btn sm red" data-bno="' + b.id + '" type="button">Say no</button></div>' : '') + '</div>';
      }).join('') : '<p class="more">Nothing here.</p>';
    });
  }
  function loadHelp() {
    return api('GET', '/admin/help?status=' + $('hpHs').value).then(function (list) {
      var open = list.filter(function (t) { return t.status === 'OPEN'; }).length;
      $('hpHc').textContent = $('hpHs').value === 'OPEN' ? open + ' waiting' : list.length + ' shown';
      $('hpHelp').innerHTML = list.length ? list.map(function (t) {
        return '<div class="item" id="hh-' + t.id + '"><div class="t"><b>' + esc(t.full_name ? t.full_name + ' · ' + t.phone : t.contact) + '</b><span class="dim">' + esc(ago(t.created_at)) + ' · ' + esc((t.lang || '').toUpperCase()) + (t.page ? ' · #' + esc(t.page) : '') + '</span></div>' +
          '<div class="quote" style="border-left-color:var(--gold)">' + esc(t.message) + '</div>' +
          (t.reply ? '<div class="more"><b>Your answer' + (t.replied_at ? ' (' + esc(ago(t.replied_at)) + ')' : '') + ':</b> ' + esc(t.reply) + '</div>' : '') +
          (t.status !== 'CLOSED' ? '<textarea placeholder="Your answer (in ' + esc(t.lang === 'ht' ? 'Kreyòl' : t.lang === 'fr' ? 'French' : 'English') + ')"></textarea><div style="display:flex;gap:8px;margin-top:6px"><button class="btn sm grn" data-hrep="' + t.id + '" type="button">Send answer</button><button class="btn sm" data-hclose="' + t.id + '" type="button">Close</button></div>' : '') + '</div>';
      }).join('') : '<p class="more">No messages.</p>';
    });
  }

  var ID_NAME = { NATIONAL_ID: 'National ID card', PASSPORT: 'Passport', DRIVER_LICENSE: "Driver's license" };
  function loadKyc() {
    return api('GET', '/staff/kyc').then(function (list) {
      $('hpKyc').innerHTML = list.length ? list.map(function (k) {
        var files = ['FRONT', 'BACK', 'VIDEO'].filter(function (x) { return (k.files || []).indexOf(x) >= 0; });
        return '<div class="item"><div class="t"><b>' + esc(k.full_name) + '</b><span class="dim">' + esc(ago(k.created_at)) + '</span></div>' +
          '<div class="kv" style="margin:6px 0"><span>Phone</span><b>' + esc(k.phone) + '</b><span>Name on ID</span><b>' + esc(k.name_on_id) + '</b>' +
          '<span>ID</span><b>' + esc((ID_NAME[k.id_type] || k.id_type || 'old form') + (k.id_number ? ' · ' + k.id_number : '')) + '</b>' +
          (k.challenge ? '<span>Must say</span><b>"My name is ' + esc(k.full_name) + '. My phone number is ' + esc(k.phone) + '. My code is ' + esc(k.challenge) + '."</b>' : '') + '</div>' +
          (String(k.name_on_id || '').trim().toLowerCase() !== String(k.full_name || '').trim().toLowerCase() ? '<div class="amb" style="font-size:12.5px">Names do not match exactly. Check carefully.</div>' : '') +
          (files.length ? '<div class="kmed">' + files.map(function (f) { return '<div><span class="dim">' + { FRONT: 'Front', BACK: 'Back', VIDEO: 'Video' }[f] + '</span><div class="slot" data-kf="' + k.id + '/' + f + '">Loading…</div></div>'; }).join('') + '</div>' : '') +
          robot(k) +
          '<p class="more">Check: the face in the video is the face on the ID · they say the right name, phone and code · the ID looks real and not expired.</p>' +
          '<div style="display:flex;gap:8px;margin-top:6px"><button class="btn sm grn" data-kyc="' + k.id + '" data-ok="1" type="button">Approve</button><button class="btn sm red" data-kyc="' + k.id + '" type="button">Reject</button></div></div>';
      }).join('') : '<p class="more">Nobody is waiting.</p>';
      // load the photos and the video (they need the login token)
      [].forEach.call($('hpKyc').querySelectorAll('[data-kf]'), function (slot) {
        var parts = slot.dataset.kf.split('/');
        fetch(BASE + '/api/staff/kyc/' + parts[0] + '/file/' + parts[1], { headers: { authorization: 'Bearer ' + TOKEN } })
          .then(function (r) { if (!r.ok) throw new Error(); return r.blob(); })
          .then(function (b) {
            var src = URL.createObjectURL(b);
            slot.innerHTML = parts[1] === 'VIDEO' ? '<video src="' + src + '" controls playsinline></video>' : '<a href="' + src + '" target="_blank" rel="noopener"><img src="' + src + '" alt=""></a>';
          }).catch(function () { slot.textContent = 'Could not load.'; });
      });
    });
  }

  function loadDisputes() {
    return api('GET', '/staff/disputes').then(function (list) {
      $('hpDis').innerHTML = list.length ? list.map(function (d) {
        return '<div class="item" id="hd-' + d.id + '"><div class="t"><b>' + n2(d.amount) + ' ' + esc(d.asset) + ' · ' + n0(d.total_htg) + ' HTG</b><span class="dim">' + esc(ago(d.created_at)) + ' · ' + d.votes + ' vote(s)</span></div>' +
          '<div class="quote">' + esc(d.reason) + '</div><button class="btn sm" data-dis="' + d.id + '" type="button">Open the case</button><div class="case"></div></div>';
      }).join('') : '<p class="more">No open disputes.</p>';
    });
  }

  function openCase(id, btn) {
    var box = document.querySelector('#hd-' + id + ' .case');
    return api('GET', '/staff/disputes/' + id).then(function (c) {
      var o = c.order, name = function (uid) { return uid === o.buyer_id ? 'Buyer' : uid === o.seller_id ? 'Seller' : 'System'; };
      box.innerHTML = '<div class="kv" style="margin:8px 0"><span>Buyer</span><b>' + esc(o.buyer_name) + ' · ' + esc(o.buyer_phone) + '</b><span>Seller</span><b>' + esc(o.seller_name) + ' · ' + esc(o.seller_phone) + '</b>' +
        '<span>Paid to</span><b>' + esc((o.bank_name || PAY[o.pay_type] || '') + ' ' + (o.account_ref || '') + ' · ' + (o.account_name || '')) + '</b><span>Payment code</span><b>' + esc(o.pay_reference) + '</b>' +
        '<span>Proof due</span><b>' + esc(when(c.dispute.evidence_due)) + '</b></div>' +
        '<b style="font-size:13px">Proof (' + c.evidence.length + ')</b><div>' + (c.evidence.length ? c.evidence.map(function (e) {
          return '<div style="font-size:13px;padding:3px 0">' + name(e.uploaded_by) + ' · ' + esc(e.kind) + ' · ' + (String(e.file_ref).indexOf('upload:') === 0 ? '<a href="#" data-file="' + e.id + '">' + esc(e.orig_name || 'file') + '</a>' : esc(e.file_ref)) + '</div>';
        }).join('') : '<span class="more">None yet.</span>') + '</div>' +
        '<b style="font-size:13px">Chat</b><div class="chat">' + (c.chat.length ? c.chat.map(function (m) { return '<div><span class="dim">' + esc(when(m.created_at)) + '</span> <b>' + name(m.sender_id) + ':</b> ' + esc(m.body) + '</div>'; }).join('') : '<span class="dim">No messages.</span>') + '</div>' +
        '<p class="more">Check: name, amount and time match · code in the payment note · the receipt matches the SELLER\'s own statement (a screenshot alone is not enough).</p>' +
        '<textarea placeholder="Why did you decide this? (at least a few words)"></textarea>' +
        '<label class="more" style="display:block;margin:6px 0"><input type="checkbox" class="fk"> Fake proof (strike + ban the liar)</label>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm grn" data-vote="BUYER" data-id="' + id + '" type="button">Buyer wins: release USDT</button><button class="btn sm red" data-vote="SELLER" data-id="' + id + '" type="button">Seller wins: refund USDT</button></div>';
      btn.remove();
    });
  }

  function loadOrders() {
    return api('GET', '/admin/orders?state=' + encodeURIComponent($('hpOs').value)).then(function (list) {
      $('hpOrd').innerHTML = list.length ? '<table><thead><tr><th>When</th><th>Buyer</th><th>Seller</th><th>USDT</th><th>HTG</th><th>Price</th><th>Pay</th><th>Code</th><th>Status</th></tr></thead><tbody>' + list.map(function (o) {
        var st = STATE[o.state] || [o.state, ''];
        return '<tr><td>' + esc(when(o.created_at)) + '</td><td>' + esc(o.buyer) + '</td><td>' + esc(o.seller) + '</td><td class="num">' + n2(o.amount) + '</td><td class="num">' + n0(o.total_htg) + '</td><td class="num">' + n2(o.price_htg) + '</td><td><span class="chip ' + esc(o.pay_type) + '">' + esc(PAY[o.pay_type] || o.pay_type || '') + '</span></td><td><code>' + esc(o.pay_reference) + '</code></td><td class="' + st[1] + '">' + esc(st[0]) + '</td></tr>';
      }).join('') + '</tbody></table>' : '<p class="more">No orders.</p>';
    });
  }

  function loadAds() {
    return api('GET', '/admin/ads').then(function (list) {
      $('hpAds').innerHTML = list.length ? '<table><thead><tr><th>Side</th><th>Who</th><th>Price HTG</th><th>Left</th><th>Accepts</th><th>Status</th><th></th></tr></thead><tbody>' + list.map(function (a) {
        return '<tr><td class="' + (a.side === 'SELL' ? 'ok' : 'bad') + '">' + a.side + ' ' + esc(a.asset) + '</td><td>' + esc(a.owner) + ' <span class="dim">' + esc(a.phone) + '</span></td><td class="num">' + n2(a.price_htg) + '</td><td class="num">' + n2(a.remaining) + ' / ' + n2(a.total_amount) + '</td>' +
          '<td>' + (a.pay_types || []).map(function (p) { return '<span class="chip ' + esc(p) + '">' + esc(PAY[p] || p) + '</span>'; }).join('') + '</td><td>' + esc(a.status) + '</td><td style="white-space:nowrap">' +
          (a.status === 'ACTIVE' ? '<button class="btn sm" data-ad="' + a.id + '" data-st="PAUSED" type="button">Pause</button> ' : '<button class="btn sm" data-ad="' + a.id + '" data-st="ACTIVE" type="button">Resume</button> ') +
          '<button class="btn sm red" data-ad="' + a.id + '" data-st="CLOSED" type="button">Close</button></td></tr>';
      }).join('') + '</tbody></table>' : '<p class="more">No ads.</p>';
    });
  }

  function loadUsers() {
    return api('GET', '/admin/users?q=' + encodeURIComponent($('hpQ').value.trim())).then(function (list) {
      $('hpUsr').innerHTML = list.length ? '<table><thead><tr><th>Joined</th><th>Name</th><th>Phone</th><th>Role</th><th>Orders</th><th>Strikes</th><th>Tier</th><th></th></tr></thead><tbody>' + list.map(function (u) {
        return '<tr><td>' + esc(when(u.created_at)) + '</td><td>' + esc(u.display_name || u.full_name) + (u.display_name ? ' <span class="dim">(' + esc(u.full_name) + ')</span>' : '') + (u.banned ? ' <span class="bad">BANNED</span>' : '') + '</td><td>' + esc(u.phone) + '</td><td>' + esc(u.role) + '</td><td class="num">' + u.orders + '</td><td class="num">' + (u.strikes || 0) + '</td>' +
          '<td><select data-tier="' + u.id + '">' + [0, 1, 2, 3].map(function (n) { return '<option' + (n === u.tier ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></td><td>' +
          (u.role === 'ADMIN' ? '' : u.banned ? '<button class="btn sm" data-unban="' + u.id + '" type="button">Unban</button>' : '<button class="btn sm red" data-ban="' + u.id + '" data-name="' + esc(u.full_name) + '" type="button">Ban</button>') + '</td></tr>';
      }).join('') + '</tbody></table>' : '<p class="more">Nobody found.</p>';
    });
  }

  function loadLimits() {
    return api('GET', '/admin/limits').then(function (list) {
      $('hpLim').innerHTML = '<table><thead><tr><th>Tier</th><th>Max order HTG</th><th>Max per day HTG</th><th>Open orders</th><th></th></tr></thead><tbody>' + list.map(function (l) {
        return '<tr><td>' + l.tier + '</td><td><input size="9" data-l="max_order_htg" value="' + esc(l.max_order_htg) + '"></td><td><input size="9" data-l="max_daily_htg" value="' + esc(l.max_daily_htg) + '"></td><td><input size="3" data-l="max_open_orders" value="' + esc(l.max_open_orders) + '"></td><td><button class="btn sm" data-lim="' + l.tier + '" type="button">Save</button></td></tr>';
      }).join('') + '</tbody></table>';
    });
  }
  function loadBlock() {
    return api('GET', '/admin/blocklist').then(function (list) {
      $('hpBl').innerHTML = list.length ? '<table><tbody>' + list.slice(0, 100).map(function (b) { return '<tr><td>' + esc(b.kind) + '</td><td>' + esc(b.value) + '</td><td class="dim">' + esc(b.reason || '') + '</td></tr>'; }).join('') + '</tbody></table>' : '<p class="more">Nothing blocked.</p>';
    });
  }

  function loadChain() {
    return api('GET', '/admin/chain-status').then(function (c) {
      var short = function (a) { return a ? '<code>' + esc(a.slice(0, 6) + '…' + a.slice(-4)) + '</code>' : '—'; };
      var fees = Object.keys(c.fees_waiting || {}).map(function (k) { return n2(c.fees_waiting[k]) + ' ' + k; }).join(' · ');
      $('hpChain').innerHTML = [
        ['Network', c.chain_id === 42161 ? '<span class="ok">Arbitrum One (REAL money)</span>' : '<span class="bad">Wrong network ' + esc(c.chain_id) + '</span>'],
        ['Contract', (c.explorer ? '<a href="' + esc(c.explorer) + '" target="_blank" rel="noopener">' : '') + short(c.contract) + (c.explorer ? ' ↗</a>' : '')],
        ['Contract state', c.paused ? '<span class="bad">PAUSED (no new locks)</span>' : '<span class="ok">Running</span>'],
        ['Fees waiting for you', '<span class="ok">' + esc(fees || '0') + '</span> <span class="dim">(take them out in Owner tools)</span>'],
        ['App wallet gas (ETH)', (c.app_wallet_low ? '<span class="bad">' : '<span class="ok">') + esc(c.app_wallet_eth) + ' ETH</span>' + (c.app_wallet_low ? ' <span class="bad">LOW: send ETH to ' + short(c.app_wallet) + '</span>' : '') + (c.app_wallet_matches ? '' : ' <span class="bad">key does not match the contract</span>')],
        ['Owner', short(c.owner)], ['Fee wallet', short(c.fee_wallet)], ['Judge (arbiter)', short(c.arbiter)], ['App wallet', short(c.app_wallet)],
      ].map(function (r) { return '<span>' + r[0] + '</span><b>' + r[1] + '</b>'; }).join('');
    }).catch(function (e) { $('hpChain').innerHTML = '<span>Status</span><b><span class="bad">' + esc(e.message) + '</span></b>'; });
  }

  function loadAll() {
    return Promise.all([loadChain(), loadOverview(), loadBiz(), loadHelp(), loadRobot(), loadKyc(), loadDisputes(), loadOrders(), loadAds(), loadUsers(), loadLimits(), loadBlock()])
      .catch(function (e) { toast(e.message, true); });
  }

  // one click handler for everything inside the tab
  function onClick(e) {
    var b = e.target.closest('button,a[data-file],a[data-kview]'); if (!b || !$('hx').contains(b)) return;
    var d = b.dataset;
    if (d.bok || d.bno) { var bid = d.bok || d.bno, why = $('hb-' + bid).querySelector('input').value; run(b, function () { return api('POST', '/admin/business/' + bid, { approve: !!d.bok, note: why }).then(function () { toast(d.bok ? 'Approved: badge is on.' : 'Answer sent.'); loadBiz(); }); }); }
    else if (d.hrep) { var ta = $('hh-' + d.hrep).querySelector('textarea'); run(b, function () { return api('POST', '/admin/help/' + d.hrep + '/reply', { reply: ta.value }).then(function (r) { toast(r.emailed ? 'Answer sent (app + email).' : 'Answer saved in the app.'); loadHelp(); }); }); }
    else if (d.hclose) run(b, function () { return api('POST', '/admin/help/' + d.hclose + '/close').then(loadHelp); });
    else if (d.rechk) run(b, function () { return api('POST', '/staff/kyc/' + d.rechk + '/recheck').then(function () { toast('It will be checked again in about a minute.'); loadKyc(); }); });
    else if (d.undo) { if (!sure(b)) return; run(b, function () { return api('POST', '/admin/kyc/' + d.undo + '/undo').then(function () { toast('Undone: the ID is back in your waiting list. Trading level back to 0.'); loadRobot(); loadKyc(); loadOverview(); }); }); }
    else if (d.kview) {
      e.preventDefault(); var pp = d.kview.split('/');
      run(b, function () { return fetch(BASE + '/api/staff/kyc/' + pp[0] + '/file/' + pp[1], { headers: { authorization: 'Bearer ' + TOKEN } }).then(function (r) { if (!r.ok) throw new Error('Could not open the file.'); return r.blob(); }).then(function (bl) { window.open(URL.createObjectURL(bl), '_blank', 'noopener'); }); });
    }
    else if (d.kyc) run(b, function () { return api('POST', '/staff/kyc/' + d.kyc + '/decision', { approve: !!d.ok }).then(function () { toast(d.ok ? 'Approved.' : 'Rejected.'); loadKyc(); loadOverview(); }); });
    else if (d.dis) run(b, function () { return openCase(d.dis, b); });
    else if (d.vote) {
      var item = $('hd-' + d.id), note = item.querySelector('textarea').value, fake = item.querySelector('.fk').checked;
      if (!sure(b)) return;
      run(b, function () { return api('POST', '/staff/disputes/' + d.id + '/vote', { decision: d.vote, note: note, fake_proof: fake, penalize: true }).then(function (r) { toast(r.resolved ? 'Decided: ' + r.decision : 'Vote saved.'); loadDisputes(); loadOverview(); loadOrders(); }); });
    } else if (d.file) {
      e.preventDefault();
      run(b, function () { return fetch(BASE + '/api/evidence/' + d.file + '/file', { headers: { authorization: 'Bearer ' + TOKEN } }).then(function (r) { if (!r.ok) throw new Error('Could not open the file.'); return r.blob(); }).then(function (bl) { window.open(URL.createObjectURL(bl), '_blank', 'noopener'); }); });
    } else if (d.ad) {
      if (d.st === 'CLOSED' && !sure(b)) return;
      run(b, function () { return api('POST', '/admin/ads/' + d.ad + '/status', { status: d.st }).then(function () { toast('Ad ' + d.st.toLowerCase() + '.'); loadAds(); loadOverview(); }); });
    } else if (d.ban) {
      if (!sure(b)) return;
      run(b, function () { return api('POST', '/admin/users/' + d.ban + '/ban', { reason: 'Admin ban' }).then(function () { loadUsers(); loadBlock(); }); });
    } else if (d.unban) run(b, function () { return api('POST', '/admin/users/' + d.unban + '/unban').then(loadUsers); });
    else if (d.lim) {
      var row = b.closest('tr'), body = {};
      [].forEach.call(row.querySelectorAll('[data-l]'), function (i) { body[i.dataset.l] = i.value; });
      run(b, function () { return api('PUT', '/admin/limits/' + d.lim, body).then(function () { toast('Saved.'); }); });
    }
  }
  function onChange(e) {
    var s = e.target; if (!s.dataset || !s.dataset.tier) return;
    api('POST', '/admin/users/' + s.dataset.tier + '/tier', { tier: Number(s.value) }).then(function () { toast('Tier set to ' + s.value + '.'); }, function (er) { toast(er.message, true); });
  }

  function draw() {
    clearInterval(timer);
    if (!TOKEN) return loginForm();
    shell(); loadAll();
    timer = setInterval(function () { if ($('app').dataset.tab === 'haiti' && !document.hidden) loadOverview().catch(function () {}); }, 60000);
  }

  window.MMMHaiti = function () {
    if (drawn) return; drawn = true;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    $('hx').addEventListener('click', onClick); $('hx').addEventListener('change', onChange);
    draw();
  };
})();
