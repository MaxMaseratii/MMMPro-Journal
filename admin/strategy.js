/* Admin · My strategy tab: the MMM H4 Plan, my personal day plan (final, Nov 16 2026).
   Pictures, rules and equity curves of the 5 setups. Static content: numbers come from the final test
   (NQ 1m 2023 – Nov 2025 + MNQ 1m 2026 to Nov 13, 1 MNQ, 1 pt cost a trade, one trade at a time, day rules on).
   Draws the first time the tab opens. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var D = {"setups":{"MMM.1":{"n":246.0,"wr":65.45,"avg":6.97,"pf":1.69,"t":3.62,"dd":309.0,"streak":4.0,"net":3429.5,"rr":0.89,"yr":{"2023":4.0,"2024":7.0,"2025":8.1,"2026":14.5}},"MMM.2":{"n":97.0,"wr":52.58,"avg":20.51,"pf":2.17,"t":2.83,"dd":228.5,"streak":9.0,"net":3978.5,"rr":1.96,"yr":{"2023":14.4,"2024":16.4,"2025":28.3,"2026":30.4}},"MMM.3":{"n":209.0,"wr":52.63,"avg":15.59,"pf":1.7,"t":3.44,"dd":360.25,"streak":6.0,"net":6518.5,"rr":1.53,"yr":{"2023":14.6,"2024":9.0,"2025":23.8,"2026":22.5}},"MMM.4":{"n":227.0,"wr":44.05,"avg":17.07,"pf":1.76,"t":3.86,"dd":328.0,"streak":8.0,"net":7749.5,"rr":2.23,"yr":{"2022":7.8,"2023":15.5,"2024":16.6,"2025":17.7,"2026":21.2}},"MMM.5":{"n":113.0,"wr":65.49,"avg":8.73,"pf":1.88,"t":3.35,"dd":126.0,"streak":4.0,"net":1974.0,"rr":0.99,"yr":{"2023":5.9,"2024":13.4,"2025":7.0,"2026":3.3}}},"plan":{"nq":{"n":812.0,"per_day":1.42,"wr":55.3,"pf":1.76,"t":6.68,"net":20674.5,"dd":883.5,"worst":-283.5,"green":83.33,"hit":0.17},"mnq":{"n":80.0,"per_day":1.45,"wr":58.75,"pf":1.98,"t":2.58,"net":2975.5,"dd":360.0,"worst":-203.0,"green":83.33,"hit":0.0},"all":{"n":892.0,"per_day":1.43,"wr":55.61,"pf":1.78,"t":7.17,"net":23650.0,"dd":883.5,"worst":-283.5,"green":83.33,"hit":0.17}}};
  var IMG = '/admin/strategy/';
  var money = function (x) { return (x < 0 ? '−$' : '$') + Math.abs(Math.round(x)).toLocaleString('en-US'); };
  var sg = function (x, d) { return (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(d == null ? 1 : d); };
  var SET = [
    { c: 'MMM.1', name: 'H4-2AM · 50 Sweep (Affinity)', st: 'Trade', win: '2AM–6AM NY', chart: 'H4 → M5', stop: 'Stop 75 · Target +30',
      rules: ['<b>Filter:</b> the pH4-10PM points your way (MMCB Align). Long: the 10PM H4 is a Bu candle. Short: a Be candle. Otherwise no trade today.',
              '<b>Side:</b> 2AM open above the pH4-10PM 50 = longs. Below the 50 = shorts.',
              '<b>Entry:</b> the first M5 candle that wicks through the 50 and closes back (BuAFs / BeAFs). Enter at its close. An M5 body close through the 50 first = no trade.',
              '<b>Stop 75 · Target +30.</b> Leave it alone: no break-even, no trail.',
              '<b>Out</b> at TP, SL or 6AM (the H4 close).'],
      note: 'One loss (−75) = about 2.5 wins (+30). It lives on its high win rate: follow it exactly.' },
    { c: 'MMM.2', name: 'H4-10AM · 50 Pullback + M30 Break (CBrk)', st: 'Trade', win: '10AM–2PM NY', chart: 'H4 → M30', stop: 'Stop past the break candle, trailed · no target',
      rules: ['<b>Filter:</b> the pH4-6AM points your way (MMCB Align). Long: the 6AM H4 is a Bu candle. Short: a Be candle.',
              '<b>Side:</b> 10AM open above the pH4-6AM 50 = longs. Below the 50 = shorts.',
              '<b>Wait</b> for the pullback to the 50 (P1). Don\'t trade the touch. An M30 body close through the 50 = no trade this H4.',
              '<b>Entry:</b> the first M30 candle that closes past the candle before it (CBrk = R1). Enter at that close.',
              '<b>Stop</b> past the break candle. Each new M30 close past the one before moves the stop past it. The stop is wide: size for it.',
              '<b>Out</b> at 2PM (the H4 close) or at the trailed stop.'],
      note: 'MMM.2 and MMM.3 share the 10AM H4: the first signal wins.' },
    { c: 'MMM.3', name: 'H4-10AM · Open ±30 Push (MC / MU)', st: 'Trade', win: '10AM–2PM NY', chart: 'H4 → M5', stop: 'Stop 50 · Target +100 (1:2)',
      rules: ['<b>Filter:</b> the pH4-6AM closed weak (MMCB Minus: BuBC−, BeBC−, BuAFs− or BeAFs−). Otherwise no trade.',
              '<b>Mark</b> the 10AM open ± 30 pts.',
              '<b>Side:</b> the first side to move 30 pts wins. Up 30 first = longs. Down 30 first = shorts.',
              '<b>Entry:</b> the first M5 candle that closes past the 30 line and past the candle before it. Enter at that close.',
              '<b>Stop 50 · Target +100.</b> Leave it alone: break-even, locks and trails all made it worse.',
              '<b>Out</b> at TP, SL or 2PM (the H4 close).'],
      note: 'ES does not confirm MMCB Minus. It is an NQ / MNQ setup.' },
    { c: 'MMM.4', name: 'London High Taken · 10:30 Range Break', st: 'Paper first', win: '10:30AM–12PM NY', chart: 'M5', stop: 'Stop 40 · Target +100 (1:2.5)',
      rules: ['<b>Filter:</b> price takes the London high (2:00–8:30AM) between 8:30 and 10:00. No take = no trade today. London LOW taken instead = skip.',
              '<b>Mark</b> the 10:00–10:30 high and low.',
              '<b>Entry:</b> the first M5 candle that closes past one of them AND past the M5 before it. Either side. Last entry 11:55.',
              '<b>Stop 40 · Target +100.</b>',
              '<b>Out</b> at TP, SL or 4PM.'],
      note: 'Paper-trade first: flat in TradingView 2026 (73 trades, avg +1.0 pts). MES does not confirm it.' },
    { c: 'MMM.5', name: 'Afternoon · High of Day Break', st: 'Paper first', win: '1:30PM–3PM NY', chart: 'M2', stop: 'Stop 30 · Target +30 · longs only',
      rules: ['<b>Mark</b> the high of day at 1:30PM: the highest price since 6PM the day before.',
              '<b>Entry:</b> the first M2 candle that closes above it AND above the M2 before it (BuBC). Enter at that close. Window 1:30–3:00PM.',
              '<b>Stop 30 · Target +30.</b> Leave it alone.',
              '<b>Longs only.</b> A break of the low of day does not work.',
              '<b>Out</b> at TP, SL or 4PM.'],
      note: 'Entries after 2PM are weaker. Paper-trade first.' }
  ];
  var PLAN = ['NY time. I trade <b>MNQ</b>. The day starts at 6PM.',
              '<b>One trade at a time.</b> While a trade is open, new signals are ignored.',
              '<b>Stop the day</b> after 2 wins or 2 losses. Max 3 trades a day.',
              '<b>Enter at the signal candle close.</b> Limit orders at the 50% or the open missed the best winners.',
              '<b>Fixed stop, fixed target.</b> No break-even, no trail (MMM.2 trails by design). No early exits.',
              '<b>Same candle, two setups:</b> the lower MMM number goes first (the same as the TradingView strategy).',
              '<b>Size</b> from the stop: the indicator gives the contracts for your $ risk. The test uses 1 MNQ and 1 pt cost a trade.'];
  var OUT = [['Limit entry at the candle 50% or open', 'whole plan $9,566 / $6,092 vs $20,523 at the close: it missed 207 winners'],
             ['1m break candle after the signal', '$15,570 vs $20,523'],
             ['Stop moved past the signal candle', 'about −2% on NQ and −19% on MNQ 2026: kept as a switch, off'],
             ['ATR volatility stop', 'ATR(M5)×1.5: $15,870 vs $20,522, and a bigger drawdown'],
             ['MMM Pro C bias filters and levels', '178 + 193 tests: no better than luck (only MMM.2 + M30 flip helped a little)'],
             ['MMPD premium / discount, background ride, 90 / 10, the +', '351 + 92 tests and 21 exit versions: no better than luck, or worse'],
             ['MES', 'no edge: PF 0.95 in TradingView']];
  var CSS = '#stx{display:grid;gap:22px}#stx h2{font-family:var(--serif);font-weight:600;font-size:26px;margin:0}#stx h3{font:600 12px var(--sans);letter-spacing:.08em;text-transform:uppercase;color:var(--mute);margin:0 0 10px}' +
    '#stx .lead{color:#c9d3d8;font-size:15px;line-height:1.6;margin:6px 0 0;max-width:90ch}#stx .kpis{margin-top:14px}' +
    '#stx .pic{display:block;border:1px solid var(--rule2);background:#fff;border-radius:4px;overflow:hidden}#stx .pic img{display:block;width:100%;height:auto}' +
    '#stx .two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}@media (max-width:1100px){#stx .two{grid-template-columns:minmax(0,1fr)}}' +
    '#stx ol,#stx ul{margin:0;padding-left:22px;line-height:1.65;color:#d7e0e4;font-size:14.5px}#stx li{margin:2px 0}#stx b{color:var(--ink)}' +
    '#stx .set{border:1px solid var(--rule);background:var(--sheet);padding:20px 22px;display:grid;gap:16px}' +
    '#stx .meta{display:flex;flex-wrap:wrap;gap:8px;align-items:center;color:var(--mute);font-size:13.5px}' +
    '#stx .chip{font:600 11px/1 var(--mono);padding:5px 7px;border-radius:3px;border:1px solid var(--rule2);color:var(--mute)}' +
    '#stx .chip.trade{color:#111;background:var(--win);border-color:var(--win)}#stx .chip.paper{color:#111;background:var(--amber);border-color:var(--amber)}' +
    '#stx .note{color:var(--amber);font-size:13.5px;margin:0}#stx table{width:100%;border-collapse:collapse;font-size:13.5px}' +
    '#stx td,#stx th{padding:8px;border-bottom:1px solid var(--rule);text-align:left;vertical-align:top}#stx th{font:600 11px var(--sans);letter-spacing:.06em;text-transform:uppercase;color:var(--mute);background:var(--sheet2)}' +
    '#stx .tw{overflow-x:auto}#stx .num{text-align:right;white-space:nowrap}#stx .small{color:var(--faint);font-size:12.5px;line-height:1.5}' +
    '#stx nav.jump{display:flex;flex-wrap:wrap;gap:6px}#stx nav.jump a{font:600 12.5px var(--sans);color:var(--ink);text-decoration:none;border:1px solid var(--rule2);padding:7px 10px;border-radius:4px}#stx nav.jump a:hover{border-color:var(--gold);color:var(--gold)}';
  function pic(f, alt) { return '<a class="pic" href="' + IMG + f + '" target="_blank" rel="noopener"><img src="' + IMG + f + '" alt="' + alt + '" loading="lazy" decoding="async"></a>'; }
  function kpi(v, a, b) { return '<div class="kpi"><b>' + v + '</b><span>' + a + (b ? '<br><small>' + b + '</small>' : '') + '</span></div>'; }
  function draw() {
    var A = D.plan.all, N = D.plan.nq, M = D.plan.mnq, h = '<style>' + CSS + '</style>';
    h += '<div><h2>MMM Personal Strategy · the H4 Plan</h2><p class="lead">My own day plan: 5 setups at fixed times, fixed stops and fixed targets. Tested on NQ 1-minute data from Jan 2023 to Nov 2025, then checked on MNQ 2026 (to Nov 13). TradingView\'s Strategy Tester gave the same trades (97% within 1 pt).</p>';
    h += '<div class="kpis">' + kpi(money(A.net), 'Net, 1 MNQ', 'whole test') + kpi(A.n, 'Trades', A.per_day.toFixed(1) + ' a day') + kpi(A.wr.toFixed(0) + '%', 'WR (win rate)') +
         kpi(A.pf.toFixed(2), 'PF (profit factor)') + kpi(A.t.toFixed(1), 't-score', '3+ = very likely real') + kpi(money(A.dd), 'Max drawdown', 'worst day ' + money(A.worst)) +
         kpi(A.green.toFixed(0) + '%', 'Green months') + kpi(money(M.net), 'MNQ 2026 check', M.n + ' trades · PF ' + M.pf.toFixed(2)) + '</div></div>';
    h += '<nav class="jump" aria-label="Jump to">' + ['plan', 'mix', 'time', 'size', 'MMM.1', 'MMM.2', 'MMM.3', 'MMM.4', 'MMM.5', 'out', 'pine'].map(function (k) {
      return '<a href="#st-' + k.replace('.', '') + '">' + ({ plan: 'The plan', mix: 'Every mix', time: 'When to trade', size: 'Account size', out: 'Tested and left out', pine: 'Pine scripts' }[k] || k) + '</a>'; }).join('') + '</nav>';
    h += '<section id="st-plan" class="set"><h3>The plan · one page</h3>' + pic('MMM_Personal_Strategy.png', 'MMM Personal Strategy one-page plan') +
         '<div class="two"><div><h3>Plan rules</h3><ol>' + PLAN.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol></div>' +
         '<div><h3>Results by period · 1 MNQ</h3><div class="tw"><table><thead><tr><th>Period</th><th class="num">Trades</th><th class="num">WR</th><th class="num">PF</th><th class="num">t-score</th><th class="num">Net</th><th class="num">Max DD</th></tr></thead><tbody>' +
         [['NQ 2023 – Nov 2025', N], ['MNQ 2026 (to Nov 13)', M], ['Whole test', A]].map(function (r) { var s = r[1];
           return '<tr><td>' + r[0] + '</td><td class="num">' + s.n + '</td><td class="num">' + s.wr.toFixed(0) + '%</td><td class="num">' + s.pf.toFixed(2) + '</td><td class="num">' + s.t.toFixed(1) + '</td><td class="num">' + money(s.net) + '</td><td class="num">' + money(s.dd) + '</td></tr>'; }).join('') +
         '</tbody></table></div><p class="small">2026 = only the days with 1-minute data. −$2,000 drawdown touched in ' + A.hit.toFixed(2) + '% of 4,000 reshuffles of the same trades.</p></div></div>' +
         '<h3>Equity curve · all 5 setups</h3>' + pic('MMM_Plan_Equity.png', 'MMM H4 Plan equity curve') + '</section>';
    h += '<section id="st-mix" class="set"><h3>Every mix · each setup alone, together, and all 5</h3><p class="lead" style="margin:0"><b>All 5 makes the most money</b> ($23,650, max drop $884 on 1 MNQ). Adding any setup to a mix adds money. <b>MMM.2 + 3 + 4 + 5</b> (no London) has the smallest drop for its money ($20,439, drop $655): use it on days you skip the 2AM session.</p>' + pic('MMM_Mix_Curves.png', 'Equity of every mix') + pic('MMM_All_Mixes.png', 'All 31 mixes ranked') + '</section>';
    h += '<section id="st-time" class="set"><h3>When to be in front of the market</h3><div class="two"><div><ol><li><b>London:</b> sit down 1:55AM NY (6:55AM UK) for MMM.1. Done at the trade exit or 6AM NY (11AM UK).</li><li><b>NY AM:</b> sit down 9:55AM NY (2:55PM UK) for MMM.2, MMM.3 and MMM.4. Done at the trade exit; MMM.4 can run to 4PM NY (9PM UK).</li><li><b>NY PM:</b> sit down 1:25PM NY (6:25PM UK) for MMM.5. Done at the trade exit or 4PM NY (9PM UK).</li><li>UK = NY + 5 hours most of the year (+4 for about 3 weeks in March and 1 week around early November).</li></ol><p class="note" style="margin-top:10px">A trade happens on 75% of days, 1.4 trades on those days. Average time in a trade: about 1 h 30 min (MMM.5 about 45 min).</p></div><div class="tw"><table><thead><tr><th>Setup</th><th>Entries NY</th><th>Entries UK</th><th class="num">Signal days</th><th class="num">Avg entry</th><th class="num">Avg in trade</th></tr></thead><tbody><tr><td><b>MMM.1</b></td><td>2:00–6:00AM</td><td>7:00–11:00AM</td><td class="num">30%</td><td class="num">2:51AM NY</td><td class="num">106 min</td></tr><tr><td><b>MMM.2</b></td><td>10:00AM–2:00PM</td><td>3:00–7:00PM</td><td class="num">15%</td><td class="num">11:28AM NY</td><td class="num">102 min</td></tr><tr><td><b>MMM.3</b></td><td>10:00AM–2:00PM</td><td>3:00–7:00PM</td><td class="num">26%</td><td class="num">10:34AM NY</td><td class="num">94 min</td></tr><tr><td><b>MMM.4</b></td><td>10:30AM–12:00PM</td><td>3:30–5:00PM</td><td class="num">35%</td><td class="num">10:53AM NY</td><td class="num">102 min</td></tr><tr><td><b>MMM.5</b></td><td>1:30–3:00PM</td><td>6:30–8:00PM</td><td class="num">21%</td><td class="num">2:00PM NY</td><td class="num">45 min</td></tr></tbody></table></div></div>' + pic('MMM_Screen_Time.png', 'When to be in front of the market') + '</section>';
    h += '<section id="st-size" class="set"><h3>Prop account size · starting today</h3><p class="lead" style="margin:0"><b>Start with a 50K-type account ($2,000 drawdown) and 1 MNQ.</b> The worst drop in the test was $884 (44% of the limit); 3,000 reshuffles of the same trades touch −$2,000 only 0.3% of the time. A 100K-type ($3,000) still allows only 1 MNQ by the 2× rule. Next step: a 150K-type ($4,500) with 2 MNQ. Option: size from the stop with $150 risk a trade on the $2,000 account.</p><p style="margin:10px 0 0"><button class="btn gold" type="button" onclick="window.MMMPick && window.MMMPick(\'size\')">Open the Prop Safe Size calculator</button></p>' + pic('MMM_Prop_Size.png', 'Prop account size for the MMM H4 Plan') + '</section>';
    SET.forEach(function (s) {
      var k = D.setups[s.c], id = s.c.replace('.', ''), yrs = Object.keys(k.yr).filter(function (y) { return +y >= 2023; });
      h += '<section id="st-' + id + '" class="set"><div><h2>' + s.c + ' · ' + s.name + '</h2><div class="meta" style="margin-top:8px"><span class="chip ' + (s.st === 'Trade' ? 'trade' : 'paper') + '">' + s.st.toUpperCase() + '</span>' +
           '<span>' + s.win + '</span><span>·</span><span>Chart ' + s.chart + '</span><span>·</span><span>' + s.stop + '</span></div></div>' +
           '<div class="two"><div><h3>Rules</h3><ol>' + s.rules.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>' + (s.note ? '<p class="note" style="margin-top:10px">' + s.note + '</p>' : '') + '</div>' +
           '<div><h3>Results · inside the plan · 1 MNQ</h3><div class="kpis" style="margin-top:0">' + kpi(k.n, 'Trades') + kpi(k.wr.toFixed(0) + '%', 'WR (win rate)') + kpi(sg(k.avg), 'avg pts a trade') +
           kpi(k.rr.toFixed(2), 'avg RR', 'avg win ÷ avg loss') + kpi(k.pf.toFixed(2), 'PF (profit factor)') + kpi(k.t.toFixed(1), 't-score') + kpi(money(k.net), 'Net') + kpi(money(k.dd * 2), 'Max drawdown', k.streak + ' losses in a row max') + '</div>' +
           '<p class="small" style="margin-top:8px">avg pts by year: ' + yrs.map(function (y) { return y + ' ' + sg(k.yr[y]); }).join(' · ') + '</p></div></div>' +
           pic(s.c.replace('.', '_') + '_Rules.png', s.c + ' rules and a real trade') + pic(s.c.replace('.', '_') + '_Curve.png', s.c + ' equity curve') + '</section>';
    });
    h += '<section id="st-out" class="set"><h3>Tested and left out · the fixed plan beat them</h3><div class="tw"><table><thead><tr><th>Idea</th><th>What the test said</th></tr></thead><tbody>' +
         OUT.map(function (r) { return '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td></tr>'; }).join('') + '</tbody></table></div></section>';
    h += '<section id="st-pine" class="set"><h3>Pine scripts (TradingView)</h3><ul>' +
         '<li><b>MMM H4 Plan @MaxMaserati</b> (indicator): the 5 setups, the day rules, live alerts, stop / target tags and the stats table.</li>' +
         '<li><b>MMM H4 Plan Strategy @MaxMaserati</b> (strategy): the same logic for the Strategy Tester. 1 contract, $1 a contract commission, bar magnifier on. Style tab → untick "Trades on chart" for a clean chart.</li>' +
         '<li>Keep <b>"Stop Never Inside The Signal Candle"</b> off: the test says it costs money.</li>' +
         '<li>MMM.4 and MMM.5 are marked paper in the indicator until they prove themselves live.</li></ul>' +
         '<p class="small" style="margin-top:10px">The code is not stored on this site (the site\'s files are public). Keep the .pine files in TradingView and your own files.</p></section>';
    h += '<p class="small">Tested results, not real money. 1 MNQ = $2 a point. Stop wins when the stop and target are hit in the same 1-minute candle. Past results do not promise future results.</p>';
    $('stx').innerHTML = h;
  }
  var done = false;
  window.MMMStrategy = function () { if (!done) { done = true; draw(); } };
})();
