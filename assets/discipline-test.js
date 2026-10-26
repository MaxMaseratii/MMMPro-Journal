/* MMM Discipline Test - the prop-firm failure check that runs right on the home page.
 * Three short steps: your account (drawdown, risk), your numbers (target RR, WR, real avg win / loss, trades),
 * your habits (9 real-life situations). The result shows on the same page: the math of your edge
 * (avg RR, PF, break-even WR, t-score, execution gap, risk of ruin, chance to reach the payout) and where your
 * discipline leaks, with a fix plan. Nothing is sent anywhere. Mount: <div id="dt-root"></div>.
 */
(function () {
  'use strict';
  var root = document.getElementById('dt-root');
  if (!root) return;

  /* ---------------- styles (scoped to .dt) ---------------- */
  var css = document.createElement('style');
  css.textContent = [
    '.dt{--g:hsl(45,100%,55%);--g2:hsl(45,100%,65%);--t:hsl(180,70%,55%);--t2:hsl(180,80%,65%);--ink:#eef2f3;--mu:#9aa6ab;--fa:#64727a;--ln:rgba(255,255,255,.10);--ln2:rgba(255,255,255,.18);--pn:#0f1416;--pn2:#141b1e;--ok:#4fd39a;--wa:#f0b341;--bad:#f2736a;color:var(--ink)}',
    '.dt *{box-sizing:border-box}',
    '.dt .card{background:var(--pn);border:1px solid var(--ln);border-radius:16px;overflow:hidden}',
    '.dt .steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-bottom:1px solid var(--ln)}',
    '.dt .steps button{all:unset;cursor:pointer;padding:14px 16px;font:600 13px/1.25 Inter,system-ui,sans-serif;color:var(--mu);border-left:1px solid var(--ln);display:flex;gap:10px;align-items:center;min-width:0}',
    '.dt .steps button:first-child{border-left:0}',
    '.dt .steps button i{font-style:normal;font:700 12px/1 "JetBrains Mono",monospace;width:24px;height:24px;border-radius:50%;border:1px solid var(--ln2);display:inline-flex;align-items:center;justify-content:center;flex:none}',
    '.dt .steps button[aria-current="step"]{color:var(--ink);background:var(--pn2);box-shadow:inset 0 -2px 0 var(--g)}',
    '.dt .steps button[aria-current="step"] i{border-color:var(--g);color:var(--g)}',
    '.dt .steps button.done i{background:var(--t);border-color:var(--t);color:#04211f}',
    '.dt .steps button:disabled{cursor:not-allowed;opacity:.45}',
    '.dt .steps button:focus-visible{outline:2px solid var(--g);outline-offset:-2px}',
    '.dt .body{padding:26px 28px 28px}',
    '.dt h3{font:800 22px/1.2 Inter,system-ui,sans-serif;margin:0 0 6px;letter-spacing:-.01em}',
    '.dt .lead{color:var(--mu);font-size:15px;line-height:1.55;margin:0 0 22px;max-width:70ch}',
    '.dt .grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px 28px}',
    '.dt .f{display:flex;flex-direction:column;gap:8px;min-width:0}',
    '.dt .f>span{font-weight:600;font-size:14px}',
    '.dt .f small{color:var(--mu);font-size:12.5px;line-height:1.45}',
    '.dt .seg{display:flex;flex-wrap:wrap;gap:6px}',
    '.dt .seg button{all:unset;cursor:pointer;border:1px solid var(--ln2);border-radius:10px;padding:9px 12px;font:600 13px/1.2 Inter,system-ui,sans-serif;color:#d5dde0}',
    '.dt .seg button[aria-pressed="true"]{background:hsla(45,100%,55%,.14);border-color:var(--g);color:var(--g2)}',
    '.dt .seg button:focus-visible{outline:2px solid var(--g);outline-offset:2px}',
    '.dt .num{display:flex;align-items:center;gap:8px}',
    '.dt .num input[type=number]{width:140px;background:#0a0d0e;border:1px solid var(--ln2);border-radius:10px;padding:10px 12px;color:var(--ink);font:600 15px/1 "JetBrains Mono",monospace;outline:none}',
    '.dt .num input[type=number]:focus{border-color:var(--t)}',
    '.dt .num em{font-style:normal;color:var(--mu);font-size:13px}',
    '.dt input[type=range]{width:100%;accent-color:hsl(45,100%,55%)}',
    '.dt .calc{font:500 13px/1.4 "JetBrains Mono",monospace;color:var(--t2)}',
    '.dt .row{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-top:26px;padding-top:18px;border-top:1px solid var(--ln)}',
    '.dt .btn{all:unset;cursor:pointer;font:800 15px/1 Inter,system-ui,sans-serif;padding:14px 22px;border-radius:12px;color:#000;background:linear-gradient(90deg,var(--g),var(--g2));text-align:center}',
    '.dt .btn:hover{filter:brightness(1.06)} .dt .btn:focus-visible{outline:2px solid #fff;outline-offset:2px}',
    '.dt .ghost{all:unset;cursor:pointer;font:700 14px/1 Inter,system-ui,sans-serif;padding:12px 16px;border-radius:12px;border:1px solid var(--ln2);color:#d5dde0}',
    '.dt .ghost:hover{border-color:var(--mu)} .dt .ghost:focus-visible{outline:2px solid var(--g);outline-offset:2px}',
    '.dt .link{color:var(--t2);font-weight:600;text-underline-offset:3px}',
    '.dt .skip{display:flex;align-items:center;gap:10px;color:var(--mu);font-size:14px;margin:0 0 18px}',
    '.dt .skip input{accent-color:hsl(180,70%,55%);width:18px;height:18px}',
    '.dt .q{border-top:1px solid var(--ln);padding:18px 0}',
    '.dt .q:first-of-type{border-top:0;padding-top:0}',
    '.dt .q p{margin:0 0 10px;font-weight:600;font-size:15px;line-height:1.45}',
    '.dt .q p b{color:var(--mu);font:700 12px/1 "JetBrains Mono",monospace;margin-right:8px}',
    '.dt .opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}',
    '.dt .opts button{all:unset;cursor:pointer;border:1px solid var(--ln2);border-radius:10px;padding:11px 13px;font:500 14px/1.4 Inter,system-ui,sans-serif;color:#d5dde0}',
    '.dt .opts button:hover{border-color:var(--mu)}',
    '.dt .opts button[aria-pressed="true"]{background:hsla(180,70%,55%,.12);border-color:var(--t);color:#fff}',
    '.dt .opts button:focus-visible{outline:2px solid var(--g);outline-offset:2px}',
    '.dt .need{color:var(--wa);font-size:13.5px}',
    /* result */
    '.dt .hero{display:grid;grid-template-columns:auto minmax(0,1fr);gap:26px;align-items:center;padding-bottom:22px;border-bottom:1px solid var(--ln)}',
    '.dt .dial{width:132px;height:132px;position:relative}',
    '.dt .dial svg{width:100%;height:100%;transform:rotate(-90deg)}',
    '.dt .dial b{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;font:800 34px/1 "JetBrains Mono",monospace}',
    '.dt .dial b small{font:600 11px/1.2 Inter,sans-serif;color:var(--mu);margin-top:6px}',
    '.dt .arch{font:800 24px/1.15 Inter,system-ui,sans-serif;margin:0 0 6px}',
    '.dt .sub{color:var(--mu);font-size:15px;line-height:1.55;margin:0;max-width:68ch}',
    '.dt .pill{display:inline-block;font:700 12px/1 Inter,sans-serif;padding:6px 9px;border-radius:999px;margin:0 6px 8px 0}',
    '.dt .pill.ok{background:rgba(79,211,154,.13);color:var(--ok)} .dt .pill.wa{background:rgba(240,179,65,.13);color:var(--wa)} .dt .pill.bad{background:rgba(242,115,106,.13);color:var(--bad)}',
    '.dt h4{font:800 17px/1.2 Inter,system-ui,sans-serif;margin:24px 0 12px}',
    '.dt .kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid var(--ln);border-left:1px solid var(--ln)}',
    '.dt .kpi{padding:12px 14px;border-right:1px solid var(--ln);border-bottom:1px solid var(--ln);min-width:0}',
    '.dt .kpi dt{font-size:12.5px;color:var(--mu);margin:0 0 6px}',
    '.dt .kpi dd{margin:0;font:700 20px/1.1 "JetBrains Mono",monospace}',
    '.dt .kpi dd.ok{color:var(--ok)} .dt .kpi dd.wa{color:var(--wa)} .dt .kpi dd.bad{color:var(--bad)}',
    '.dt .kpi p{margin:6px 0 0;font-size:12px;line-height:1.4;color:var(--fa)}',
    '.dt .leaks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 28px}',
    '.dt .lk{display:grid;grid-template-columns:150px minmax(0,1fr) 44px;gap:10px;align-items:center;font-size:14px}',
    '.dt .lk .bar{height:8px;background:rgba(255,255,255,.07);border-radius:99px;overflow:hidden}',
    '.dt .lk .bar i{display:block;height:100%;border-radius:99px}',
    '.dt .lk em{font-style:normal;font:600 13px/1 "JetBrains Mono",monospace;text-align:right;color:var(--mu)}',
    '.dt ol.fix{margin:0;padding:0;list-style:none;counter-reset:f}',
    '.dt ol.fix li{counter-increment:f;display:grid;grid-template-columns:30px minmax(0,1fr);gap:10px;padding:13px 0;border-top:1px solid var(--ln);font-size:15px;line-height:1.55}',
    '.dt ol.fix li::before{content:counter(f);font:800 14px/1 "JetBrains Mono",monospace;color:var(--g);padding-top:3px}',
    '.dt ol.fix li b{color:#fff}',
    '.dt ol.fix li span{color:#c8d1d5}',
    '.dt .note{color:var(--fa);font-size:12.5px;line-height:1.5;margin:16px 0 0}',
    '.dt .mailbox{margin-top:24px;padding:16px 18px;border:1px solid hsla(180,70%,55%,.35);background:hsla(180,70%,55%,.06);border-radius:12px;font-size:14.5px;line-height:1.5}',
    '.dt .mailbox span{color:#c8d1d5}',
    '.dt .mailbox label{display:block;margin-bottom:10px}',
    '.dt .mailbox .mrow{display:flex;gap:8px;flex-wrap:wrap}',
    '.dt .mailbox input[type=email]{flex:1 1 220px;min-width:0;background:#0a0d0e;border:1px solid var(--ln2);border-radius:10px;padding:12px 14px;color:var(--ink);font:500 15px/1 Inter,system-ui,sans-serif;outline:none}',
    '.dt .mailbox input[type=email]:focus{border-color:var(--t)}',
    '.dt .mailbox .acct{margin:12px 0 0;display:flex;gap:8px;align-items:center;flex-wrap:wrap}',
    '.dt .mailbox .acct .ghost{padding:9px 12px;font-size:13px}',
    '@media (max-width:860px){.dt .grid2,.dt .opts,.dt .leaks{grid-template-columns:1fr}.dt .kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.dt .steps button span{display:none}.dt .steps button{justify-content:center}.dt .hero{grid-template-columns:1fr;justify-items:start}}',
    '@media (max-width:520px){.dt .body{padding:20px 16px}.dt .lk{grid-template-columns:110px minmax(0,1fr) 40px}}'
  ].join('\n');
  document.head.appendChild(css);

  /* ---------------- the questions ---------------- */
  // categories: risk, revenge, fomo, cut (cutting winners), news, over (overtrading), cons (consistency), plan (process)
  var CAT = {
    risk: ['Stops and size', 'Use a hard stop on every trade and never move it further away. Size from your drawdown, never from how sure you feel.'],
    revenge: ['Revenge trading', 'After 2 losses, the day is over. After any loss, wait for the next full setup: no faster entry, no bigger size.'],
    fomo: ['Chasing (FOMO)', 'If price left without you, the trade is gone. Write the entry before the move; no market orders after a big candle.'],
    cut: ['Cutting winners', 'Let the target or your exit rule close the trade. Take partials only by a written rule (for example ½ at +1R).'],
    news: ['News and firm rules', 'Be flat 5 minutes before red-folder news (CPI, NFP, FOMC). Read your firm’s rules once a week.'],
    over: ['Overtrading', 'Set a max number of trades a day (for example 3) and only trade your session. Zero trades is a good day too.'],
    cons: ['Consistency rule', 'Cap your daily profit so no single day is more than 30% of your total. Spread the target over many days.'],
    plan: ['Plan and journal', 'Write the plan before the open and journal every trade, even the no-trade days.']
  };
  var Q = [
    { t: 'You just took a full loss on a good setup. What do you do next?', o: [
      ['Wait for the next full setup, same size', {}], ['Jump back in fast to win it back', { revenge: 3 }],
      ['Double the size on the next trade', { revenge: 2, risk: 3 }], ['Stop for the day after 2 losses', {}]] },
    { t: 'A big move starts and you are not in. What do you do?', o: [
      ['Let it go and wait for a pullback setup', {}], ['Buy or sell at market so I don’t miss it', { fomo: 3 }],
      ['Drop to a 1m chart to find a quick entry', { fomo: 2, over: 1 }], ['Set an alert at my level and wait', {}]] },
    { t: 'Your stop is about to be hit. What do you do?', o: [
      ['Nothing: the stop is the stop', {}], ['Move it a bit further to give it room', { risk: 3 }],
      ['I use a mental stop, not a real one', { risk: 3, plan: 1 }], ['Close a little early to lose less', { cut: 1 }]] },
    { t: 'You are close to your payout target. How do you trade?', o: [
      ['Same plan, same size, same exits', {}], ['I close winners early to protect the profit', { cut: 3 }],
      ['I go bigger to finish faster', { risk: 2, cons: 1 }], ['I stop trading until the payout is done', { cut: 1 }]] },
    { t: 'CPI, NFP or FOMC is in 5 minutes and you are in a trade.', o: [
      ['I close it or I was flat before', {}], ['I hold it: news can push it to target', { news: 3 }],
      ['I open a new trade on the spike', { news: 3, fomo: 1 }], ['I don’t check the news calendar', { news: 2, plan: 2 }]] },
    { t: 'How many trades do you take on a normal day?', o: [
      ['Only my setups, some days zero', {}], ['More when the market is slow and I am bored', { over: 3 }],
      ['I trade until I make my daily goal', { over: 2, revenge: 2 }], ['I don’t count them', { over: 2, plan: 1 }]] },
    { t: 'Your best day is what part of your total profit?', o: [
      ['Under 30%', {}], ['30% to 50%', { cons: 2 }], ['Over 50%: one big day carried me', { cons: 3 }], ['I don’t know', { cons: 1, plan: 1 }]] },
    { t: 'Before the session, do you write a plan and journal after?', o: [
      ['Every day: plan before, journal after', {}], ['Sometimes', { plan: 2 }], ['Never, I trade what I see', { plan: 3 }], ['Only after a bad day', { plan: 2 }]] },
    { t: 'A trade is at +2R and starts to pull back. What do you do?', o: [
      ['Follow my rule: stop to break-even or partials', {}], ['Close it all right away', { cut: 2 }],
      ['Let it ride, even back to a loss', { risk: 1, cut: 0, plan: 1 }], ['Add more to it', { risk: 2, fomo: 1 }]], trailing: true }
  ];

  /* ---------------- state ---------------- */
  var S = { step: 0, dd: 2000, dtype: 'fixed', target$: 3000, rmode: 'trades', rval: 10, tpd: 3,
            known: true, rr: 2, wr: 45, aw: 1.6, al: 1, n: 40, ans: {} };
  try { var saved = JSON.parse(localStorage.getItem('mmm-dt') || 'null'); if (saved && typeof saved === 'object') { for (var k in saved) if (k in S) S[k] = saved[k]; S.step = 0; } } catch (e) {}
  function save() { try { localStorage.setItem('mmm-dt', JSON.stringify(S)); } catch (e) {} }

  function clamp(v, a, b) { v = +v; if (isNaN(v)) return a; return Math.min(b, Math.max(a, v)); }
  function usd(v) { return (v < 0 ? '−$' : '$') + Math.abs(Math.round(v)).toLocaleString('en-US'); }
  function sg(v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(2); }
  function riskUsd() {
    if (S.rmode === 'usd') return clamp(S.rval, 1, S.dd);
    if (S.rmode === 'pct') return S.dd * clamp(S.rval, 1, 100) / 100;
    return S.dd / clamp(S.rval, 1, 100);
  }
  function questions() { return Q.filter(function (q) { return !q.trailing || S.dtype === 'trailing'; }); }

  /* ---------------- views ---------------- */
  var STEPS = ['Your account', 'Your numbers', 'Your habits', 'Your result'];
  function head() {
    var allAns = questions().every(function (q, i) { return S.ans[Q.indexOf(q)] !== undefined; });
    return '<nav class="steps" aria-label="Test steps">' + STEPS.map(function (s, i) {
      var dis = i === 3 && !allAns;
      return '<button type="button" data-step="' + i + '"' + (S.step === i ? ' aria-current="step"' : '') + (i < S.step ? ' class="done"' : '') + (dis ? ' disabled' : '') + '><i>' + (i + 1) + '</i><span>' + s + '</span></button>';
    }).join('') + '</nav>';
  }
  function seg(name, opts, cur) {
    return '<div class="seg" role="group">' + opts.map(function (o) { return '<button type="button" data-set="' + name + '" data-v="' + o[0] + '" aria-pressed="' + (String(cur) === String(o[0])) + '">' + o[1] + '</button>'; }).join('') + '</div>';
  }
  function numIn(name, v, min, max, step, unit) {
    return '<div class="num"><input type="number" data-in="' + name + '" value="' + v + '" min="' + min + '" max="' + max + '" step="' + (step || 1) + '" inputmode="decimal" aria-label="' + name + '"><em>' + (unit || '') + '</em></div>';
  }
  function step0() {
    var r = riskUsd();
    var rlab = S.rmode === 'usd' ? ['Risk per trade', '$ per trade', 1, S.dd] : S.rmode === 'pct' ? ['Risk per trade', '% of the drawdown', 1, 100] : ['Losing trades in a row before the account is gone', 'losing trades', 1, 100];
    return '<h3>Your account</h3><p class="lead">Prop firms rarely fail you for a bad strategy. They fail you for breaking a drawdown rule. Start with the money you can really lose.</p>' +
      '<div class="grid2">' +
      '<label class="f"><span>Drawdown type</span>' + seg('dtype', [['fixed', 'Fixed (balance / end of day)'], ['trailing', 'Trailing (moves up with profit)']], S.dtype) +
        '<small>' + (S.dtype === 'trailing' ? 'Trailing: the floor climbs with your best equity, so giving back open profit can breach it.' : 'Fixed: the floor stays put. One bad day is the danger.') + '</small></label>' +
      '<label class="f"><span>Max drawdown: the money you can lose</span>' + numIn('dd', S.dd, 100, 250000, 50, '$100 – $250,000') +
        '<input type="range" data-in="ddr" min="0" max="1000" value="' + Math.round(Math.log(S.dd / 100) / Math.log(2500) * 1000) + '" aria-label="Max drawdown slider"></label>' +
      '<label class="f"><span>Profit target before your payout</span>' + numIn('target$', S.target$, 100, 500000, 50, '$') + '<small>The profit you need before the firm pays you.</small></label>' +
      '<div class="f"><span>How you size each trade</span>' + seg('rmode', [['trades', 'By losing trades'], ['usd', 'By $ amount'], ['pct', 'By %']], S.rmode) +
        '<label class="f" style="margin-top:6px"><small>' + rlab[0] + '</small>' + numIn('rval', S.rval, rlab[2], rlab[3], 1, rlab[1]) + '</label>' +
        '<div class="calc">= ' + usd(r) + ' risk a trade, ' + (S.dd / r).toFixed(1) + ' full losses to lose the whole drawdown</div></div>' +
      '<label class="f"><span>Trades on a normal day</span>' + numIn('tpd', S.tpd, 1, 50, 1, 'a day') + '</label>' +
      '</div><div class="row"><span class="note" style="margin:0">Nothing leaves your browser.</span><button type="button" class="btn" data-go="1">Next: your numbers</button></div>';
  }
  function step1() {
    var dis = S.known ? '' : ' style="opacity:.4;pointer-events:none" aria-hidden="true"';
    return '<h3>Your numbers</h3><p class="lead">Win rate alone means nothing. A 90% win rate can blow an account; a 30% win rate can get paid. Put in what your journal really says.</p>' +
      '<label class="skip"><input type="checkbox" data-in="unknown"' + (S.known ? '' : ' checked') + '> I don’t track my numbers yet (the test will use your habits only)</label>' +
      '<div class="grid2"' + dis + '>' +
      '<label class="f"><span>Strategy target</span>' + numIn('rr', S.rr, 1, 100, 0.1, 'R (1:' + S.rr + ')') + '<small>The reward your plan aims for, 1 to 100. It is not your average.</small></label>' +
      '<label class="f"><span>Win rate</span>' + numIn('wr', S.wr, 1, 99, 1, '% of trades win') + '</label>' +
      '<label class="f"><span>Your real average win</span>' + numIn('aw', S.aw, 0.05, 100, 0.05, 'R') + '<small>What you actually bank on a winner, in risk units (1 R = your risk). Lower than the target means you exit early.</small></label>' +
      '<label class="f"><span>Your real average loss</span>' + numIn('al', S.al, 0.05, 10, 0.05, 'R') + '<small>1.0 = your stop. Above 1 means you move stops or slip.</small></label>' +
      '<label class="f"><span>Trades these numbers come from</span>' + numIn('n', S.n, 1, 100000, 1, 'trades') + '<small>Fewer than 30 trades can be luck.</small></label>' +
      '</div><div class="row"><button type="button" class="ghost" data-go="0">Back</button><button type="button" class="btn" data-go="2">Next: your habits</button></div>';
  }
  function step2() {
    var qs = questions();
    var left = qs.filter(function (q) { return S.ans[Q.indexOf(q)] === undefined; }).length;
    return '<h3>Your habits</h3><p class="lead">Answer how you really trade, not how you wish you traded.</p>' +
      qs.map(function (q, k) {
        var i = Q.indexOf(q);
        return '<div class="q"><p><b>' + (k + 1) + '/' + qs.length + '</b>' + q.t + '</p><div class="opts" role="group">' + q.o.map(function (o, j) {
          return '<button type="button" data-q="' + i + '" data-a="' + j + '" aria-pressed="' + (S.ans[i] === j) + '">' + o[0] + '</button>';
        }).join('') + '</div></div>';
      }).join('') +
      '<div class="row"><button type="button" class="ghost" data-go="1">Back</button>' + (left ? '<span class="need">' + left + ' left to answer</span>' : '') + '<button type="button" class="btn" data-go="3"' + (left ? ' disabled style="opacity:.45;cursor:not-allowed"' : '') + '>See my result</button></div>';
  }

  /* ---------------- the math ---------------- */
  function maths() {
    var p = S.wr / 100, aw = S.aw, al = S.al, n = Math.max(1, S.n);
    var e = p * aw - (1 - p) * al;
    var pf = (1 - p) * al > 0 ? (p * aw) / ((1 - p) * al) : 99;
    var be = al / (aw + al);
    var sd = Math.sqrt(p * Math.pow(aw - e, 2) + (1 - p) * Math.pow(-al - e, 2));
    var t = sd > 0 ? e / sd * Math.sqrt(n) : 0;
    var gap = S.rr > 0 ? aw / S.rr : 1;
    return { e: e, pf: pf, be: be, t: t, gap: gap };
  }
  function streakOdds(L, N, p) {
    // chance of at least L losses in a row somewhere in N trades (win rate p)
    var q = 1 - p, f = [1];          // f[k] = P(no run of L losses in k trades)
    for (var k = 1; k <= N; k++) {
      if (k < L) f[k] = 1; else if (k === L) f[k] = 1 - Math.pow(q, L);
      else f[k] = f[k - 1] - p * Math.pow(q, L) * f[k - L - 1];
    }
    return 1 - f[N];
  }
  function simulate(m) {
    var r = riskUsd(), p = S.wr / 100, win = S.aw * r, loss = S.al * r, sims = 3000, pass = 0, ruin = 0, tt = [];
    var seed = 12345; function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    for (var s = 0; s < sims; s++) {
      var eq = 0, peak = 0, k = 0;
      for (; k < 3000; k++) {
        eq += rnd() < p ? win : -loss;
        if (eq > peak) peak = eq;
        var floor = S.dtype === 'trailing' ? Math.min(peak - S.dd, 0) : -S.dd;
        if (eq <= floor) { ruin++; break; }
        if (eq >= S.target$) { pass++; tt.push(k + 1); break; }
      }
    }
    tt.sort(function (a, b) { return a - b; });
    return { pass: pass / sims, ruin: ruin / sims, med: tt.length ? tt[Math.floor(tt.length / 2)] : null };
  }

  function result() {
    var qs = questions(), sc = {}, mx = {};
    Object.keys(CAT).forEach(function (c) { sc[c] = 0; mx[c] = 0; });
    qs.forEach(function (q) {
      var i = Q.indexOf(q), worst = {};
      q.o.forEach(function (o) { for (var c in o[1]) worst[c] = Math.max(worst[c] || 0, o[1][c]); });
      for (var c in worst) mx[c] += worst[c];
      var pick = q.o[S.ans[i]][1]; for (var c2 in pick) sc[c2] += pick[c2];
    });
    var leaks = Object.keys(CAT).map(function (c) { return { c: c, v: mx[c] ? sc[c] / mx[c] : 0 }; }).sort(function (a, b) { return b.v - a.v; });
    var avgLeak = leaks.reduce(function (s, l) { return s + l.v; }, 0) / leaks.length;
    var score = Math.round(100 * (1 - Math.min(1, avgLeak * 1.6)));
    var emo = (sc.revenge + sc.fomo + sc.cut + sc.risk) / Math.max(1, mx.revenge + mx.fomo + mx.cut + mx.risk);
    var cha = (sc.plan + sc.news + sc.over + sc.cons) / Math.max(1, mx.plan + mx.news + mx.over + mx.cons);
    var archKey = score >= 75 ? 'operator' : emo >= cha ? 'emotional' : 'chaotic';
    var arch = score >= 75 ? ['Systematic Operator', 'Your habits are solid. Your work now is the edge itself and the size of your risk.']
      : emo >= cha ? ['Emotional Trader', 'You have a plan, but losses, missed moves and open profit push you off it. Hard rules beat willpower here.']
      : ['Chaotic Trader', 'There is no fixed routine: no plan, no trade limit, no news check. Build the process first; the setups come second.'];

    var r = riskUsd(), lt = S.dd / r, M = S.known ? maths() : null, sim = S.known ? simulate(M) : null;
    var fixes = [], flags = [];
    if (M) {
      var p = S.wr / 100, expRun = Math.ceil(Math.log(100) / Math.log(1 / Math.max(0.01, 1 - p)));
      var odds = streakOdds(Math.max(1, Math.floor(lt / S.al)), 100, p);
      if (M.e <= 0) { flags.push(['bad', 'No edge', 'noedge']); fixes.push(['Fix the strategy before the discipline.', 'Your numbers lose ' + sg(M.e) + ' R a trade even if you follow every rule. Your ' + S.wr + '% win rate needs to be above ' + Math.round(M.be * 100) + '% at these win and loss sizes. Test it, or trade a tested one from the <a class="link" href="/strategies/">Strategy Book</a>.', 'noedge']); }
      else flags.push(['ok', 'Positive edge', 'edge']);
      if (S.wr >= 60 && S.aw < 0.8 * S.al) { flags.push(['bad', 'Time bomb', 'timebomb']); fixes.push(['Your wins are too small for your losses.', 'You win ' + S.wr + '% of the time but bank only ' + S.aw.toFixed(2) + ' R against ' + S.al.toFixed(2) + ' R losses. One bad day erases a week. Hold winners to your target.', 'timebomb']); }
      if (S.al > 1.15) { flags.push(['bad', 'Losses bigger than the stop', 'bigloss']); fixes.push(['Your losses are bigger than your stop.', 'An average loss of ' + S.al.toFixed(2) + ' R means you move stops or slip. Use a hard stop order placed with the entry.', 'bigloss']); }
      if (M.gap < 0.75 && S.rr > S.aw) { flags.push(['wa', 'Execution gap', 'gap']); fixes.push(['You plan 1:' + S.rr + ' but bank 1:' + S.aw.toFixed(2) + '.', 'You keep only ' + Math.round(M.gap * 100) + '% of your planned reward. Let the target or a written exit rule close the trade, not fear.', 'gap']); }
      if (M.t < 2) { flags.push(['wa', 'Could be luck', 'luck']); fixes.push(['Not enough proof yet.', 'A t-score of ' + M.t.toFixed(1) + ' (from ' + S.n + ' trades) can be luck. Keep the same rules for at least 30 to 100 trades before changing anything.', 'luck']); }
      if (lt < Math.max(10, expRun * 1.5)) { flags.push(['bad', 'Risk too big', 'risk']); fixes.push(['Your risk per trade is too big for your drawdown.', 'With a ' + S.wr + '% win rate, a run of ' + expRun + ' losses in 100 trades is normal, and ' + Math.round(odds * 100) + '% of 100-trade runs hold a streak that ends your account. Risk about ' + usd(S.dd / Math.max(15, expRun * 2)) + ' a trade (' + Math.max(15, expRun * 2) + ' losses to zero).', 'risk']); }
      if (S.dtype === 'trailing' && S.rr >= 3) { flags.push(['wa', 'Trailing trap', 'trailing']); fixes.push(['Trailing drawdown and a big target fight each other.', 'Your floor climbs with your best equity. A 1:' + S.rr + ' trade that gives back its open profit can breach you without a real loss. Take a partial at +1R or move the stop to break-even by rule.', 'trailing']); }
    }
    leaks.filter(function (l) { return l.v >= 0.34; }).slice(0, 4).forEach(function (l) { fixes.push([CAT[l.c][0] + ' is leaking.', CAT[l.c][1], 'c:' + l.c]); });
    if (!fixes.length) fixes.push(['Keep doing what you do.', 'No big leak found. Journal every trade so you see a leak the day it starts.']);

    var col = score >= 75 ? 'var(--ok)' : score >= 50 ? 'var(--wa)' : 'var(--bad)', C = 2 * Math.PI * 56;
    var h = '<div class="hero"><div class="dial"><svg viewBox="0 0 132 132" aria-hidden="true"><circle cx="66" cy="66" r="56" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="12"/><circle cx="66" cy="66" r="56" fill="none" stroke="' + col + '" stroke-width="12" stroke-linecap="round" stroke-dasharray="' + (C * score / 100).toFixed(1) + ' ' + C.toFixed(1) + '"/></svg><b>' + score + '<small>Discipline score</small></b></div>' +
      '<div><div>' + flags.map(function (f) { return '<span class="pill ' + f[0] + '">' + f[1] + '</span>'; }).join('') + '</div><p class="arch">' + arch[0] + '</p><p class="sub">' + arch[1] + '</p></div></div>';
    if (M) {
      var tone = function (v, good, okv) { return v >= good ? 'ok' : v >= okv ? 'wa' : 'bad'; };
      h += '<h4>Your math</h4><dl class="kpis">' +
        '<div class="kpi"><dt>avg RR per trade</dt><dd class="' + (M.e > 0.1 ? 'ok' : M.e > 0 ? 'wa' : 'bad') + '">' + sg(M.e) + '</dd><p>What one trade makes on average, in risk units.</p></div>' +
        '<div class="kpi"><dt>PF (profit factor)</dt><dd class="' + tone(M.pf, 1.5, 1) + '">' + (M.pf >= 99 ? '∞' : M.pf.toFixed(2)) + '</dd><p>Money won ÷ money lost. 1.5 to 2.5 is the sweet spot.</p></div>' +
        '<div class="kpi"><dt>WR vs break-even WR</dt><dd class="' + (S.wr / 100 > M.be + 0.05 ? 'ok' : S.wr / 100 > M.be ? 'wa' : 'bad') + '">' + S.wr + '% / ' + Math.round(M.be * 100) + '%</dd><p>The win rate you need just to not lose at these sizes.</p></div>' +
        '<div class="kpi"><dt>t-score</dt><dd class="' + tone(M.t, 2, 1) + '">' + M.t.toFixed(2) + '</dd><p>2 or more = probably not luck.</p></div>' +
        '<div class="kpi"><dt>Target kept</dt><dd class="' + tone(M.gap, 0.85, 0.6) + '">' + Math.round(Math.min(1, M.gap) * 100) + '%</dd><p>Your real average win ÷ your 1:' + S.rr + ' target.</p></div>' +
        '<div class="kpi"><dt>Risk a trade</dt><dd class="' + tone(lt, 15, 8) + '">' + usd(r) + '</dd><p>' + lt.toFixed(1) + ' full losses to lose the ' + usd(S.dd) + ' drawdown.</p></div>' +
        '<div class="kpi"><dt>Chance to reach the payout</dt><dd class="' + tone(sim.pass, 0.6, 0.35) + '">' + Math.round(sim.pass * 100) + '%</dd><p>3,000 simulated runs of your numbers, ' + (S.dtype === 'trailing' ? 'trailing' : 'fixed') + ' drawdown.</p></div>' +
        '<div class="kpi"><dt>Trading days to payout</dt><dd>' + (sim.med ? Math.ceil(sim.med / S.tpd) : '—') + '</dd><p>Median, at ' + S.tpd + ' trades a day, when it passes.</p></div>' +
        '</dl>';
    }
    h += '<h4>Where your discipline leaks</h4><div class="leaks">' + leaks.map(function (l) {
      var pc = Math.round(l.v * 100), c = pc >= 60 ? 'var(--bad)' : pc >= 34 ? 'var(--wa)' : 'var(--ok)';
      return '<div class="lk"><span>' + CAT[l.c][0] + '</span><span class="bar"><i style="width:' + Math.max(3, pc) + '%;background:' + c + '"></i></span><em>' + pc + '%</em></div>';
    }).join('') + '</div>';
    h += '<h4>Fix these first</h4><ol class="fix">' + fixes.slice(0, 6).map(function (f) { return '<li><div><b>' + f[0] + '</b> <span>' + f[1] + '</span></div></li>'; }).join('') + '</ol>';
    LAST = { v: 1, ts: Date.now(), score: score, arch: archKey, archLabel: arch[0], archNote: arch[1],
      leaks: leaks.reduce(function (o, l) { o[l.c] = Math.round(l.v * 100) / 100; return o; }, {}),
      flags: flags.map(function (f) { return f[2]; }), fixes: fixes.slice(0, 6).map(function (f) { return { k: f[2] || '', h: f[0], b: String(f[1]).replace(/<[^>]+>/g, '') }; }),
      known: S.known, acct: { dtype: S.dtype, dd: S.dd, target: S.target$, risk: Math.round(r), lt: Math.round(lt * 10) / 10, tpd: S.tpd } };
    if (M) { LAST.math = { rr: S.rr, wr: S.wr, aw: S.aw, al: S.al, n: S.n, e: Math.round(M.e * 1000) / 1000, pf: Math.round(Math.min(99, M.pf) * 100) / 100, be: Math.round(M.be * 1000) / 1000, t: Math.round(M.t * 100) / 100, gap: Math.round(M.gap * 100) / 100 };
      LAST.sim = { pass: Math.round(sim.pass * 1000) / 1000, ruin: Math.round(sim.ruin * 1000) / 1000, med: sim.med }; }
    h += saveBox();
    h += '<div class="row"><button type="button" class="ghost" data-go="0">Change my answers</button><span style="display:flex;gap:10px;flex-wrap:wrap"><a class="ghost" href="/diagnostic/">Take the full Trading Test</a><a class="btn" href="/journal/">Track it in MMM Pro Journal</a></span></div>' +
      '<p class="note">Education only, not financial advice. The simulation assumes every trade is independent and uses your numbers as they are; real results vary.</p>';
    return h;
  }

  /* ---------------- save to the journal + email ---------------- */
  var LAST = null, MAILST = '';
  function mailUrl() { return window.MMM_TEST_MAIL_URL || ''; }
  function user() { return window.MMM && window.MMM.user ? window.MMM.user() : null; }
  function saveBox() {
    var u = user(), url = mailUrl();
    if (u) {
      return '<div class="mailbox" id="dt-mail"><div style="font-weight:700;color:#fff">Saved to your journal.</div><div style="color:#c8d1d5;margin:2px 0 8px">' + (MAILST === 'sent' ? 'We also emailed it to your account email.' : MAILST === 'err' ? 'Your result is saved. The email could not be sent right now.' : 'You will find it on the Discipline page, next to your Trading Test.') + '</div><a class="link" href="/journal/">Open my journal</a></div>';
    }
    return '<div class="mailbox" id="dt-mail">' +
      (url ? (MAILST === 'sent' ? '<b>Sent.</b> <span>Check your inbox for your result.</span>' :
        '<form data-mail novalidate><label for="dt-email"><b>Email me my result</b> <span>We send it once and keep your result with your email so Max can follow up. No spam.</span></label>' +
        '<div class="mrow"><input id="dt-email" type="email" autocomplete="email" required placeholder="you@email.com"><button type="submit" class="btn">Email it to me</button></div>' +
        (MAILST === 'bad' ? '<p class="need">Enter a valid email address.</p>' : MAILST === 'err' ? '<p class="need">It could not be sent right now. Try again in a minute.</p>' : MAILST === 'busy' ? '<p class="need">Sending…</p>' : '') + '</form>') : '') +
      '<p class="acct"><span>Keep it in your MMM Pro Journal, next to the Trading Test:</span> <button type="button" class="ghost" data-mmm="register">Create a free account</button> <button type="button" class="ghost" data-mmm="login">Log in</button></p></div>';
  }
  function esc(x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function post(body) {
    var url = mailUrl(); if (!url) return Promise.reject(new Error('off'));
    // text/plain keeps it a "simple" request (no CORS preflight), which Apps Script needs
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); }).then(function (j) { if (!j || !j.ok) throw new Error((j && j.code) || 'fail'); return j; });
  }
  function lang() { try { return localStorage.getItem('mmm-language') || 'en'; } catch (e) { return 'en'; } }
  function persist(rec) {
    if (!rec) return;
    var u = user();
    rec = JSON.parse(JSON.stringify(rec));
    try { localStorage.setItem('mmm-dtest-pending', JSON.stringify(Object.assign({}, rec, { mailed: false }))); } catch (e) {}
    if (!u || !window.MMM.db) return;
    window.MMM.db().then(function (db) {
      var ref = db.collection('users').doc(u.uid).collection('profile').doc('dtest');
      return ref.get().then(function (snap) {
        var old = snap.exists ? snap.data() : null;
        var hist = ((old && old.history) || []).concat([{ ts: rec.ts, score: rec.score }]).slice(-12);
        return ref.set(Object.assign({}, rec, { history: hist, email: u.email || '' }));
      });
    }).then(function () {
      try { localStorage.removeItem('mmm-dtest-pending'); localStorage.setItem('mmm-dtest-done-' + u.uid, '1'); } catch (e) {}
      if (window.MMM.hideTestBanner) window.MMM.hideTestBanner();
      if (!mailUrl()) return;
      return u.getIdToken().then(function (tok) { return post({ action: 'result', type: 'dtest', idToken: tok, lang: lang(), result: rec }); })
        .then(function () { MAILST = 'sent'; }, function () { MAILST = 'err'; }).then(refreshBox);
    }).catch(function () { });
  }
  function refreshBox() { var b = root.querySelector('#dt-mail'); if (b && S.step === 3) b.outerHTML = saveBox(); }
  root.addEventListener('submit', function (e) {
    var f = e.target.closest('form[data-mail]'); if (!f) return;
    e.preventDefault();
    var em = (f.querySelector('input[type=email]').value || '').trim();
    if (!/^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/.test(em)) { MAILST = 'bad'; refreshBox(); return; }
    MAILST = 'busy'; refreshBox();
    post({ action: 'result', type: 'dtest', email: em, lang: lang(), result: LAST })
      .then(function () { MAILST = 'sent'; try { var p = JSON.parse(localStorage.getItem('mmm-dtest-pending') || 'null'); if (p) { p.mailed = true; p.email = em; localStorage.setItem('mmm-dtest-pending', JSON.stringify(p)); } } catch (er) {} },
            function () { MAILST = 'err'; })
      .then(refreshBox);
  });
  document.addEventListener('mmm:auth', function () { if (S.step === 3) { refreshBox(); if (user() && LAST && !SAVED) { SAVED = true; persist(LAST); } } });
  var SAVED = false;

  function render(focus) {
    var body = [step0, step1, step2, result][S.step]();
    root.innerHTML = '<div class="dt"><div class="card">' + head() + '<div class="body" aria-live="polite">' + body + '</div></div></div>';
    if (focus) { var h = root.querySelector('.body h3, .body .arch'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
  }
  function go(i) {
    var allAns = questions().every(function (q) { return S.ans[Q.indexOf(q)] !== undefined; });
    if (i === 3 && !allAns) return;
    S.step = i; save(); render(true);
    if (i === 3) { MAILST = ''; SAVED = !!user(); persist(LAST); refreshBox(); }
    var top = root.getBoundingClientRect().top + window.scrollY - 90;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  root.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.step) return go(+b.dataset.step);
    if (b.dataset.go) return go(+b.dataset.go);
    if (b.dataset.set) {
      S[b.dataset.set] = b.dataset.v;
      if (b.dataset.set === 'rmode') S.rval = S.rmode === 'usd' ? Math.round(S.dd / 10) : 10;
      save(); render(); return;
    }
    if (b.dataset.q !== undefined) { S.ans[b.dataset.q] = +b.dataset.a; save(); render(); var nb = root.querySelector('[data-q="' + b.dataset.q + '"][data-a="' + b.dataset.a + '"]'); if (nb) nb.focus({ preventScroll: true }); }
  });
  var LIM = function (k) { return { dd: [100, 250000], 'target$': [100, 500000], rval: S.rmode === 'usd' ? [1, S.dd] : [1, 100], tpd: [1, 50], rr: [1, 100], wr: [1, 99], aw: [0.05, 100], al: [0.05, 10], n: [1, 100000] }[k]; };
  function refresh() {
    var c = root.querySelector('.calc'); if (c) { var r = riskUsd(); c.textContent = '= ' + usd(r) + ' risk a trade, ' + (S.dd / r).toFixed(1) + ' full losses to lose the whole drawdown'; }
    var rr = root.querySelector('[data-in="rr"]'); if (rr && rr.nextElementSibling) rr.nextElementSibling.textContent = 'R (1:' + S.rr + ')';
    var rv = root.querySelector('[data-in="rval"]'); if (rv && S.rmode === 'usd') rv.max = S.dd;
  }
  function setFrom(el, final) {
    var k = el.dataset.in, lim = LIM(k); if (!lim) return;
    var v = parseFloat(el.value); if (isNaN(v)) { if (!final) return; v = lim[0]; }
    S[k] = final ? clamp(v, lim[0], lim[1]) : Math.min(lim[1], Math.max(lim[0], v));
    if (k === 'dd' && S.rmode === 'usd') S.rval = Math.min(S.rval, S.dd);
    if (final && String(S[k]) !== el.value) el.value = S[k];
    save(); refresh();
  }
  root.addEventListener('change', function (e) {
    var el = e.target, k = el.dataset && el.dataset.in; if (!k) return;
    if (k === 'unknown') { S.known = !el.checked; save(); render(); return; }
    if (k === 'ddr') return;
    setFrom(el, true);
  });
  root.addEventListener('input', function (e) {
    var el = e.target, k = el.dataset && el.dataset.in; if (!k) return;
    if (k === 'ddr') { S.dd = clamp(Math.round(100 * Math.pow(2500, el.value / 1000) / 50) * 50 || 100, 100, 250000); var box = root.querySelector('[data-in="dd"]'); if (box) box.value = S.dd; if (S.rmode === 'usd') S.rval = Math.min(S.rval, S.dd); save(); refresh(); return; }
    if (k !== 'unknown') setFrom(el, false);
  });
  // for the translation build: render each screen with sample answers
  window.__dtDemo = function (k) {
    if (k === 'reset') { S.ans = {}; S.step = 0; render(); return; }
    var pick = [0, 1, 2, 3][k % 4]; Q.forEach(function (q, i) { S.ans[i] = (pick + i) % q.o.length; });
    S.dtype = k % 2 ? 'trailing' : 'fixed'; S.known = k !== 3; S.wr = [45, 72, 30, 50][k % 4]; S.aw = [1.6, 0.5, 2.2, 1][k % 4]; S.al = [1, 1, 1.3, 1][k % 4]; S.n = [40, 12, 200, 80][k % 4];
    S.rmode = ['trades', 'usd', 'pct', 'trades'][k % 4]; S.rval = [10, 400, 5, 20][k % 4]; S.step = 3; render();
  };
  render();
})();
