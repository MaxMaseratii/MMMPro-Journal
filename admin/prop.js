/* Admin · Prop firms tab: live offers, prices, direct links, affiliate links and the daily checks.
   Reads the same public files the /prop-firms/ page uses. Draws once, the first time the tab opens. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var money = function (n) { return n == null ? '—' : '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: n % 1 ? 2 : 0, minimumFractionDigits: n % 1 ? 2 : 0 }); };
  var V = Math.floor(Date.now() / 300000);
  var get = function (u) { return fetch(u + (u.indexOf('?') < 0 ? '?' : '&') + 'v=' + V).then(function (r) { return r.ok ? (/\.md$/.test(u) ? r.text() : r.json()) : null; }).catch(function () { return null; }); };
  var SRC = { site: ['Firm website', '#2aa9a9'], youtube: ['Firm YouTube', '#c08a12'], x: ['Firm X post', '#8f6fe0'], web: ['Web', '#5f6e77'] };
  var CSS = '#pd{display:grid;gap:16px}' +
    '#pd .kpis{margin-top:0}' +
    '#pd .g2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}@media (max-width:1000px){#pd .g2{grid-template-columns:minmax(0,1fr)}}' +
    '#pd .ok{color:var(--win)}#pd .bad{color:var(--loss)}#pd .dim{color:var(--faint)}' +
    '#pd .hb{display:grid;grid-template-columns:150px minmax(0,1fr) 46px;gap:8px;align-items:center;font-size:13px;padding:3px 0}' +
    '#pd .hb .nm{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '#pd .hb .tr{height:16px;position:relative}#pd .hb .tr i{position:absolute;inset:0 auto 0 0;border-radius:0 4px 4px 0}' +
    '#pd .hb .tr code{position:absolute;left:calc(var(--w) + 6px);top:0;font:11.5px/16px var(--mono);color:var(--mute);white-space:nowrap}' +
    '#pd .hb b{font:600 13px var(--mono);text-align:right}' +
    '#pd .db{display:grid;grid-template-columns:220px minmax(0,1fr) 130px;gap:8px;align-items:center;font-size:13px;padding:4px 0}' +
    '#pd .db .tr{position:relative;height:14px}#pd .db .tr .ln{position:absolute;top:6px;height:2px;background:var(--rule2)}' +
    '#pd .db .tr .dt{position:absolute;top:1px;width:12px;height:12px;border-radius:50%;margin-left:-6px;border:2px solid var(--sheet)}' +
    '#pd .db .pr{font:12.5px var(--mono);text-align:right;white-space:nowrap}#pd .db .pr s{color:var(--faint);margin-right:6px}' +
    '#pd .ax2{display:flex;justify-content:space-between;font:11px var(--mono);color:var(--faint);margin:4px 138px 0 228px}' +
    '#pd table{width:100%;border-collapse:collapse;font-size:13px;min-width:980px}' +
    '#pd th{text-align:left;font:600 11px var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--mute);padding:8px;border-bottom:1px solid var(--rule2);background:var(--sheet2);position:sticky;top:0}' +
    '#pd td{padding:8px;border-bottom:1px solid var(--rule);vertical-align:top}#pd td:nth-child(6),#pd td:nth-child(7){white-space:nowrap}#pd td:nth-child(3){min-width:200px}' +
    '#pd .chip{display:inline-block;font:600 11px/1 var(--mono);padding:4px 5px;border-radius:3px;margin:0 3px 3px 0;border:1px solid var(--rule2);color:var(--faint)}' +
    '#pd .chip.on{border-color:rgba(79,211,154,.5);color:var(--win);background:rgba(79,211,154,.08)}' +
    '#pd .pc{font:700 13px var(--mono);color:#0b0f12;background:var(--gold);padding:2px 5px;border-radius:3px}' +
    '#pd .log{margin:0;padding:0;list-style:none;font-size:13px;line-height:1.5}#pd .log li{padding:6px 0;border-bottom:1px solid var(--rule)}#pd .log li b{font-family:var(--mono);color:var(--gold);margin-right:6px}' +
    '#pd .tw{overflow:auto;max-height:none}';
  var drawn = false, USER = null, PLANS = null;
  document.addEventListener('mmm:auth', function (e) { USER = e.detail || null; });
  var FS = 'https://firestore.googleapis.com/v1/projects/mmm-pro-journal/databases/(default)/documents', KEY = 'AIzaSyDcrEEhcY6kHLQxZ7RQ37KmAcCDPgol0gg';
  function tok() { return USER ? USER.getIdToken() : Promise.reject(new Error('login')); }
  function listAll(col, t) {
    var out = [];
    function page(pt) { return fetch(FS + '/' + col + '?pageSize=300&key=' + KEY + (pt ? '&pageToken=' + encodeURIComponent(pt) : ''), { headers: { Authorization: 'Bearer ' + t } }).then(function (r) { if (r.status === 403) throw new Error('rules'); if (!r.ok) throw new Error('http'); return r.json(); })
      .then(function (j) { out = out.concat(j.documents || []); return j.nextPageToken && out.length < 6000 ? page(j.nextPageToken) : out; }); }
    return page();
  }
  var fv = function (f) { return f ? (f.stringValue != null ? f.stringValue : f.integerValue != null ? +f.integerValue : f.doubleValue != null ? +f.doubleValue : f.timestampValue || null) : null; };

  window.MMMPropDash = function () {
    if (drawn) return; drawn = true;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    $('pd').innerHTML = '<p class="more">Loading the prop firm data…</p>';
    var day = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/London' });
    Promise.all([get('/prop-firms/plans.json'), get('/prop-firms/offers.json'), get('/prop-firms/links.json'), get('/prop-firms/scan/latest.json'),
      fetch('https://firestore.googleapis.com/v1/projects/mmm-pro-journal/databases/(default)/documents/propAff?pageSize=100&key=AIzaSyDcrEEhcY6kHLQxZ7RQ37KmAcCDPgol0gg').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }),
      get('/admin/affiliates/programs.json'), get('/grok-offers/' + day + '.md')]).then(function (a) { draw(a[0], a[1] || {}, a[2] || {}, a[3], a[4], a[5], a[6], day); })
      .catch(function () { $('pd').innerHTML = '<p class="more">Could not load the prop firm files. Reload the page.</p>'; });
  };

  function draw(P, O, LK, SC, AF, PG, GROK, day) {
    if (!P) { $('pd').innerHTML = '<p class="more">Could not load plans.json.</p>'; return; }
    var firms = Object.keys(P.firms), one = P.plans.filter(function (p) { return p.billing !== 'Monthly'; });
    var accts = []; one.forEach(function (p) { p.sizes.forEach(function (z) { accts.push({ p: p, z: z }); }); });
    var live = (O.offers || []).filter(function (o) { return !o.ends || o.ends >= day; });
    var links = LK.links || {}, nLinks = accts.filter(function (r) { return (links[r.p.id] || {})[String(r.z.k)]; }).length;
    var aff = {}; ((AF && AF.documents) || []).forEach(function (d) { var f = d.fields || {}; var n = f.firm && f.firm.stringValue; if (n && ((f.url && f.url.stringValue) || (f.code && f.code.stringValue))) aff[n] = { url: f.url && f.url.stringValue, code: f.code && f.code.stringValue }; });
    var prog = {}; ((PG && PG.firms) || []).forEach(function (f) { prog[f.firm] = f; });
    var scanOk = SC ? firms.filter(function (f) { var e = SC.firms[f]; return e && e.pages.some(function (p) { return p.ok; }); }).length : 0;
    var scanAge = SC ? Math.round((Date.now() - Date.parse(SC.scanned)) / 3600000) : null;
    var offFor = function (p, k) { return live.filter(function (o) { return o.firm === p.firm && (!o.plans || !o.plans.length || o.plans.indexOf(p.id) >= 0) && (!o.sizes || !o.sizes.length || o.sizes.indexOf(k) >= 0); }); };
    var best = function (p, z) { var b = null; offFor(p, z.k).forEach(function (o) { var v = o.prices && o.prices[String(z.k)] != null ? +o.prices[String(z.k)] : o.pct && z.list != null ? Math.round(z.list * (1 - o.pct / 100) * 100) / 100 : null; if (v != null && (!b || v < b.v)) b = { v: v, o: o }; }); return b; };
    var top = live.slice().sort(function (a, b) { return (b.pct || 0) - (a.pct || 0); })[0];
    var K = [
      [live.length, 'Live offers', new Set(live.map(function (o) { return o.firm; })).size + ' of ' + firms.length + ' firms'],
      [top && top.pct ? top.pct + '%' : '—', 'Biggest discount', top ? top.firm : ''],
      [nLinks + ' / ' + accts.length, 'Direct account links', Math.round(nLinks / (accts.length || 1) * 100) + '% of accounts open the exact size'],
      [Object.keys(aff).length + ' / ' + firms.length, 'Your affiliate links', Object.keys(prog).filter(function (n) { return prog[n].found === 'yes'; }).length + ' firms have a program'],
      [SC ? scanOk + ' / ' + firms.length : '—', 'Sites read this morning', SC ? (scanAge <= 1 ? 'less than 1 hour ago' : scanAge + ' hours ago') : 'no scan yet'],
      [GROK ? '✓' : '✗', 'Grok file today', GROK ? (GROK.split('\n').filter(function (l) { return l.indexOf('|') > 0; }).length + ' lines from X') : 'not in the repo yet']
    ];
    var h = '<div class="kpis">' + K.map(function (k) { return '<div class="kpi"><b>' + esc(k[0]) + '</b><span>' + esc(k[1]) + '<br><small>' + esc(k[2]) + '</small></span></div>'; }).join('') + '</div>';

    // discount by firm
    var byFirm = {}; live.forEach(function (o) { if (o.pct && (!byFirm[o.firm] || o.pct > byFirm[o.firm].pct)) byFirm[o.firm] = o; });
    var noPct = live.filter(function (o) { return !o.pct && !byFirm[o.firm]; });
    var D = Object.keys(byFirm).map(function (k) { return byFirm[k]; }).sort(function (a, b) { return b.pct - a.pct; });
    var used = {}; D.forEach(function (o) { used[o.via] = 1; });
    h += '<div class="g2"><section class="panel"><div class="ph"><h2>Today\'s best discount per firm</h2><small>' + esc(O.updated_label || '') + '</small></div>' +
      '<div class="legend" style="margin-bottom:8px">' + Object.keys(SRC).filter(function (k) { return used[k]; }).map(function (k) { return '<span><i style="background:' + SRC[k][1] + '"></i>' + SRC[k][0] + '</span>'; }).join('') + '</div>' +
      D.map(function (o) { var w = o.pct + '%'; return '<div class="hb" data-tip="' + esc(o.firm) + '|' + esc(o.text) + (o.ends ? ' · ends ' + o.ends : '') + '"><span class="nm">' + esc(o.firm) + '</span><span class="tr" style="--w:' + w + '"><i style="width:' + w + ';background:' + (SRC[o.via] || SRC.web)[1] + '"></i>' + (o.code ? '<code>' + esc(o.code) + '</code>' : '') + '</span><b>' + o.pct + '%</b></div>'; }).join('') +
      (noPct.length ? '<p class="more">No % given: ' + noPct.map(function (o) { return esc(o.firm) + (o.code ? ' (' + esc(o.code) + ')' : ''); }).join(' · ') + '</p>' : '') +
      (!D.length ? '<p class="more">No live offer today.</p>' : '') + '</section>';

    // price before / after for one size
    h += '<section class="panel"><div class="ph"><h2>Price today vs list price</h2><span class="seg" id="pdSz">' + [25, 50, 100, 150].map(function (k) { return '<button type="button" data-k="' + k + '"' + (k === 50 ? ' aria-pressed="true"' : '') + '>' + k + 'K</button>'; }).join('') + '</span></div>' +
      '<div class="legend" style="margin-bottom:8px"><span><i style="background:#5f6e77;border-radius:50%"></i>List price</span><span><i style="background:var(--gold);border-radius:50%"></i>Today, after the offer</span></div><div id="pdDb"></div></section></div>';

    // every firm
    h += '<section class="panel"><div class="ph"><h2>Every firm at a glance</h2><small>green size = the card opens that exact account</small></div><div class="tw"><table><thead><tr><th>Firm</th><th>Offer today</th><th>Direct links</th><th>Your affiliate</th><th>Affiliate program</th><th>Site scan</th><th>YouTube</th></tr></thead><tbody>' +
      firms.map(function (f) {
        var ps = one.filter(function (p) { return p.firm === f; }), of = live.filter(function (o) { return o.firm === f; }), e = SC && SC.firms[f], pr = prog[f], a = aff[f];
        var chips = ps.map(function (p) { return '<div><span class="dim" style="font-size:12px">' + esc(p.plan) + '</span><br>' + p.sizes.map(function (z) { var on = (links[p.id] || {})[String(z.k)]; return '<span class="chip' + (on ? ' on' : '') + '">' + z.k + 'K</span>'; }).join('') + '</div>'; }).join('') || '<span class="dim">monthly only</span>';
        var okp = e ? e.pages.filter(function (p) { return p.ok; }).length : 0, promo = e ? e.pages.reduce(function (n, p) { return n + (p.promo || []).length; }, 0) : 0;
        var yt = e && e.youtube ? e.youtube.videos.length + ' recent videos' : '<span class="dim">none found</span>';
        return '<tr><td><b>' + esc(f) + '</b></td>' +
          '<td>' + (of.length ? of.map(function (o) { return (o.pct ? '<span class="pc">' + o.pct + '%</span> ' : '') + esc(o.text) + (o.code ? ' · <code>' + esc(o.code) + '</code>' : '') + ' <span class="dim">(' + esc((SRC[o.via] || SRC.web)[0]) + ')</span>'; }).join('<br>') : '<span class="dim">none</span>') + '</td>' +
          '<td>' + chips + '</td>' +
          '<td>' + (a ? '<span class="ok">✓ set</span>' + (a.code ? ' <code>' + esc(a.code) + '</code>' : '') : '<span class="dim">—</span>') + '</td>' +
          '<td>' + (pr ? (pr.found === 'yes' ? esc(pr.rate || 'yes') : '<span class="dim">' + ({ none: 'Ask support', dash: 'Join in their dashboard', email: 'Ask by email', '3rd': 'Third-party info only' }[pr.found] || esc(pr.found)) + '</span>') : '<span class="dim">not checked</span>') + '</td>' +
          '<td>' + (e ? (okp ? '<span class="ok">✓ ' + okp + '/' + e.pages.length + ' pages</span><br><span class="dim">' + promo + ' promo lines</span>' : '<span class="bad">✗ blocked</span>') : '<span class="dim">—</span>') + '</td>' +
          '<td>' + yt + '</td></tr>';
      }).join('') + '</tbody></table></div></section>';

    // check log
    h += '<section class="panel"><div class="ph"><h2>Daily check log</h2><small>newest first</small></div><ul class="log">' + (O.log || []).slice(0, 10).map(function (l) { var m = /^(\d{4}-\d{2}-\d{2})([^:]*):\s*(.*)$/.exec(l); return '<li>' + (m ? '<b>' + esc(m[1]) + esc(m[2]) + '</b>' + esc(m[3]) : esc(l)) + '</li>'; }).join('') + '</ul></section>';
    h = '<div id="pdMoney"><section class="panel"><p class="more">Loading money and clicks…</p></section></div>' + '<h2 style="font-family:var(--serif);font-size:22px;margin:10px 0 -4px">Offers and links</h2>' + h;
    $('pd').innerHTML = h;
    PLANS = P; loadMoney();

    function dumb(k) {
      var R = accts.filter(function (r) { return r.z.k === k && r.z.list != null; }).map(function (r) { var b = best(r.p, r.z); return { r: r, now: b ? b.v : r.z.list, b: b }; })
        .sort(function (a, b) { return a.now - b.now; });
      var mx = Math.max.apply(null, R.map(function (x) { return x.r.z.list; }).concat([1]));
      var st = mx > 1000 ? 250 : mx > 400 ? 100 : 50, top = Math.ceil(mx / st) * st, x = function (v) { return (v / top * 100).toFixed(2) + '%'; };
      $('pdDb').innerHTML = R.map(function (q) { var l = q.r.z.list, n = q.now;
        return '<div class="db" data-tip="' + esc(q.r.p.firm + ' · ' + q.r.p.plan + ' ' + k + 'K') + '|' + (q.b ? money(l) + ' → ' + money(n) + ' with ' + esc(q.b.o.code || 'the offer') : money(l) + ' · no offer today') + '"><span class="nm" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(q.r.p.firm) + ' <span class="dim">' + esc(q.r.p.plan) + '</span></span><span class="tr">' +
          (q.b ? '<span class="ln" style="left:' + x(n) + ';width:calc(' + x(l) + ' - ' + x(n) + ')"></span><span class="dt" style="left:' + x(l) + ';background:#5f6e77"></span>' : '') +
          '<span class="dt" style="left:' + x(n) + ';background:' + (q.b ? 'var(--gold)' : '#5f6e77') + '"></span></span><span class="pr">' + (q.b ? '<s>' + money(l) + '</s>' : '') + money(n) + '</span></div>'; }).join('') +
        '<div class="ax2"><span>$0</span><span>' + money(top / 2) + '</span><span>' + money(top) + '</span></div>' + (R.length ? '' : '<p class="more">No ' + k + 'K account on the list.</p>');
    }
    dumb(50);
    $('pdSz').addEventListener('click', function (e) { var b = e.target.closest('button[data-k]'); if (!b) return; [].forEach.call($('pdSz').children, function (x) { x.setAttribute('aria-pressed', x === b); }); dumb(+b.dataset.k); });
  }

  /* ---------- money + link clicks ---------- */
  var MONEY = null;
  function loadMoney() {
    var box = $('pdMoney');
    tok().then(function (t) { return Promise.all([listAll('propClicks', t), listAll('propEarn', t).catch(function (e) { if (e.message === 'rules') return null; throw e; })]); })
      .then(function (a) { MONEY = { clicks: a[0], earn: a[1] }; drawMoney(); })
      .catch(function (e) {
        box.innerHTML = '<section class="panel"><div class="ph"><h2>Money and link clicks</h2></div><p style="margin:0;color:#c3cdd2;font-size:14px;line-height:1.6">' + (e.message === 'rules'
          ? 'One step left: open <b>Firebase → Firestore → Rules</b> and paste the new block <b>"MMM prop clicks + money"</b> from <code>tools/vip-firestore.rules</code>, then press Publish. Clicks on /prop-firms/ start counting from that moment.'
          : e.message === 'login' ? 'Log in with your admin email to see clicks and money.' : 'Could not load the clicks. Reload the page.') + '</p></section>';
      });
  }
  function drawMoney() {
    var P = PLANS, plan = {}; P.plans.forEach(function (p) { plan[p.id] = p; });
    var firmOf = function (id) { if (plan[id]) return plan[id].firm; var f = Object.keys(P.firms).filter(function (n) { return 'x-' + n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 38) === id; })[0]; return f || id; };
    var C = MONEY.clicks.map(function (d) { var id = d.name.split('/').pop().split('__'); return { day: id[0], plan: id[1], k: id[2], t: id[3], n: fv((d.fields || {}).n) || 0 }; });
    var E = (MONEY.earn || []).map(function (d) { var f = d.fields || {}; return { id: d.name.split('/').pop(), date: fv(f.date) || '', firm: fv(f.firm) || '', usd: +fv(f.usd) || 0, note: fv(f.note) || '' }; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var today = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/London' }), dd = function (n) { return new Date(Date.parse(today + 'T12:00:00Z') - n * 864e5).toISOString().slice(0, 10); };
    var sum = function (L, f) { return L.filter(f).reduce(function (a, c) { return a + c.n; }, 0); };
    var b7 = sum(C, function (c) { return c.t === 'b' && c.day > dd(7); }), b14 = sum(C, function (c) { return c.t === 'b' && c.day > dd(14) && c.day <= dd(7); });
    var b30 = sum(C, function (c) { return c.t === 'b' && c.day > dd(30); }), c30 = sum(C, function (c) { return c.t === 'c' && c.day > dd(30); }), ball = sum(C, function (c) { return c.t === 'b'; });
    var mon = today.slice(0, 7), mNow = E.filter(function (e) { return e.date.slice(0, 7) === mon; }).reduce(function (a, e) { return a + e.usd; }, 0), mAll = E.reduce(function (a, e) { return a + e.usd; }, 0);
    var first = C.reduce(function (m, c) { return !m || c.day < m ? c.day : m; }, '');
    var h = '<div class="kpis">' + [
      [money$(mNow), 'Affiliate money this month', E.filter(function (e) { return e.date.slice(0, 7) === mon; }).length + ' payments'],
      [money$(mAll), 'Affiliate money, all time', E.length + ' payments'],
      [b7, 'Buy clicks, last 7 days', 'vs ' + b14 + ' the 7 days before'],
      [b30, 'Buy clicks, last 30 days', c30 + ' code copies'],
      [ball ? money$(Math.round(mAll / ball * 100) / 100) : '—', 'Money per buy click', ball + ' buy clicks counted' + (first ? ' since ' + first : '')]
    ].map(function (k) { return '<div class="kpi"><b>' + esc(k[0]) + '</b><span>' + esc(k[1]) + '<br><small>' + esc(k[2]) + '</small></span></div>'; }).join('') + '</div>';
    // clicks per day, 30 days
    var days = []; for (var i = 29; i >= 0; i--) days.push(dd(i));
    var per = days.map(function (d) { return [sum(C, function (c) { return c.day === d && c.t === 'b'; }), sum(C, function (c) { return c.day === d && c.t === 'c'; })]; });
    var mx = Math.max(1, Math.max.apply(null, per.map(function (x) { return x[0] + x[1]; }))), st = [1, 2, 5, 10, 20, 50, 100, 200, 500].filter(function (x) { return mx / x <= 4; })[0] || 1000, topv = Math.ceil(mx / st) * st;
    var W = 640, Ht = 120, padL = 30, bw = (W - padL) / 30, Y = function (v) { return v / topv * (Ht - 6); };
    var s = '<svg viewBox="0 0 ' + W + ' ' + (Ht + 20) + '" role="img" aria-label="Clicks per day">';
    for (var v = 0; v <= topv; v += st) { var y = Ht - Y(v); s += '<line class="gl" x1="' + padL + '" x2="' + W + '" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '"/><text class="ax" x="' + (padL - 6) + '" y="' + (y + 3.5).toFixed(1) + '" text-anchor="end">' + v + '</text>'; }
    per.forEach(function (x, i) { var X0 = padL + i * bw + bw * .15, w = bw * .7, h1 = Y(x[0]), h2 = Y(x[1]);
      if (h1) s += '<rect x="' + X0.toFixed(1) + '" y="' + (Ht - h1).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h1.toFixed(1) + '" fill="#2aa9a9" rx="1.5"/>';
      if (h2) s += '<rect x="' + X0.toFixed(1) + '" y="' + (Ht - h1 - h2).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + Math.max(0, h2 - 1).toFixed(1) + '" fill="#c08a12" rx="1.5"/>';
      s += '<rect class="hit" x="' + (padL + i * bw).toFixed(1) + '" y="0" width="' + bw.toFixed(1) + '" height="' + Ht + '" data-tip="' + days[i] + '|' + x[0] + ' buy clicks · ' + x[1] + ' code copies"/>'; });
    s += '<text class="ax" x="' + padL + '" y="' + (Ht + 15) + '">' + days[0].slice(5) + '</text><text class="ax" x="' + W + '" y="' + (Ht + 15) + '" text-anchor="end">today</text></svg>';
    var byFirm = {}, byAcct = {}; C.forEach(function (c) { if (c.day <= dd(30)) return; var f = firmOf(c.plan); byFirm[f] = byFirm[f] || [0, 0]; byFirm[f][c.t === 'b' ? 0 : 1] += c.n; if (c.t === 'b' && plan[c.plan]) { var k = c.plan + '|' + c.k; byAcct[k] = (byAcct[k] || 0) + c.n; } });
    var F = Object.keys(byFirm).map(function (f) { return [f, byFirm[f][0], byFirm[f][1]]; }).sort(function (a, b) { return b[1] + b[2] - a[1] - a[2]; }), fm = F.length ? F[0][1] + F[0][2] : 1;
    var A = Object.keys(byAcct).map(function (k) { return [k, byAcct[k]]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 8);
    h += '<div class="g2"><section class="panel"><div class="ph"><h2>Link clicks per day</h2><small>last 30 days</small></div><div class="legend" style="margin-bottom:6px"><span><i style="background:#2aa9a9"></i>Buy button</span><span><i style="background:#c08a12"></i>Code copied</span></div><div class="ch">' + s + '</div>' +
      '<h3>Most clicked accounts</h3>' + (A.length ? '<div class="bars">' + A.map(function (a) { var q = a[0].split('|'), p = plan[q[0]]; return '<div class="bar"><span class="lbl"><i style="width:' + (a[1] / A[0][1] * 100).toFixed(1) + '%"></i><em>' + esc(p.firm + ' · ' + p.plan + ' ' + q[1] + 'K') + '</em></span><span class="n">' + a[1] + '</span><span class="p"></span></div>'; }).join('') + '</div>' : '<p class="more">No clicks yet.</p>') + '</section>';
    h += '<section class="panel"><div class="ph"><h2>Clicks by firm</h2><small>last 30 days</small></div>' + (F.length ? F.map(function (f) { return '<div class="hb" data-tip="' + esc(f[0]) + '|' + f[1] + ' buy clicks · ' + f[2] + ' code copies"><span class="nm">' + esc(f[0]) + '</span><span class="tr"><i style="width:' + (f[1] / fm * 100).toFixed(1) + '%;background:#2aa9a9"></i><i style="left:' + (f[1] / fm * 100).toFixed(1) + '%;width:' + (f[2] / fm * 100).toFixed(1) + '%;background:#c08a12;border-radius:0 4px 4px 0"></i></span><b>' + (f[1] + f[2]) + '</b></div>'; }).join('') : '<p class="more">No clicks yet. They start counting once the new rules are in Firebase.</p>') + '</section></div>';
    // money
    var byM = {}; E.forEach(function (e) { var m = e.date.slice(0, 7); byM[m] = (byM[m] || 0) + e.usd; });
    var months = Object.keys(byM).sort().slice(-12), mm = Math.max.apply(null, months.map(function (m) { return byM[m]; }).concat([1]));
    var byF = {}; E.forEach(function (e) { byF[e.firm] = (byF[e.firm] || 0) + e.usd; });
    h += '<section class="panel"><div class="ph"><h2>Affiliate money</h2><small>add each payment you receive from a firm</small></div>' +
      '<form id="pdEarn" class="row" style="display:flex;flex-wrap:wrap;gap:8px;align-items:end;margin-bottom:12px">' +
      '<label style="display:grid;gap:4px;font-size:11px;color:var(--mute);text-transform:uppercase;letter-spacing:.06em">Date<input type="date" name="date" value="' + today + '" required style="background:var(--paper);color:var(--ink);border:1px solid var(--rule2);border-radius:4px;padding:8px"></label>' +
      '<label style="display:grid;gap:4px;font-size:11px;color:var(--mute);text-transform:uppercase;letter-spacing:.06em">Firm<select name="firm" required style="background:var(--paper);color:var(--ink);border:1px solid var(--rule2);border-radius:4px;padding:8px">' + Object.keys(P.firms).sort().map(function (f) { return '<option>' + esc(f) + '</option>'; }).join('') + '</select></label>' +
      '<label style="display:grid;gap:4px;font-size:11px;color:var(--mute);text-transform:uppercase;letter-spacing:.06em">Amount $<input type="number" name="usd" min="0" step="0.01" required style="width:110px;background:var(--paper);color:var(--ink);border:1px solid var(--rule2);border-radius:4px;padding:8px;font-family:var(--mono)"></label>' +
      '<label style="display:grid;gap:4px;font-size:11px;color:var(--mute);text-transform:uppercase;letter-spacing:.06em;flex:1;min-width:160px">Note<input name="note" maxlength="120" placeholder="e.g. October commission" style="background:var(--paper);color:var(--ink);border:1px solid var(--rule2);border-radius:4px;padding:8px"></label>' +
      '<button class="btn gold" type="submit">Add payment</button><span id="pdEarnMsg" class="dim" style="font-size:13px"></span></form>' +
      (MONEY.earn === null ? '<p class="more">Paste the new Firestore rules first (block "MMM prop clicks + money") to save payments.</p>' : '') +
      '<div class="g2"><div><h3>By month</h3>' + (months.length ? '<div style="display:flex;align-items:end;gap:6px;height:130px;border-bottom:1px solid var(--rule2)">' + months.map(function (m) { return '<div data-tip="' + m + '|' + money$(byM[m]) + '" style="flex:1;display:flex;flex-direction:column;justify-content:end;align-items:center;height:100%"><span style="font:11px var(--mono);color:var(--mute)">' + money$(Math.round(byM[m])) + '</span><i style="display:block;width:70%;max-width:46px;height:' + (byM[m] / mm * 100).toFixed(1) + '%;background:var(--gold);border-radius:4px 4px 0 0"></i></div>'; }).join('') + '</div><div style="display:flex;gap:6px">' + months.map(function (m) { return '<span style="flex:1;text-align:center;font:11px var(--mono);color:var(--faint)">' + m.slice(2) + '</span>'; }).join('') + '</div>' : '<p class="more">No payment added yet.</p>') +
      '</div><div><h3>By firm</h3>' + (Object.keys(byF).length ? '<div class="bars">' + Object.keys(byF).sort(function (a, b) { return byF[b] - byF[a]; }).map(function (f, i, arr) { return '<div class="bar"><span class="lbl"><i style="width:' + (byF[f] / byF[arr[0]] * 100).toFixed(1) + '%"></i><em>' + esc(f) + '</em></span><span class="n">' + money$(Math.round(byF[f])) + '</span><span class="p">' + Math.round(byF[f] / (mAll || 1) * 100) + '%</span></div>'; }).join('') + '</div>' : '<p class="more">—</p>') + '</div></div>' +
      (E.length ? '<details style="margin-top:10px"><summary style="cursor:pointer;color:var(--teal);font-size:13px">All payments (' + E.length + ')</summary><table style="min-width:0;margin-top:6px"><tbody>' + E.map(function (e) { return '<tr><td class="num">' + esc(e.date) + '</td><td>' + esc(e.firm) + '</td><td class="num" style="text-align:right">' + money$(e.usd) + '</td><td class="dim">' + esc(e.note) + '</td><td><button class="btn" type="button" data-del="' + esc(e.id) + '">Delete</button></td></tr>'; }).join('') + '</tbody></table></details>' : '') + '</section>';
    $('pdMoney').innerHTML = h;
    $('pdEarn').addEventListener('submit', function (ev) {
      ev.preventDefault(); var f = ev.target, msg = $('pdEarnMsg'), amt = +f.usd.value; if (!(amt >= 0)) return; msg.textContent = 'Saving…';
      tok().then(function (t) { return fetch(FS + '/propEarn?key=' + KEY, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t },
        body: JSON.stringify({ fields: { date: { stringValue: f.date.value }, firm: { stringValue: f.firm.value }, usd: { doubleValue: amt }, note: { stringValue: f.note.value.slice(0, 120) } } }) }); })
        .then(function (r) { if (!r.ok) throw new Error(r.status === 403 ? 'Not allowed: paste the new Firestore rules first.' : 'Could not save.'); msg.textContent = ''; loadMoney(); }).catch(function (e) { msg.textContent = e.message || 'Could not save.'; });
    });
    $('pdMoney').addEventListener('click', function (ev) { var b = ev.target.closest('[data-del]'); if (!b) return; if (b.textContent !== 'Sure?') { b.textContent = 'Sure?'; return; } b.disabled = true;
      tok().then(function (t) { return fetch(FS + '/propEarn/' + b.dataset.del + '?key=' + KEY, { method: 'DELETE', headers: { Authorization: 'Bearer ' + t } }); }).then(loadMoney); });
  }
  function money$(n) { return '$' + Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: n % 1 ? 2 : 0, minimumFractionDigits: n % 1 ? 2 : 0 }); }
})();
