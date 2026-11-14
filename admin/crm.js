/* Admin · Whop and CRM tabs. Draws from the Marketing Hub data file (dashboard-analytics-CRM/data.json),
   which Mini Max refreshes every morning. Nothing here writes anywhere. */
(function () {
  'use strict';
  var URL_DATA = 'https://maxmaseratii.github.io/dashboard-analytics-CRM/data.json';
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var num = function (n, d) { return n == null || isNaN(n) ? '—' : Number(n).toLocaleString('en-US', { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: d || 0 }); };
  var usd = function (n) { return n == null ? '—' : '$' + num(n, n % 1 ? 2 : 0); };
  var DAY = 864e5, C = { teal: '#2aa9a9', amber: '#c08a12', violet: '#8f6fe0', gold: '#e0ad1a', up: '#4fd39a', dn: '#f2736a' };
  var CH = { YouTube: C.teal, X: C.amber, Facebook: C.violet };
  var P = null, loading = null, drawn = {};
  var CSS = [
    '.cx{display:grid;gap:16px}',
    '.cx .top{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;justify-content:space-between;font-size:13px;color:var(--mute)}',
    '.cx .top a{color:var(--mute)}.cx .top a:hover{color:var(--teal)}',
    '.cx .kpis{margin-top:0}',
    '.cx .g2{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:16px}.cx .g2e{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}',
    '@media (max-width:1050px){.cx .g2,.cx .g2e{grid-template-columns:minmax(0,1fr)}}',
    '.pill{display:inline-block;font:600 11px/1 var(--sans);padding:4px 7px;border-radius:999px;white-space:nowrap;vertical-align:middle}',
    '.pill.ok{color:#4fd39a;background:rgba(79,211,154,.12)}.pill.warn{color:#f0b341;background:rgba(240,179,65,.13)}.pill.bad{color:#f2736a;background:rgba(242,115,106,.13)}.pill.neu{color:var(--mute);background:#18222a}',
    '.todo{list-style:none;margin:0;padding:0}.todo li{display:grid;grid-template-columns:auto minmax(0,1fr);gap:4px 10px;padding:9px 0;border-bottom:1px solid var(--rule);font-size:13.5px;line-height:1.45}',
    '.todo li:last-child{border-bottom:0}.todo b{color:var(--ink);font-weight:600}.todo .t{grid-column:2;color:#c3cdd2}',
    '.clamp{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;cursor:pointer}.clamp.open{-webkit-line-clamp:unset;display:block}',
    '.tg{display:grid;gap:12px}.tg .r{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:5px 10px;font-size:13px;align-items:center}',
    '.tg .tr{grid-column:1/-1;position:relative;height:10px;background:var(--sheet2);border-radius:5px}',
    '.tg .tr i{position:absolute;inset:0 auto 0 0;border-radius:5px}.tg .tr u{position:absolute;top:-4px;bottom:-4px;width:2px;background:#e8eef1;opacity:.75}',
    '.tg small{color:var(--mute)}',
    '.cx table.t{width:100%;border-collapse:collapse;font-size:13px}.cx table.t th{text-align:left;font:600 11px var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--mute);padding:8px;border-bottom:1px solid var(--rule2);background:var(--sheet2)}',
    '.cx table.t td{padding:8px;border-bottom:1px solid var(--rule);vertical-align:top}.cx table.t td.n{text-align:right;font-family:var(--mono);white-space:nowrap}',
    '.cx .tw{overflow-x:auto}',
    '.cx details.box{border:1px solid var(--rule);background:var(--sheet);border-radius:0}.cx details.box>summary{cursor:pointer;padding:14px 18px;display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center;list-style:none}',
    '.cx details.box>summary::-webkit-details-marker{display:none}.cx details.box>summary::before{content:"▸";color:var(--mute);transition:transform .15s}.cx details.box[open]>summary::before{transform:rotate(90deg)}',
    '.cx details.box>summary h2{font-family:var(--serif);font-size:18px;font-weight:600;margin:0}.cx details.box>summary small{color:var(--mute);font-size:12.5px}',
    '.cx details.box>.in{padding:0 18px 16px}',
    '.rep{border-top:1px solid var(--rule)}.rep>summary{cursor:pointer;display:grid;grid-template-columns:150px auto minmax(0,1fr);gap:10px;align-items:center;padding:10px 0;list-style:none;font-size:13.5px}',
    '.rep>summary::-webkit-details-marker{display:none}.rep>summary span.w{color:#c3cdd2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rep[open]>summary span.w{white-space:normal}',
    '.rep .in{padding:0 0 14px;display:grid;gap:10px;font-size:13.5px;line-height:1.55;color:#c3cdd2}.rep .in h4{margin:0 0 2px;font:600 11px var(--sans);letter-spacing:.07em;text-transform:uppercase;color:var(--mute)}',
    '.rep .in ul{margin:0;padding-left:18px}',
    '.ins{border:1px solid rgba(224,173,26,.4);background:linear-gradient(120deg,rgba(224,173,26,.08),transparent 70%);padding:14px 18px;display:grid;grid-template-columns:auto minmax(0,1fr);gap:4px 16px;align-items:center}',
    '.ins b.big{font:700 34px/1 var(--mono);color:var(--gold)}.ins p{margin:0;font-size:14px;line-height:1.5;color:#d3dbdf}.ins p small{color:var(--mute)}',
    '.lc{display:grid;grid-template-columns:96px minmax(0,1fr) 90px;gap:8px;align-items:center;font-size:13px;padding:5px 0;border-bottom:1px solid var(--rule)}',
    '.lc .nm{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.lc .dv{position:relative;height:14px}.lc .dv:before{content:"";position:absolute;left:50%;top:-3px;bottom:-3px;width:1px;background:var(--rule2)}',
    '.lc .dv i{position:absolute;top:0;height:14px}.lc .n{text-align:right;font-family:var(--mono)}',
    '.chips2{display:flex;gap:6px;flex-wrap:wrap}'
  ].join('');

  function load() {
    if (P) return Promise.resolve(P);
    if (!loading) {
      var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
      loading = fetch(URL_DATA + '?v=' + Math.floor(Date.now() / 300000)).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) { P = j; return j; });
    }
    return loading;
  }
  window.MMMCrm = function (tab) {
    var el = $(tab === 'whop' ? 'wx' : 'cx'); if (!el || drawn[tab]) return;
    el.innerHTML = '<p class="more">Loading…</p>';
    load().then(function (d) { drawn[tab] = true; el.innerHTML = ''; (tab === 'whop' ? whop : crm)(el, d); })
      .catch(function () { el.innerHTML = '<p class="more">Could not load the Marketing Hub data. Reload the page.</p>'; loading = null; });
  };

  /* ---------- helpers ---------- */
  var tone = function (t) { t = String(t || '').toLowerCase(); return /danger|bad|behind|cancel/.test(t) ? 'bad' : /warn|watch|needs|win back|awaiting/.test(t) ? 'warn' : /success|good|ok|ahead|on track|approved|sent/.test(t) ? 'ok' : 'neu'; };
  var pill = function (txt, t) { return '<span class="pill ' + (t || tone(txt)) + '">' + esc(txt) + '</span>'; };
  function kpis(K) { return '<div class="kpis">' + K.map(function (k) { return '<div class="kpi"' + (k[3] ? ' style="box-shadow:inset 3px 0 0 ' + k[3] + '"' : '') + '><b>' + k[0] + '</b><span>' + esc(k[1]) + '<br><small>' + esc(k[2] || '') + '</small></span></div>'; }).join('') + '</div>'; }
  function mrr(d) { var t = ((d.daily_reports || [])[0] || {}).whop || ''; var m = /MRR\s*\$?([\d,]+\.?\d*)/i.exec(t) || /MRR\s*\$?([\d,]+\.?\d*)/i.exec(((d.weekly_reviews || [])[0] || {}).whop || ''); return m ? +m[1].replace(/,/g, '') : null; }
  function pipe(d, re) { var r = (d.pipeline || []).filter(function (x) { return re.test(x[0]); })[0]; return r ? r : null; }
  function sb(d, re) { return ((d.scoreboard || {}).rows || []).filter(function (r) { return re.test(r.label); })[0]; }
  function card(d, re) { return (d.cards || []).filter(function (c) { return re.test(c.label); })[0]; }
  function top(d, el) {
    var L = d.links || {};
    return '<div class="top"><span>Updated <b style="color:var(--ink)">' + esc(d.updated || '') + '</b> · data read ' + esc(d.data_as_of || '') + '</span><span class="chips2">' +
      (L.whop ? '<a class="btn" href="' + esc(L.whop) + '" target="_blank" rel="noopener">Whop store ↗</a>' : '') + (L.x ? '<a class="btn" href="' + esc(L.x) + '" target="_blank" rel="noopener">X ↗</a>' : '') +
      '<a class="btn" href="https://maxmaseratii.github.io/dashboard-analytics-CRM/#crm" target="_blank" rel="noopener">Old dashboard ↗</a></span></div>';
  }
  function targets(rows) {
    return '<div class="tg">' + rows.map(function (r) {
      var nums = (String(r.target).replace(/,/g, '').match(/\d+(\.\d+)?/g) || []).map(Number), tgt = nums.length ? Math.max.apply(null, nums) : null, a = r.actual, pr = r.prorated;
      var scale = Math.max(tgt || 0, a || 0, pr || 0, 1), fw = Math.max(0, Math.min(100, (a || 0) / scale * 100)), pw = Math.min(100, (pr || 0) / scale * 100);
      var u = r.unit === '$' ? usd : r.unit === '%' ? function (v) { return num(v) + '%'; } : function (v) { return num(v, v % 1 ? 1 : 0); };
      var col = /behind/i.test(r.status) ? C.dn : /ahead/i.test(r.status) ? C.up : C.teal;
      return '<div class="r" data-tip="' + esc(r.label) + '|' + esc(u(a)) + ' now · ' + esc(u(pr)) + ' expected by today · target ' + esc(r.target) + '"><span>' + esc(r.label) + ' ' + pill(r.status) + '</span><span><b class="num">' + u(a) + '</b> <small>/ ' + esc(r.target) + '</small></span>' +
        '<span class="tr"><i style="width:' + fw.toFixed(1) + '%;background:' + col + '"></i><u style="left:' + pw.toFixed(1) + '%"></u></span></div>';
    }).join('') + '</div><p class="more">Bar = where you are. White line = where you should be by today for this month\'s target.</p>';
  }
  function repList(list, kind) {
    return list.map(function (r, i) {
      var head = kind === 'week' ? r.headline : r.verdict_why, label = kind === 'week' ? r.label : r.label.replace(/ \(London\)/, ''), v = kind === 'week' ? 'Week' : r.verdict;
      var li = function (a) { return Array.isArray(a) ? '<ul>' + a.map(function (x) { return '<li>' + esc(typeof x === 'string' ? x : JSON.stringify(x)) + '</li>'; }).join('') + '</ul>' : '<div>' + esc(a) + '</div>'; };
      var body = kind === 'week'
        ? [['Best', r.best], ['Worst', r.worst], ['Whop', r.whop], ['What worked', r.worked], ['What did not work', r.did_not_work], ['Next week', r.next_week && (r.next_week.goals || r.next_week)], ['Source', r.source]]
        : [['Best', r.best], ['Worst', r.worst], ['Whop', r.whop], ['Followers', r.followers], ['Learned', r.learned], ['Suggestions', r.suggestions], ['Source', r.source]];
      return '<details class="rep"' + (i === 0 && kind === 'week' ? '' : '') + '><summary><b>' + esc(label) + '</b>' + pill(v, kind === 'week' ? 'neu' : (r.tone === 'bad' ? 'bad' : r.tone === 'good' ? 'ok' : 'warn')) + '<span class="w">' + esc(head) + '</span></summary><div class="in">' +
        body.filter(function (b) { return b[1]; }).map(function (b) { return '<div><h4>' + b[0] + '</h4>' + (typeof b[1] === 'string' ? esc(b[1]) : li(b[1])) + '</div>'; }).join('') + '</div></details>';
    }).join('');
  }
  function ticks(mx) { var st = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000, 10000]; var s = st.filter(function (x) { return mx / x <= 4; })[0] || Math.ceil(mx / 4); var o = []; for (var v = 0; v <= Math.max(s, Math.ceil(mx / s) * s); v += s) o.push(v); return o; }
  var dshort = function (s) { return new Date(s + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); };

  /* ---------- Whop visits with indicator launches ---------- */
  function visitsChart(d, days) {
    var H0 = (d.visits_history || d.visits || []).slice(), tv = d.tradingview || {}, L = tv.launches || [];
    if (!H0.length) return '<p class="more">No visit data yet.</p>';
    var last = H0[H0.length - 1].date, start = days ? new Date(Date.parse(last + 'T12:00:00Z') - (days - 1) * DAY).toISOString().slice(0, 10) : H0[0].date;
    var H = H0.filter(function (x) { return x.date >= start; }), n = H.length, idx = {}; H.forEach(function (x, i) { idx[x.date] = i; });
    var W = 1000, Ht = 190, padL = 34, T = ticks(Math.max(1, Math.max.apply(null, H.map(function (x) { return x.v; })))), topv = T[T.length - 1], bw = (W - padL) / n;
    var X = function (i) { return padL + (i + .5) * bw; }, Y = function (v) { return Ht - v / topv * (Ht - 8); };
    var s = '<svg viewBox="0 0 ' + W + ' ' + (Ht + 22) + '" role="img" aria-label="Whop store visits per day with indicator launches">';
    T.forEach(function (v) { s += '<line class="gl" x1="' + padL + '" x2="' + W + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '"/><text class="ax" x="' + (padL - 6) + '" y="' + (Y(v) + 3.5).toFixed(1) + '" text-anchor="end">' + v + '</text>'; });
    var Ls = L.filter(function (l) { return idx[l.date] != null; });
    Ls.forEach(function (l) { var x = X(idx[l.date]); s += '<line x1="' + x.toFixed(1) + '" x2="' + x.toFixed(1) + '" y1="6" y2="' + Ht + '" stroke="' + C.gold + '" stroke-width="1.5" stroke-dasharray="3 3" opacity=".75"/>'; });
    var pts = H.map(function (x, i) { return X(i).toFixed(1) + ',' + Y(x.v).toFixed(1); });
    s += '<polygon points="' + X(0).toFixed(1) + ',' + Ht + ' ' + pts.join(' ') + ' ' + X(n - 1).toFixed(1) + ',' + Ht + '" fill="' + C.teal + '" opacity=".14"/>';
    s += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + C.teal + '" stroke-width="1.6" stroke-linejoin="round"/>';
    var avg = H.map(function (x, i) { var a = H.slice(Math.max(0, i - 6), i + 1); return X(i).toFixed(1) + ',' + Y(a.reduce(function (p, q) { return p + q.v; }, 0) / a.length).toFixed(1); });
    s += '<polyline points="' + avg.join(' ') + '" fill="none" stroke="#e8eef1" stroke-width="2" stroke-linejoin="round" opacity=".85"/>';
    Ls.forEach(function (l) { var x = X(idx[l.date]); s += '<path d="M' + x.toFixed(1) + ',0l6,6l-6,6l-6,-6z" fill="' + C.gold + '"/>'; });
    H.forEach(function (x, i) { var a = H.slice(Math.max(0, i - 6), i + 1), m = a.reduce(function (p, q) { return p + q.v; }, 0) / a.length; s += '<rect class="hit" x="' + (padL + i * bw).toFixed(1) + '" y="14" width="' + bw.toFixed(2) + '" height="' + (Ht - 14) + '" data-tip="' + dshort(x.date) + '|' + x.v + ' store visits · 7-day avg ' + m.toFixed(1) + '"/>'; });
    Ls.forEach(function (l) { var x = X(idx[l.date]); s += '<rect class="hit" x="' + (x - 8).toFixed(1) + '" y="0" width="16" height="16" data-tip="Indicator launch ' + dshort(l.date) + '|' + esc((l.names || []).join(' · ')) + '"/>'; });
    var nl = Math.min(6, n); for (var k = 0; k < nl; k++) { var i = Math.round(k * (n - 1) / (nl - 1)); s += '<text class="ax" x="' + X(i).toFixed(1) + '" y="' + (Ht + 16) + '" text-anchor="' + (k === 0 ? 'start' : k === nl - 1 ? 'end' : 'middle') + '">' + dshort(H[i].date) + '</text>'; }
    return s + '<line x1="' + padL + '" x2="' + W + '" y1="' + Ht + '" y2="' + Ht + '" stroke="var(--rule2)"/></svg>';
  }
  function launches(d) {
    var R = ((d.tradingview || {}).compare || []).filter(function (r) { return r.change_pct != null; }).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var mx = Math.max.apply(null, R.map(function (r) { return Math.abs(r.change_pct); }).concat([50]));
    return R.map(function (r) { var w = Math.abs(r.change_pct) / mx * 50, up = r.change_pct >= 0;
      return '<div class="lc" data-tip="' + esc(r.label) + '|' + num(r.before_avg, 1) + ' visits a day before → ' + num(r.after_avg, 1) + ' after (' + (up ? '+' : '') + r.change_pct + '%)"><span class="num" style="color:var(--mute)">' + dshort(r.date) + '</span><span><span class="nm" style="display:block">' + esc(r.label) + ' <small style="color:var(--faint)">' + esc((r.access || []).join(', ')) + '</small></span>' +
        '<span class="dv" style="display:block;margin-top:4px"><i style="' + (up ? 'left:50%' : 'right:50%') + ';width:' + w.toFixed(1) + '%;background:' + (up ? C.up : C.dn) + ';border-radius:' + (up ? '0 3px 3px 0' : '3px 0 0 3px') + '"></i></span></span><span class="n" style="color:' + (up ? C.up : C.dn) + '">' + (up ? '+' : '') + r.change_pct + '%</span></div>'; }).join('');
  }

  /* ---------- WHOP TAB ---------- */
  function whop(el, d) {
    var rev = d.revenue || {}, tw = rev.this_week || {}, lw = rev.last_week || {}, m = mrr(d), paid = pipe(d, /^Paid active/i), tr = pipe(d, /^New trials/i), t2p = sb(d, /Trial to paid/i), vis = sb(d, /Whop page visits/i);
    var S = (d.tradingview || {}).summary || {};
    var h = top(d) + kpis([
      [m != null ? usd(m) : '—', 'Monthly recurring revenue', 'from the last Whop read', C.gold],
      [paid ? esc(paid[1]) : '—', 'Paid members', 'active on Whop'],
      [usd(tw.usd), 'Revenue ' + (tw.label || 'this week'), (rev.change || '') + ' vs ' + usd(lw.usd) + ' (' + (lw.label || 'last week') + ')'],
      [vis ? num(vis.actual) : '—', 'Store visits this month', vis ? 'target ' + vis.target + ' · expected ' + num(vis.prorated) + ' by today' : ''],
      [tr ? esc(tr[1]) : '—', 'New trials', tr ? tr[0].replace(/^New trials\s*/i, '').replace(/[()]/g, '') : ''],
      [rev.not_collected ? usd(rev.not_collected) : '$0', 'Not collected', (rev.failed || []).length + ' failed payments listed', rev.not_collected ? C.dn : '']
    ]);
    if (S.launch_days) h += '<div class="ins"><b class="big">+' + S.launch_median_change_pct + '%</b><p><b>Indicator launches bring visitors.</b> In the week after you publish a TradingView indicator, Whop store visits rise by a median of <b>' + S.launch_median_change_pct + '%</b> (up after ' + S.launch_days_up + ' of ' + S.launch_days + ' launches). On normal weeks they move <b>' + S.baseline_median_change_pct + '%</b>. <small>Gold diamonds on the chart = launch days. Sales per day are not in the data yet, so this shows visits only.</small></p></div>';
    h += '<section class="panel"><div class="ph"><h2>Whop store visits</h2><span class="seg" id="wRng"><button type="button" data-d="30">30 days</button><button type="button" data-d="90" aria-pressed="true">90 days</button><button type="button" data-d="180">6 months</button><button type="button" data-d="0">All</button></span></div>' +
      '<div class="legend" style="margin-bottom:6px"><span><i style="background:' + C.teal + '"></i>Visits per day</span><span><i style="background:#e8eef1;height:2px"></i>7-day average</span><span><i style="background:' + C.gold + ';transform:rotate(45deg)"></i>Indicator published</span></div><div class="ch" id="wVis"></div></section>';
    h += '<div class="g2e"><section class="panel"><div class="ph"><h2>Visits after each launch</h2><small>7 days after vs 7 days before</small></div><div style="max-height:420px;overflow:auto">' + launches(d) + '</div></section>';
    h += '<section class="panel"><div class="ph"><h2>Members pipeline</h2><small>since 1 Nov</small></div><table class="t"><tbody>' + (d.pipeline || []).map(function (r) {
      return '<tr><td><b>' + esc(r[0]) + '</b><div class="clamp" style="color:var(--mute);font-size:12.5px;margin-top:2px">' + esc(r[2]) + '</div></td><td class="n" style="font-size:18px">' + esc(r[1]) + '</td></tr>'; }).join('') + '</tbody></table></section></div>';
    var wr = ((d.scoreboard || {}).rows || []);
    h += '<div class="g2e"><section class="panel"><div class="ph"><h2>This month\'s targets</h2><small>' + esc((d.scoreboard || {}).window || '') + ' · day ' + esc((d.scoreboard || {}).day || '') + ' of ' + esc((d.scoreboard || {}).days || '') + '</small></div>' + targets(wr) + '</section>';
    h += '<section class="panel"><div class="ph"><h2>Members to act on</h2></div><ul class="todo">' + (d.watchlist || []).map(function (w) { return '<li>' + pill(w[2], w[3] === 'danger' ? 'bad' : w[3] === 'warning' ? 'warn' : 'neu') + '<b>' + esc(w[0]) + '</b><span class="t clamp">' + esc(w[1]) + '</span></li>'; }).join('') +
      (rev.failed || []).map(function (f) { return '<li>' + pill('Failed ' + usd(f.usd), 'bad') + '<b>' + esc(f.product) + ' · ' + dshort(f.date) + '</b><span class="t clamp">' + esc(f.reason) + '</span></li>'; }).join('') + '</ul></section></div>';
    var geo = (d.geo || {}).groups || [], buyers = geo.filter(function (g) { return g.key === 'buyers'; })[0], srcs = ((d.tradingview || {}).sources || []).filter(function (s) { return s.visits != null; });
    h += '<div class="g2e">' + (buyers ? '<section class="panel"><div class="ph"><h2>Where buyers come from</h2><small>' + esc(buyers.total) + ' buyers · ' + esc(buyers.range || '') + '</small></div><div class="bars">' + barsHtml(buyers.countries.map(function (c) { return [c.name, c.people]; }), buyers.total, 10) + '</div></section>' : '') +
      '<section class="panel"><div class="ph"><h2>Tagged visit sources</h2><small>tracked links only</small></div>' + (srcs.length ? '<div class="bars">' + barsHtml(srcs.map(function (s) { return [s.name, s.visits]; }), srcs.reduce(function (a, s) { return a + s.visits; }, 0), 8) + '</div>' : '<p class="more">No tagged visits yet.</p>') +
      '<p class="more">' + esc((d.scoreboard || {}).channel_note || '') + '</p></section></div>';
    el.innerHTML = '<div class="cx">' + h + '</div>';
    var draw = function (n) { $('wVis').innerHTML = visitsChart(d, n); };
    draw(90);
    $('wRng').addEventListener('click', function (e) { var b = e.target.closest('button[data-d]'); if (!b) return; [].forEach.call($('wRng').children, function (x) { x.setAttribute('aria-pressed', x === b); }); draw(+b.dataset.d); });
    clampWire(el);
  }
  function barsHtml(pairs, total, max) {
    pairs = pairs.slice().sort(function (a, b) { return b[1] - a[1]; }); var t = pairs.slice(0, max), big = t.length ? t[0][1] : 1;
    return t.map(function (p) { return '<div class="bar" data-tip="' + esc(p[0]) + '|' + p[1] + ' · ' + Math.round(p[1] / (total || 1) * 100) + '%"><span class="lbl"><i style="width:' + (p[1] / big * 100).toFixed(1) + '%"></i><em>' + esc(p[0]) + '</em></span><span class="n">' + p[1] + '</span><span class="p">' + Math.round(p[1] / (total || 1) * 100) + '%</span></div>'; }).join('');
  }
  function clampWire(el) { el.addEventListener('click', function (e) { var c = e.target.closest('.clamp'); if (c) c.classList.toggle('open'); }); }

  /* ---------- posts chart ---------- */
  function postsChart(posts) {
    var R = posts.filter(function (p) { return /publish/i.test(p.status); }).slice(-30);
    if (!R.length) return '<p class="more">No published posts yet.</p>';
    var tot = function (p) { return (p.yt_views || 0) + (p.x_impr || 0) + (p.fb_impr || 0); };
    var W = 1000, Ht = 170, padL = 40, T = ticks(Math.max(1, Math.max.apply(null, R.map(tot)))), topv = T[T.length - 1], bw = (W - padL) / R.length, Y = function (v) { return v / topv * (Ht - 8); };
    var s = '<svg viewBox="0 0 ' + W + ' ' + (Ht + 22) + '" role="img" aria-label="Reach per post">';
    T.forEach(function (v) { var y = Ht - Y(v); s += '<line class="gl" x1="' + padL + '" x2="' + W + '" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '"/><text class="ax" x="' + (padL - 6) + '" y="' + (y + 3.5).toFixed(1) + '" text-anchor="end">' + num(v) + '</text>'; });
    R.forEach(function (p, i) { var x = padL + i * bw + bw * .15, w = bw * .7, y = Ht;
      [['yt_views', C.teal], ['x_impr', C.amber], ['fb_impr', C.violet]].forEach(function (k) { var h = Y(p[k[0]] || 0); if (h > 0) { s += '<rect x="' + x.toFixed(1) + '" y="' + (y - h + (y < Ht ? 1 : 0)).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + Math.max(0, h - (y < Ht ? 1 : 0)).toFixed(1) + '" fill="' + k[1] + '" rx="1.5"/>'; y -= h; } });
      s += '<rect class="hit" x="' + (padL + i * bw).toFixed(1) + '" y="0" width="' + bw.toFixed(1) + '" height="' + Ht + '" data-tip="' + esc(p.when + ' · ' + p.title) + '|' + num(tot(p)) + ' reach · YouTube ' + num(p.yt_views || 0) + ' · X ' + num(p.x_impr || 0) + ' · Facebook ' + num(p.fb_impr || 0) + ' · ' + (p.likes || 0) + ' likes"/>'; });
    s += '<text class="ax" x="' + padL + '" y="' + (Ht + 16) + '">' + esc(R[0].when.replace(/^\w+ /, '').replace(/ \d\d:\d\d$/, '')) + '</text><text class="ax" x="' + W + '" y="' + (Ht + 16) + '" text-anchor="end">' + esc(R[R.length - 1].when.replace(/^\w+ /, '').replace(/ \d\d:\d\d$/, '')) + '</text>';
    return s + '<line x1="' + padL + '" x2="' + W + '" y1="' + Ht + '" y2="' + Ht + '" stroke="var(--rule2)"/></svg>';
  }

  /* ---------- MAIN CRM TAB ---------- */
  function crm(el, d) {
    var rev = d.revenue || {}, tw = rev.this_week || {}, lw = rev.last_week || {}, m = mrr(d), paid = pipe(d, /^Paid active/i), reach = card(d, /^Reach/i), fol = card(d, /^Followers/i), vis = sb(d, /Whop page visits/i), best = card(d, /^Best post/i);
    var h = top(d) + kpis([
      [usd(tw.usd), 'Revenue ' + (tw.label || 'this week'), (rev.change || '') + ' vs last week', C.gold],
      [m != null ? usd(m) : '—', 'Monthly recurring revenue', (paid ? paid[1] : '—') + ' paid members'],
      [reach ? num(+reach.value) : '—', 'Social reach (last 7 days)', reach ? reach.sub : ''],
      [vis ? num(vis.actual) : '—', 'Whop visits this month', vis ? 'target ' + vis.target : ''],
      [fol ? esc(fol.value) : '—', 'Followers', fol ? fol.sub : ''],
      [rev.not_collected ? usd(rev.not_collected) : '$0', 'Money at risk', 'failed or late payments', rev.not_collected ? C.dn : '']
    ]);
    // needs you
    var todo = [];
    (d.approvals || []).forEach(function (a) { if (!/sent|approved|done|live/i.test(a[2])) todo.push([a[2], a[0], a[1], a[3]]); });
    (d.watchlist || []).forEach(function (w) { if (w[3] === 'danger') todo.push([w[2], w[0], w[1], w[3]]); });
    ((d.batch || {}).notes || []).forEach(function (n) { if (/needs/i.test(n[2])) todo.push([n[2], n[0], n[1], n[3]]); });
    h += '<div class="g2"><section class="panel"><div class="ph"><h2>Needs you</h2><small>' + todo.length + ' items · tap a line to read all</small></div><ul class="todo">' +
      todo.map(function (t) { return '<li>' + pill(t[0], t[3] === 'danger' ? 'bad' : t[3] === 'warning' ? 'warn' : tone(t[0])) + '<b>' + esc(t[1]) + '</b><span class="t clamp">' + esc(t[2]) + '</span></li>'; }).join('') + '</ul>' +
      ((d.next_moves || []).length ? '<h3>Next moves</h3><ul class="todo">' + d.next_moves.map(function (n, i) { return '<li><span class="pill neu">' + (i + 1) + '</span><span class="clamp">' + esc(n) + '</span></li>'; }).join('') + '</ul>' : '') + '</section>';
    h += '<section class="panel"><div class="ph"><h2>Targets this month</h2><small>day ' + esc((d.scoreboard || {}).day || '') + ' of ' + esc((d.scoreboard || {}).days || '') + '</small></div>' + targets((d.scoreboard || {}).rows || []) + '</section></div>';
    // content
    var chs = d.channels || [], tot = chs.reduce(function (a, c) { return a + (c.value || 0); }, 0), e = d.engagement || {};
    h += '<section class="panel"><div class="ph"><h2>Content reach, last 30 posts</h2><small>' + (best ? 'Best: ' + esc(best.value) + ' · ' + esc(best.sub) : '') + '</small></div>' +
      '<div class="legend" style="margin-bottom:6px">' + chs.map(function (c) { return '<span><i style="background:' + (CH[c.name] || '#5f6e77') + '"></i>' + esc(c.name) + ' <b>' + num(c.value) + '</b> ' + esc(c.meta) + ' (' + Math.round(c.value / (tot || 1) * 100) + '%)</span>'; }).join('') +
      '<span>· ' + num(e.likes) + ' likes · ' + num(e.comments) + ' comments · ' + num(e.clicks) + ' link clicks</span></div><div class="ch">' + postsChart(d.posts || []) + '</div>' +
      '<details style="margin-top:10px"><summary style="cursor:pointer;color:var(--teal);font-size:13px">See every post as a table</summary><div class="tw" style="margin-top:8px"><table class="t"><thead><tr><th>When</th><th>Post</th><th>Status</th><th style="text-align:right">YouTube</th><th style="text-align:right">X</th><th style="text-align:right">Facebook</th><th style="text-align:right">Likes</th></tr></thead><tbody>' +
      (d.posts || []).slice().reverse().map(function (p) { var lk = function (u, t) { return u ? '<a href="' + esc(u) + '" target="_blank" rel="noopener">' + t + '</a>' : ''; };
        return '<tr><td class="n" style="text-align:left">' + esc(p.when) + '</td><td>' + esc(p.title) + ' <span style="font-size:12px">' + [lk(p.youtube, 'YT'), lk(p.x, 'X'), lk(p.facebook, 'FB')].filter(Boolean).join(' · ') + '</span></td><td>' + pill(p.status, /publish/i.test(p.status) ? 'ok' : 'neu') + '</td><td class="n">' + num(p.yt_views) + '</td><td class="n">' + num(p.x_impr) + '</td><td class="n">' + num(p.fb_impr) + '</td><td class="n">' + num(p.likes) + '</td></tr>'; }).join('') +
      '</tbody></table></div></details></section>';
    // plan
    var b = d.batch || {};
    if ((b.rows || []).length) h += '<details class="box"><summary><h2>Content plan</h2>' + pill(b.status && /await/i.test(b.status) ? 'Awaiting approval' : 'Plan', /await/i.test(b.status || '') ? 'warn' : 'neu') + '<small>' + b.rows.length + ' posts · ' + esc(b.status || '') + '</small></summary><div class="in"><p style="margin:0 0 10px;color:#c3cdd2;font-size:13.5px;line-height:1.5">' + esc(b.goals || '') + '</p><div class="tw"><table class="t"><thead><tr><th>Day</th><th>Time</th><th>Type</th><th>Post</th><th>Where</th></tr></thead><tbody>' +
      b.rows.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td class="n" style="text-align:left">' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td><td>' + esc(r[3]) + '</td><td>' + esc(r[4]) + '</td></tr>'; }).join('') + '</tbody></table></div></div></details>';
    // reports
    h += '<details class="box"><summary><h2>Daily reports</h2><small>' + (d.daily_reports || []).length + ' days · tap a day to open it</small></summary><div class="in">' + repList(d.daily_reports || [], 'day') + '</div></details>';
    h += '<details class="box"><summary><h2>Weekly reviews</h2><small>' + (d.weekly_reviews || []).length + ' reviews</small></summary><div class="in">' + repList(d.weekly_reviews || [], 'week') + '</div></details>';
    // geo
    var geo = (d.geo || {}).groups || [];
    if (geo.length) h += '<details class="box"><summary><h2>Audience by country</h2><small>' + geo.map(function (g) { return esc(g.label.replace(/ \(.*\)/, '')) + (g.total != null ? ' ' + g.total : ''); }).join(' · ') + '</small></summary><div class="in"><div class="g2e">' +
      geo.filter(function (g) { return g.countries && g.countries.length; }).map(function (g) { var t = g.total || g.countries.reduce(function (a, c) { return a + c.people; }, 0); return '<div><h3>' + esc(g.label) + '</h3><div class="bars">' + barsHtml(g.countries.map(function (c) { return [c.name, c.people]; }), t, 8) + '</div></div>'; }).join('') + '</div></div></details>';
    var bt = d.backtest;
    if (bt && bt.rows) h += '<details class="box"><summary><h2>Study claims check</h2><small>' + esc(bt.caption || '') + '</small></summary><div class="in"><table class="t"><thead><tr><th>Claim</th><th>Study</th><th>Recomputed</th><th></th></tr></thead><tbody>' + bt.rows.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td class="n">' + esc(r[1]) + '</td><td class="n">' + esc(r[2]) + '</td><td>' + pill(r[3], /confirm/i.test(r[3]) ? 'ok' : 'warn') + '</td></tr>'; }).join('') + '</tbody></table><p class="more">' + esc(bt.note || '') + '</p></div></details>';
    h += '<p class="note" style="margin:0 0 30px">' + esc(d.footer || '') + '</p>';
    el.innerHTML = '<div class="cx">' + h + '</div>';
    clampWire(el);
  }
})();
