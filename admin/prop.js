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
  var drawn = false;

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
    $('pd').innerHTML = h;

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
})();
