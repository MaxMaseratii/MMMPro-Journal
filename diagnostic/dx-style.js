// MMM Trader Profile Assessment - Part 4: trading style, strategy fit and "My Number".
// The fit uses the tested edges of the MMM strategy book (NQ 2022-25 -> MNQ 2026, blended numbers).
// English strings here; translations live in i18n-diagnostic.js (keyed by the English text).

DX.STYLE = [
  { id: 'st_mkt', text: 'Which futures market do you trade most?', opts: ['NQ or MNQ (Nasdaq)', 'ES or MES (S&P 500)', 'Gold (GC or MGC)', 'Something else'] },
  { id: 'st_time', text: 'When can you sit at the screen and trade?', opts: ['Evening Asia session (18:00 to 00:00 New York)', 'New York morning (09:30 to 13:30)', 'Both of them', 'Only a short window, under 1 hour'] },
  { id: 'st_wr', text: 'Which kind of results feel better to you?', opts: ['Win often, with smaller wins (60 to 75% winners)', 'Win less often, but with big winners (30 to 45% winners)', 'Something in the middle', 'I am not sure yet'] },
  { id: 'st_streak', text: 'How many losses in a row can you take and still follow your rules?', opts: ['3 or fewer', '4 to 7', '8 to 15', 'More than 15'] },
  { id: 'st_entry', text: 'How do you like to get into a trade?', opts: ['At the close of the signal candle (market order)', 'With a limit order waiting at a level', 'Both are fine for me'] },
  { id: 'st_dir', text: 'Which direction are you comfortable trading?', opts: ['Long only (buying)', 'Long and short', 'Short only (selling)'] },
  { id: 'st_freq', text: 'How many trades a day do you want?', opts: ['1 or fewer', '2 to 3', '4 to 6', 'As many as the setups give me'] },
  { id: 'st_manage', text: 'How do you like to handle a trade that is winning?', opts: ['Take half off early, let the rest run', 'Keep the whole position until the target', 'Trail my stop behind the candles'] },
  { id: 'st_hold', text: 'How long do you like to stay in a trade?', opts: ['Minutes', 'One to a few hours', 'Most of the day or overnight', 'I do not mind'] },
  { id: 'st_stop', text: 'Which stop do you trust the most?', opts: ['A fixed stop in points (50 NQ or 20 ES)', 'A volatility stop that changes with ATR', 'A tight stop just behind the candle', 'No preference'] },
  { id: 'st_tool', text: 'Which MMM indicator do you use most?', opts: ['MMM EDGE PRO', 'MMM Pro XCS One', 'MMM PRO x, c or s', 'None yet'] }
];

// tested edges: wr / av = blended win rate % and avg RR, maxL = max losses in a row, pm = trades a month
// ses: am = Asia + NY AM windows · any = every 15m candle · pre = 08:00-09:15 New York · mk = markets where it worked
DX.EDGES = [
  { code: 'EP.M1', name: 'Z T3+ Break', ind: 'MMM EDGE PRO', t: 'T', wr: 72, av: 0.18, ts: 5.4, maxL: 4, pm: 17, dir: 'both', entry: 'market', exit: 'half', stop: 'atr', ses: 'am', mk: ['NQ', 'ES'] },
  { code: 'EP.M2', name: 'G GMC Long', ind: 'MMM EDGE PRO', t: 'T', wr: 60, av: 0.08, ts: 4.0, maxL: 10, pm: 54, dir: 'long', entry: 'market', exit: 'half', stop: 'atr', ses: 'am', mk: ['NQ', 'ES'] },
  { code: 'EP.M3', name: 'B GMC AFs Long', ind: 'MMM EDGE PRO', t: 'T', wr: 71, av: 0.17, ts: 3.9, maxL: 5, pm: 12, dir: 'long', entry: 'market', exit: 'half', stop: 'atr', ses: 'am', mk: ['NQ', 'ES'] },
  { code: 'EP.M4', name: 'C Contraction Limit Long', ind: 'MMM EDGE PRO', t: 'W', wr: 63, av: 0.08, ts: 2.3, maxL: 5, pm: 8, dir: 'long', entry: 'limit', exit: 'half', stop: 'fixed', ses: 'am', mk: ['NQ'] },
  { code: 'EP.M5', name: 'M BC+ Long', ind: 'MMM EDGE PRO', t: 'T', wr: 63, av: 0.07, ts: 5.1, maxL: 10, pm: 67, dir: 'long', entry: 'market', exit: 'half', stop: 'fixed', ses: 'am', mk: ['NQ'] },
  { code: 'X.M1', name: 'Zone T3+ Break', ind: 'MMM PRO x', t: 'T', wr: 42, av: 0.23, ts: 5.2, maxL: 16, pm: 28, dir: 'both', entry: 'market', exit: 'full', stop: 'atr', ses: 'am', mk: ['NQ'] },
  { code: 'X.M2', name: 'Contraction T3+ Limit', ind: 'MMM PRO x', t: 'W', wr: 43, av: 0.12, ts: 2.9, maxL: 9, pm: 18, dir: 'both', entry: 'limit', exit: 'full', stop: 'fixed', ses: 'am', mk: ['NQ'] },
  { code: 'X.M3', name: '5m iBlock T4+ Long Limit', ind: 'MMM PRO x', t: 'W', wr: 41, av: 0.13, ts: 4.7, maxL: 23, pm: 50, dir: 'long', entry: 'limit', exit: 'full', stop: 'fixed', ses: 'any', mk: ['NQ', 'ES'] },
  { code: 'C.M1', name: 'GMC c3 AFs Against', ind: 'MMM PRO c', t: 'T', wr: 33, av: 0.16, ts: 4.6, maxL: 17, pm: 66, dir: 'both', entry: 'market', exit: 'full', stop: 'atr', ses: 'am', mk: ['NQ', 'GC'] },
  { code: 'C.M2', name: 'GMC Long Fixed 50', ind: 'MMM PRO c', t: 'T', wr: 42, av: 0.07, ts: 4.6, maxL: 22, pm: 114, dir: 'long', entry: 'market', exit: 'full', stop: 'fixed', ses: 'am', mk: ['NQ'] },
  { code: 'XCS.M1', name: 'Late Continuation Break P5+', ind: 'MMM Pro XCS One', t: 'T', wr: 40, av: 0.13, ts: 3.1, maxL: 19, pm: 26, dir: 'both', entry: 'market', exit: 'full', stop: 'fixed', ses: 'any', mk: ['NQ'] },
  { code: 'XCS.M2', name: 'Any Continuation Break', ind: 'MMM Pro XCS One', t: 'T', wr: 37, av: 0.05, ts: 3.4, maxL: 27, pm: 190, dir: 'both', entry: 'market', exit: 'full', stop: 'fixed', ses: 'any', mk: ['NQ'] },
  { code: 'XCS.M3', name: '4H GMC AFs to 15m Pullback BC', ind: 'MMM Pro XCS One', t: 'W', wr: 39, av: 0.16, ts: 1.9, maxL: 14, pm: 6, dir: 'both', entry: 'market', exit: 'full', stop: 'fixed', ses: 'am', mk: ['NQ', 'ES'] },
  { code: 'XCS.M4', name: '4H GMC AFs to 15m Pullback BC, Long', ind: 'MMM Pro XCS One', t: 'W', wr: 44, av: 0.29, ts: 2.5, maxL: 10, pm: 4, dir: 'long', entry: 'market', exit: 'full', stop: 'fixed', ses: 'am', mk: ['NQ', 'ES'] },
  { code: 'XCS.M5', name: '15m iBlock Pre-Market AFs+', ind: 'MMM Pro XCS One', t: 'W', wr: 43, av: 0.25, ts: 2.4, maxL: 8, pm: 5, dir: 'both', entry: 'market', exit: 'full', stop: 'candle', ses: 'pre', mk: ['NQ'] }
];

DX.FIT_TXT = {
  mk: 'Worked on your market in the tests',
  time: 'Fires in the hours you can trade',
  shortWin: 'Few trades, so a short window is enough',
  wrHigh: 'Wins often, like you prefer',
  wrBig: 'Fewer wins but bigger winners, like you prefer',
  streak: 'Its worst losing run fits what you can handle',
  limit: 'Uses limit orders, like you prefer',
  market: 'Enters at the candle close, like you prefer',
  dir: 'Trades the direction you are comfortable with',
  freq: 'Gives about the number of trades you want',
  half: 'Takes half off early, like you prefer',
  full: 'Holds the whole position to the target, like you prefer',
  hold: 'Holds as long as you like to hold',
  stop: 'Uses the stop you trust',
  tool: 'Runs on the indicator you already use',
  status: 'Passed both test periods (TRADE)',
  disc: 'Short losing runs protect your discipline',
  prop: 'Small drawdowns suit a prop account'
};

// returns { list: [ { e: edge, score, why: [] } sorted best first ], avoid: [codes], market }
DX.fit = function (ans, overall) {
  var a = function (id) { var v = ans[id]; return v === undefined ? -1 : v; };
  var mk = ['NQ', 'ES', 'GC', 'NQ'][Math.max(0, a('st_mkt'))];
  var out = [], avoid = [];
  DX.EDGES.forEach(function (e) {
    var s = 0, why = [];
    var add = function (p, key) { s += p; if (p > 0 && key) why.push({ p: p, k: key }); };
    if (e.mk.indexOf(mk) < 0) { avoid.push(e.code); return; }
    if (a('st_mkt') === 1 || a('st_mkt') === 2) add(2, 'mk');
    var tm = a('st_time');
    if (tm === 0) add(e.ses === 'am' ? 2 : e.ses === 'any' ? 1 : -3, 'time');
    if (tm === 1) add(e.ses === 'am' ? 2 : e.ses === 'pre' ? 1 : 1, 'time');
    if (tm === 2) add(e.ses === 'am' ? 2 : 1, 'time');
    if (tm === 3) add(e.pm <= 20 ? 2 : e.pm >= 60 ? -2 : 0, 'shortWin');
    var wr = a('st_wr');
    if (wr === 0) add(e.wr >= 60 ? 3 : e.wr < 45 ? -2 : 0, 'wrHigh');
    if (wr === 1) add(e.wr < 45 && e.av >= 0.13 ? 3 : e.wr >= 60 ? -1 : 0, 'wrBig');
    var st = a('st_streak');
    if (st === 0) add(e.maxL <= 5 ? 3 : e.maxL >= 15 ? -4 : -1, 'streak');
    if (st === 1) add(e.maxL <= 10 ? 2 : e.maxL >= 20 ? -3 : -1, 'streak');
    if (st === 2) add(e.maxL <= 17 ? 1 : -1, 'streak');
    var en = a('st_entry');
    if (en === 0) add(e.entry === 'limit' ? -4 : 1, 'market');
    if (en === 1) add(e.entry === 'limit' ? 2 : 0, 'limit');
    var dr = a('st_dir');
    if (dr === 0) add(e.dir === 'long' ? 2 : 0, 'dir');
    if (dr === 2) add(e.dir === 'long' ? -5 : 1, 'dir');
    var fq = a('st_freq');
    if (fq === 0) add(e.pm <= 25 ? 2 : e.pm >= 60 ? -2 : 0, 'freq');
    if (fq === 1) add(e.pm >= 15 && e.pm <= 70 ? 1 : 0, 'freq');
    if (fq === 2) add(e.pm >= 50 ? 1 : 0, 'freq');
    if (fq === 3) add(e.pm >= 60 ? 2 : 0, 'freq');
    var mg = a('st_manage');
    if (mg === 0) add(e.exit === 'half' ? 3 : 0, 'half');
    if (mg === 1) add(e.exit === 'full' ? 2 : 0, 'full');
    if (mg === 2) add(e.code === 'X.M1' || e.code === 'XCS.M1' ? 1 : 0, 'hold');
    var hd = a('st_hold');
    if (hd === 0) add(e.exit === 'half' ? 1 : 0, 'hold');
    if (hd === 2) add(e.ind === 'MMM Pro XCS One' || e.code === 'X.M1' ? 2 : 0, 'hold');
    var sp = a('st_stop');
    if (sp >= 0 && sp <= 2) add(e.stop === ['fixed', 'atr', 'candle'][sp] ? 2 : 0, 'stop');
    var tl = a('st_tool');
    if (tl === 0) add(e.ind === 'MMM EDGE PRO' ? 2 : (e.code === 'X.M1' || e.code === 'X.M2' || e.code === 'C.M1' || e.code === 'C.M2') ? 1 : 0, 'tool');
    if (tl === 1) add(e.ind === 'MMM Pro XCS One' ? 2 : 0, 'tool');
    if (tl === 2) add(e.ind === 'MMM PRO x' || e.ind === 'MMM PRO c' ? 2 : 0, 'tool');
    add(e.t === 'T' ? 2 : 0, 'status');
    if (overall !== undefined && overall < 60) {
      add(e.maxL <= 10 ? 2 : 0, 'disc');
      if (e.code === 'XCS.M2') s -= 3;
    }
    if (a('acct') === 0) add(e.maxL <= 10 ? 2 : 0, 'prop');
    s += e.av * 10 + Math.min(e.ts, 6) / 3;
    why.sort(function (x, y) { return y.p - x.p; });
    out.push({ e: e, score: Math.round(s * 10) / 10, why: why.slice(0, 3).map(function (w) { return DX.FIT_TXT[w.k]; }) });
  });
  out.sort(function (x, y) { return y.score - x.score; });
  return { list: out, avoid: avoid, market: mk };
};

// "My Number": one personal MMM number per trader, kept in this browser and saved with the result.
DX.myNumber = function () {
  var key = 'mmm-my-number', n = null;
  try { n = localStorage.getItem(key); } catch (e) {}
  if (!n || !/^MMM-\d{4}-\d{4}$/.test(n)) {
    var d = '';
    try { var r = new Uint32Array(2); crypto.getRandomValues(r); d = String(r[0] % 100000000); } catch (e) { d = String(Math.floor(Math.random() * 1e8)); }
    while (d.length < 8) d = '0' + d;
    n = 'MMM-' + d.slice(0, 4) + '-' + d.slice(4);
    try { localStorage.setItem(key, n); } catch (e) {}
  }
  return n;
};
