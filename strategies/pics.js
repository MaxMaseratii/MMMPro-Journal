/* MMM Strategy Book · setup pictures.
   Each strategy has a "pic" spec. A builder turns it into a scene (candles + zones + lines + marks) drawn in the LONG direction.
   The SHORT picture is the same scene flipped upside down, with the words swapped (BuBC ↔ BeBC, high ↔ low …).
   Items marked f:1 belong to the strategy filter and only show when "Filter on" is picked. */
(function () {
  'use strict';
  var K = function (o, h, l, c, tag) { return { o: o, h: h, l: l, c: c, tag: tag || '' }; };
  var SWAP = [['BuBC', 'BeBC'], ['Bu LEZ', 'Be LEZ'], ['CDL', 'CDS'], ['LD', 'SD'], ['buy', 'sell'], ['Buy', 'Sell'], ['buyers', 'sellers'], ['Buyers', 'Sellers'],
    ['high', 'low'], ['High', 'Low'], ['highs', 'lows'], ['above', 'below'], ['Above', 'Below'], ['top', 'bottom'], ['Top', 'Bottom'], ['green', 'red'], ['up', 'down'], ['Up', 'Down'],
    ['↑', '↓'], ['long', 'short'], ['Long', 'Short'], ['bull', 'bear'], ['Bull', 'Bear'], ['bullish', 'bearish'], ['Bullish', 'Bearish'], ['upper', 'lower'], ['MP', 'MD'], ['XP', 'XD']];
  function swapWords(s) {
    var map = {}; SWAP.forEach(function (p) { map[p[0]] = p[1]; map[p[1]] = p[0]; });
    var keys = Object.keys(map).sort(function (a, b) { return b.length - a.length; }).map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); });
    var re = new RegExp('(^|[^A-Za-z])(' + keys.join('|') + ')(?=[^A-Za-z]|$)', 'g');
    return s.replace(re, function (m, a, w) { return a + map[w]; });
  }
  var STOPLBL = { zone: 'stop past the box', zonefree: 'stop past the box', S50: 'stop 50 pts', S20: 'stop 20 pts', S40: 'stop 40 pts', S35: 'stop 35 pts', ATR: 'stop ATR', afs: 'stop past AFs+ low', top50: 'stop: block top − 50' };

  /* ---------- builders (long direction, price 0–100) ---------- */
  function addRisk(sc, entryY, entryX, spec, boxLow) {
    var stopY = (spec.stop === 'zone' || spec.stop === 'zonefree' || spec.stop === 'afs') ? boxLow - 1.2 : entryY - (spec.stop === 'S20' ? 7 : spec.stop === 'S35' ? 9 : spec.stop === 'S40' ? 10 : 12);
    if (spec.stop === 'ATR') stopY = entryY - 11;
    if (spec.stop === 'top50') stopY = boxLow;
    var risk = entryY - stopY;
    sc.lines.push({ y: entryY, x0: entryX, cls: 'entry', label: 'entry' });
    sc.lines.push({ y: stopY, x0: entryX, cls: 'stop', label: STOPLBL[spec.stop] || 'stop' });
    if (spec.rr === 'run') sc.lines.push({ y: sc.c.reduce(function (m, k) { return Math.max(m, k.h); }, 0) + 8, x0: entryX, cls: 'tgt', label: 'runner ↑' });
    else {
      var ty = entryY + risk * spec.rr, top = sc.c.reduce(function (m, k) { return Math.max(m, k.h); }, 0) + 8;
      if (ty > top) sc.lines.push({ y: top, x0: entryX, cls: 'tgt', label: '↑ 1:' + spec.rr + ' (higher)' });
      else sc.lines.push({ y: ty, x0: entryX, cls: 'tgt', label: 'target 1:' + spec.rr });
    }
    if (spec.half) sc.marks.push({ x: entryX + 1.6, y: entryY + risk * 0.5, t: 'half', label: '½ off · stop → entry', side: 1 });
    return { stopY: stopY, risk: risk };
  }
  function fall(sc) { [K(84, 86, 76, 78), K(78, 79, 68, 70), K(70, 71, 58, 60), K(60, 61, 50, 52)].forEach(function (k) { sc.c.push(k); }); }
  function sessBand(sc, spec, x0) {
    if (!spec.sess) return;
    var L = { Asia: 'Asia 18:00–02:00', London: 'London 02:00–08:00', 'Asia / NY AM': 'Asia or NY AM only', 'pre-market': 'pre-market 08:00–09:15' }[spec.sess] || spec.sess;
    sc.zones.push({ x0: x0, x1: 99, y0: 2, y1: 99, cls: 'sess', label: L, f: 1, lpos: 'top' });
  }
  function timeBand(sc, txt, x0) { sc.zones.push({ x0: x0, x1: 99, y0: 2, y1: 99, cls: 'sess', label: txt, f: 1, lpos: 'top' }); }
  var B = {};
  B.edge = function (spec) {
    var sc = { c: [], zones: [], lines: [], marks: [], notes: [] };
    fall(sc);
    sc.c.push(K(52, 53, 36, 43, 'last red'));
    sc.c.push(K(43, 58, 42, 57, 'BuBC'));
    sc.c.push(K(57, 64, 56, 63)); sc.c.push(K(63, 65, 55, 57)); sc.c.push(K(57, 58, 43, 50));
    sc.c.push(K(50, 62, 49, 61)); sc.c.push(K(61, 70, 60, 69)); sc.c.push(K(69, 78, 68, 76));
    sc.zones.push({ x0: -0.5, x1: 99, y0: 32, y1: 42, cls: 'lvl', label: spec.lvl || 'HTF level' });
    sc.zones.push({ x0: 3.6, x1: 99, y0: 36, y1: 43, cls: 'box', label: 'LTF reversal box' });
    sc.marks.push({ x: 4, y: 36, t: 'touch', label: '1st touch of the level', side: -1 });
    sc.marks.push({ x: 5, y: 58, t: 'tag', label: 'BuBC = the turn', side: 1 });
    sc.lines.push({ y: 43, x0: 5.5, x1: 8, cls: 'lim', label: '' });
    sc.marks.push({ x: 8, y: 43, t: 'fill', label: 'limit at the box top fills', side: -1 });
    addRisk(sc, 43, 8, spec, 36);
    if (spec.held) sc.notes.push({ x: 0.2, y: 29, text: '✓ level held: no close below it', f: 1 });
    if (spec.code === 'FVA.M5') sc.notes.push({ x: 0.2, y: 93, text: 'H1 trend ↑', f: 1, box: 1 });
    if (spec.filt && spec.code !== 'FVA.M5') timeBand(sc, { 'FVA.M2': 'fills 12:00–16:00 only', 'FVA.M3': 'fills 09:30–12:00 only', 'FVA.M6': 'fills 09:30–12:00 only', 'FVA.M7': 'fills 02:00–08:00 only' }[spec.code] || 'time filter', 5.5);
    return sc;
  };
  B.retest = function (spec) {
    var sc = { c: [], zones: [], lines: [], marks: [], notes: [] };
    fall(sc);
    var boxTop = 43;
    sc.c.push(K(52, 53, 36, 43, 'last red'));
    if (spec.nbc) { sc.c.push(K(43, 45, 37, 42, 'NBC')); boxTop = 43; }
    var bi = sc.c.length; sc.c.push(K(43, 58, 42, 57, 'break BuBC'));
    var pre = spec.pre || 'P0', p = 57;
    if (pre === 'NBC') { sc.c.push(K(57, 59, 52, 55, 'NBC')); p = 55; }
    if (pre === '2BC') { sc.c.push(K(57, 66, 56, 65, '2nd BC')); p = 65; }
    if (pre === 'mix') { sc.c.push(K(57, 66, 56, 65, '2nd BC')); sc.c.push(K(65, 67, 60, 62, 'NBC')); sc.c.push(K(62, 63, 54, 55, 'opp BC')); p = 55; }
    var ti = sc.c.length, inside = spec.touch === 'inside';
    sc.c.push(inside ? K(p, p + 1, 38.5, 40.5, 'touch') : K(p, p + 1, 41.5, p - 5, 'touch'));
    var tc = sc.c[ti], prevHi = tc.h;
    var ei = sc.c.length, eo = tc.c, ec = Math.max(prevHi, 58) + 3;
    sc.c.push(K(eo, ec + 1, eo - 1, ec, '1st BC out'));
    var entryY, entryX, fillLbl;
    if (spec.area === '50') {
      var lim = (eo + ec) / 2; sc.c.push(K(ec, ec + 2, lim - 0.5, ec - 2)); entryY = lim; entryX = ei + 1; fillLbl = 'limit at 50% of the BC fills';
      sc.lines.push({ y: lim, x0: ei, x1: ei + 1, cls: 'lim', label: '' });
    } else if (spec.area === 'broke') {
      var lb = prevHi; sc.c.push(K(ec, ec + 2, lb - 0.5, ec - 3)); entryY = lb; entryX = ei + 1; fillLbl = 'limit at the high the BC broke fills';
      sc.lines.push({ y: lb, x0: ti, x1: ei + 1, cls: 'lim', label: '' });
    } else { sc.c.push(K(ec, ec + 5, ec - 1, ec + 4)); entryY = ec; entryX = ei + 1; fillLbl = 'enter at the next open'; }
    var last = sc.c[sc.c.length - 1].c;
    sc.c.push(K(last, last + 7, last - 1, last + 6)); sc.c.push(K(last + 6, last + 12, last + 5, last + 11));
    sc.zones.push({ x0: -0.5, x1: 99, y0: 32, y1: 42, cls: 'lvl', label: spec.lvl || 'HTF level' });
    sc.zones.push({ x0: 3.6, x1: 99, y0: 36, y1: boxTop, cls: 'box', label: spec.nbc ? 'LTF box with an NBC' : 'LTF reversal box' });
    sc.marks.push({ x: 4, y: 36, t: 'touch', label: '1st touch of the level', side: -1 });
    sc.marks.push({ x: bi, y: 58, t: 'tag', label: 'break', side: 1 });
    sc.marks.push({ x: ti, y: inside ? 38.5 : 41.5, t: 'touch', label: inside ? 'retest closes inside' : (spec.touch === 'wick' ? 'retest: wick only' : 'retest'), side: -1 });
    sc.marks.push({ x: ei, y: ec + 1, t: 'tag', label: '1st BC out', side: 1 });
    sc.marks.push({ x: entryX, y: entryY, t: 'fill', label: fillLbl, side: spec.area === 'open' ? 1 : -1 });
    var r = addRisk(sc, entryY, entryX, spec, 36);
    if (spec.be) sc.marks.push({ x: entryX + 1, y: entryY + 2, t: 'half', label: 'stop → BE + fees', side: 1 });
    if (spec.re) sc.notes.push({ x: ei + 1.2, y: 30, text: 'stopped and the box holds? touch → BC out → re-enter' });
    if (spec.held) sc.notes.push({ x: 0.2, y: 29, text: '✓ level held: no close below it', f: 1 });
    if (spec.code === 'FVA.M9') sc.notes.push({ x: 0.2, y: 93, text: 'H1 trend ↑', f: 1, box: 1 });
    sessBand(sc, spec, bi);
    return sc;
  };
  B.wait3 = function (spec) {
    var sc = { c: [], zones: [], lines: [], marks: [], notes: [] };
    [K(22, 31, 21, 30), K(30, 38, 29, 37), K(37, 44, 36, 43), K(43, 47, 40, 42, 'NBC'), K(42, 46, 41, 44)].forEach(function (k) { sc.c.push(k); });
    sc.c.push(K(44, 57, 43, 56, spec.box === 'LD' ? 'LD break' : 'break'));
    var stay = [K(56, 59, 50, 53), K(53, 57, 49.5, 52), K(52, 58, 51, 57)];
    stay.forEach(function (k) { sc.c.push(k); });
    sc.c.push(K(57, 64, 56, 63)); sc.c.push(K(63, 70, 62, 69)); sc.c.push(K(69, 76, 68, 75));
    sc.zones.push({ x0: 2.6, x1: 99, y0: 40, y1: 47, cls: 'brk', label: 'broken box' });
    sc.marks.push({ x: 5, y: 57, t: 'tag', label: 'LD: close above the box', side: 1 });
    for (var i = 0; i < 3; i++) sc.marks.push({ x: 6 + i, y: sc.c[6 + i].l, t: 'num', label: String(i + 1), side: -1 });
    sc.notes.push({ x: 6, y: 36, text: '3 candles, no close back inside ✓' });
    sc.marks.push({ x: 9, y: 57, t: 'fill', label: 'enter at the 4th open', side: -1 });
    addRisk(sc, 57, 9, spec, 41);
    return sc;
  };
  B.open = function (spec) {
    var sc = B.wait3(spec); sc.marks = sc.marks.filter(function (m) { return m.t !== 'num' && m.t !== 'fill'; }); sc.notes = []; sc.lines = [];
    sc.marks.push({ x: 6, y: 56, t: 'fill', label: 'enter at the next open', side: 1 }); addRisk(sc, 56, 6, spec, 41); return sc;
  };
  B.open930 = function (spec) {
    var sc = { c: [], zones: [], lines: [], marks: [], notes: [] };
    [K(46, 54, 44, 52), K(52, 60, 49, 50), K(50, 55, 42, 44), K(44, 50, 41, 48), K(48, 58, 47, 55), K(55, 57, 49, 51)].forEach(function (k) { sc.c.push(k); });
    sc.c.push(K(51, 69, 50, 67, '09:30 BuBC'));
    sc.c.push(K(67, 72, 63, 70)); sc.c.push(K(70, 79, 69, 78)); sc.c.push(K(78, 86, 76, 84));
    sc.zones.push({ x0: -0.5, x1: 5.5, y0: 41, y1: 60, cls: 'range', label: 'pre-open 08:00–09:30' });
    sc.lines.push({ y: 60, x0: -0.5, x1: 9.5, cls: 'lvl', label: 'pre-open high', f: 1 });
    sc.marks.push({ x: 6, y: 69, t: 'tag', label: 'closes above the prev high', side: 1 });
    sc.notes.push({ x: 6.6, y: 62, text: '✓ and above the pre-open high', f: 1 });
    sc.marks.push({ x: 6, y: 67, t: 'fill', label: 'buy its close (09:45)', side: -1 });
    addRisk(sc, 67, 6.4, spec, 50);
    sc.notes.push({ x: 0, y: 8, text: 'early out: a 15m close below the 09:30 low' });
    return sc;
  };
  B.lvlT1 = function (spec) {
    var sc = { c: [], zones: [], lines: [], marks: [], notes: [] };
    [K(70, 72, 63, 64), K(64, 65, 56, 57), K(57, 58, 49, 50), K(50, 51, 41, 43, 'T1')].forEach(function (k) { sc.c.push(k); });
    sc.c.push(K(43, 52, 42, 51, 'CDL'));
    sc.c.push(K(51, 58, 50, 57)); sc.c.push(K(57, 59, 50, 52)); sc.c.push(K(52, 53, 40.6, 46));
    sc.c.push(K(46, 55, 45, 54)); sc.c.push(K(54, 63, 53, 62)); sc.c.push(K(62, 72, 61, 71));
    sc.lines.push({ y: 38, x0: -0.5, x1: 99, cls: 'lvl', label: 'level (PDL, Asia low, H1 GMC…)' });
    sc.marks.push({ x: 3, y: 41, t: 'touch', label: 'T1 within 15 pts of the level', side: -1 });
    sc.marks.push({ x: 4, y: 52, t: 'tag', label: '1m CDL: flips up', side: 1 });
    sc.lines.push({ y: 41, x0: 3, x1: 7, cls: 'lim', label: '' });
    sc.marks.push({ x: 7, y: 41, t: 'fill', label: 'buy limit at the T1 fills', side: -1 });
    addRisk(sc, 41, 7, spec, 30);
    sc.notes.push({ x: 0.2, y: 93, text: '15m trend ↑ (last flip = CDL)', f: 1, box: 1 });
    if (spec.v2) sc.notes.push({ x: 0, y: 8, text: '2-candle exit: close below T1 (V), then below V’s low → out' });
    timeBand(sc, 'CDL opens 09:30–11:59', 3.5);
    return sc;
  };
  B.tbreak = function (spec) {
    var sc = { c: [], zones: [], lines: [], marks: [], notes: [] };
    [K(14, 22, 13, 21), K(21, 26, 18, 20), K(20, 27, 19, 26), K(26, 36, 25, 35), K(35, 38, 31, 33), K(33, 39, 32, 37), K(37, 49, 36, 48), K(48, 51, 43, 45), K(45, 50, 44, 47)].forEach(function (k) { sc.c.push(k); });
    sc.c.push(K(47, 61, 46, 60, 'break'));
    if (spec.ent === 'mp') { sc.c.push(K(60, 62, 56.5, 58)); sc.c.push(K(58, 66, 57, 65)); sc.c.push(K(65, 74, 64, 73)); }
    else { sc.c.push(K(60, 66, 58, 65)); sc.c.push(K(65, 74, 64, 73)); }
    sc.zones.push({ x0: 0.6, x1: 2.6, y0: 18, y1: 27, cls: 'box2', label: 'P1' });
    sc.zones.push({ x0: 3.6, x1: 5.6, y0: 31, y1: 39, cls: 'box2', label: 'P2' });
    sc.zones.push({ x0: 6.6, x1: 9.5, y0: 43, y1: 51, cls: 'box', label: spec.tier === 'P5+' ? 'P5 box' : spec.tier === 'P1+' ? 'any P# box' : 'expander box' });
    sc.marks.push({ x: 9, y: 61, t: 'tag', label: (spec.tier || 'T3+') + ' break: close above the box', side: 1 });
    if (spec.ent === 'mp') {
      var mp = 46 + 0.75 * (61 - 46);
      sc.lines.push({ y: mp, x0: 9, x1: 10, cls: 'lim', label: '' });
      sc.marks.push({ x: 10, y: mp, t: 'fill', label: 'buy limit at MP (75% up the candle) fills', side: -1 });
      addRisk(sc, mp, 10, spec, 50);
    } else {
      sc.marks.push({ x: 9, y: 60, t: 'fill', label: 'enter at its close', side: -1 });
      addRisk(sc, 60, 9.4, spec, 50);
    }
    if (spec.filt === 'daily') sc.notes.push({ x: 0.2, y: 93, text: 'yesterday’s daily candle: green', f: 1, box: 1, candle: 1 });
    sessBand(sc, spec, 8.5);
    return sc;
  };
  B.gmc = function (spec) {
    var sc = { c: [], zones: [], lines: [], marks: [], notes: [] };
    [K(50, 53, 38, 41), K(41, 44, 35, 37), K(37, 40, 33, 39)].forEach(function (k) { sc.c.push(k); });
    sc.c.push(K(39, 48, 38, 47, 'c1')); sc.c.push(K(47, 58, 46, 57, 'c2'));
    sc.c.push(spec.afs ? K(57, 63, 53, 55, 'c3 AFs') : K(57, 62, 52, 60, 'c3'));
    var e = sc.c[5].c;
    sc.c.push(K(e, e + 6, e - 1, e + 5)); sc.c.push(K(e + 5, e + 12, e + 4, e + 11)); sc.c.push(K(e + 11, e + 17, e + 9, e + 16));
    sc.zones.push({ x0: 3, x1: 99, y0: 48, y1: spec.afs ? 53 : 52, cls: 'gap', label: 'GMC gap' });
    sc.marks.push({ x: 4, y: 58, t: 'tag', label: 'c2 closes above c1 high', side: 1 });
    if (spec.afs) sc.marks.push({ x: 5, y: 63, t: 'tag', label: 'new high, closes back inside c2', side: 1 });
    sc.marks.push({ x: 5, y: e, t: 'fill', label: 'enter at the c3 close', side: -1 });
    addRisk(sc, e, 5.4, spec, 46);
    if (spec.sx) sc.notes.push({ x: 0, y: 8, text: 'out at the next session open (02:00 · 08:00 · 09:30)' });
    if (spec.filt === 'daily' || spec.filt === 'daily1h') sc.notes.push({ x: 0.2, y: 93, text: spec.filt === 'daily1h' ? 'yesterday green + 1h box trend ↑' : 'yesterday’s daily candle: green', f: 1, box: 1, candle: 1 });
    sessBand(sc, spec, 2.5);
    return sc;
  };
  B.bcplus = function (spec) {
    var sc = { c: [], zones: [], lines: [], marks: [], notes: [] };
    [K(60, 62, 50, 52), K(52, 53, 44, 46), K(46, 48, 42, 44)].forEach(function (k) { sc.c.push(k); });
    sc.c.push(K(44, 56, 43, 55, 'BC+'));
    sc.c.push(K(55, 61, 54, 60)); sc.c.push(K(60, 66, 58, 65)); sc.c.push(K(65, 72, 64, 71));
    sc.marks.push({ x: 3, y: 56, t: 'tag', label: 'closes above the prev high, upper half, no new low', side: 1 });
    sc.marks.push({ x: 3, y: 55, t: 'fill', label: 'enter at its close', side: -1 });
    addRisk(sc, 55, 3.4, spec, 43);
    sc.notes.push({ x: 0.2, y: 93, text: 'yesterday green + 1h box trend ↑', f: 1, box: 1, candle: 1 });
    sessBand(sc, spec, 2.5);
    return sc;
  };
  B.lim75 = function (spec) {
    var sc = { c: [], zones: [], lines: [], marks: [], notes: [] };
    [K(40, 46, 39, 45), K(45, 48, 41, 42), K(42, 47, 40, 46), K(46, 48, 42, 43), K(43, 47, 41, 46)].forEach(function (k) { sc.c.push(k); });
    sc.c.push(K(46, 64, 45, 63, 'LDx break'));
    sc.c.push(K(63, 65, 58, 60)); sc.c.push(K(60, 61, 49.5, 53)); sc.c.push(K(53, 63, 52, 62)); sc.c.push(K(62, 70, 61, 69));
    sc.zones.push({ x0: -0.5, x1: 4.6, y0: 39, y1: 48, cls: 'box', label: 'contraction box' });
    var lim = 64 - 0.75 * (64 - 45);
    sc.lines.push({ y: lim, x0: 5, x1: 7, cls: 'lim', label: '' });
    sc.marks.push({ x: 5, y: 64, t: 'tag', label: (spec.tier ? spec.tier + ' ' : '') + 'break candle', side: 1 });
    sc.marks.push({ x: 7, y: lim, t: 'fill', label: 'limit 75% down the candle (MP) fills', side: -1 });
    addRisk(sc, lim, 7, spec, 40);
    if (spec.filt === 'daily') sc.notes.push({ x: 0.2, y: 93, text: 'yesterday’s daily candle: green', f: 1, box: 1, candle: 1 });
    sessBand(sc, spec, 5);
    return sc;
  };
  B.iblock = function (spec) {
    var sc = { c: [], zones: [], lines: [], marks: [], notes: [] };
    [K(20, 30, 19, 29), K(29, 33, 26, 31), K(31, 41, 30, 40), K(40, 44, 37, 42), K(42, 46, 41, 45), K(45, 57, 44, 56, 'T4 break')].forEach(function (k) { sc.c.push(k); });
    sc.c.push(K(56, 60, 52, 54)); sc.c.push(K(54, 55, 45.5, 48)); sc.c.push(K(48, 58, 47, 57)); sc.c.push(K(57, 66, 56, 65));
    sc.zones.push({ x0: 2.6, x1: 99, y0: 37, y1: 46, cls: 'box', label: 'iBlock (T4+)' });
    if (spec.ent === 'close') {
      sc.marks.push({ x: 5, y: 57, t: 'tag', label: 'block born', side: 1 });
      sc.marks.push({ x: 5, y: 56, t: 'fill', label: 'buy the close of that candle', side: -1 });
      addRisk(sc, 56, 5.4, spec, 46 - 12);
      return sc;
    }
    sc.lines.push({ y: 46, x0: 5, x1: 7, cls: 'lim', label: '' });
    sc.marks.push({ x: 5, y: 57, t: 'tag', label: 'block born: place the limit', side: 1 });
    sc.marks.push({ x: 7, y: 46, t: 'fill', label: 'buy limit at the block top (XP) fills', side: -1 });
    addRisk(sc, 46, 7, spec, 37);
    return sc;
  };
  B.htfpb = function (spec) {
    var sc = { c: [], zones: [], lines: [], marks: [], notes: [] };
    [K(62, 64, 54, 55), K(55, 56, 46, 48), K(48, 49, 40, 42)].forEach(function (k) { sc.c.push(k); });
    sc.c.push(K(42, 53, 41, 52, 'CDL')); sc.c.push(K(52, 58, 51, 57)); sc.c.push(K(57, 58, 49, 50, 'bear BC'));
    sc.c.push(K(50, 60, 49, 59, 'BuBC'));
    sc.c.push(K(59, 65, 58, 64)); sc.c.push(K(64, 71, 63, 70)); sc.c.push(K(70, 77, 69, 76));
    sc.marks.push({ x: 3, y: 53, t: 'tag', label: '15m CDL', side: 1 });
    sc.marks.push({ x: 5, y: 49, t: 'touch', label: 'pullback', side: -1 });
    sc.marks.push({ x: 6, y: 59, t: 'fill', label: 'enter at the BuBC close', side: 1 });
    addRisk(sc, 59, 6.4, spec, 48);
    sc.notes.push({ x: 0.2, y: 93, text: '4H: bull GMC touch + bullish AFs ✓', f: 1, box: 1 });
    sessBand(sc, spec, 5.5);
    return sc;
  };
  B.iblockafs = function (spec) {
    var sc = { c: [], zones: [], lines: [], marks: [], notes: [] };
    [K(72, 74, 64, 65), K(65, 66, 57, 58), K(58, 59, 51, 52), K(52, 53, 47, 48)].forEach(function (k) { sc.c.push(k); });
    sc.c.push(K(48, 52, 44, 51, 'AFs+'));
    sc.c.push(K(51, 58, 50, 57)); sc.c.push(K(57, 64, 56, 63)); sc.c.push(K(63, 69, 62, 68));
    sc.zones.push({ x0: -0.5, x1: 99, y0: 38, y1: 49, cls: 'box', label: 'iBlock (T2+)' });
    sc.marks.push({ x: 3, y: 47, t: 'touch', label: '1st touch', side: -1 });
    sc.marks.push({ x: 4, y: 52, t: 'tag', label: 'sweeps the prev low, closes back in the good half', side: 1 });
    sc.marks.push({ x: 4, y: 51, t: 'fill', label: 'enter at its close', side: -1 });
    addRisk(sc, 51, 4.4, spec, 44);
    sessBand(sc, spec, 2.5);
    return sc;
  };

  /* ---------- renderer ---------- */
  var W = 600, RM = 152, LM = 12;
  function render(spec, dir, filt) {
    var sc = (B[spec.t] || B.edge)(spec), bear = dir === 'short';
    var T = function (s) { return bear ? swapWords(s) : s; };
    var show = function (x) { return !x.f || filt; };
    var notes = sc.notes.filter(show), zones = sc.zones.filter(show), lines = sc.lines.filter(show), marks = sc.marks.filter(show);
    var chipsH = notes.length ? notes.length * 21 + 6 : 6, legend = [];
    zones.forEach(function (z) { if (z.label && !legend.some(function (l) { return l.t === z.label; })) legend.push({ cls: z.cls, t: z.label }); });
    var TM = chipsH + 14, PH = 236, BM = 34, H = TM + PH + BM;
    var n = sc.c.length, cw = (W - LM - RM) / n;
    var lo = 1e9, hi = -1e9;
    sc.c.forEach(function (k) { lo = Math.min(lo, k.l); hi = Math.max(hi, k.h); });
    lines.forEach(function (l) { lo = Math.min(lo, l.y); hi = Math.max(hi, l.y); });
    zones.forEach(function (z) { if (z.cls !== 'sess') { lo = Math.min(lo, z.y0); hi = Math.max(hi, z.y1); } });
    var pad = (hi - lo) * 0.06; lo -= pad; hi += pad;
    var X = function (i) { return LM + (i + 0.5) * cw; };
    var Y = function (p) { var q = (p - lo) / (hi - lo); if (bear) q = 1 - q; return TM + (1 - q) * PH; };
    var o = [], boxes = [];
    o.push('<rect x="0" y="0" width="' + W + '" height="' + H + '" class="pz-bg"/>');
    zones.forEach(function (z) {
      var x0 = z.x0 < 0 ? LM : X(z.x0) - cw / 2, x1 = z.x1 >= 99 ? W - RM + 2 : X(z.x1) + cw / 2;
      var ya, yb; if (z.cls === 'sess') { ya = TM - 4; yb = TM + PH + 4; } else { ya = Y(z.y0); yb = Y(z.y1); }
      var y = Math.min(ya, yb), h = Math.abs(ya - yb);
      o.push('<rect x="' + x0.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (x1 - x0).toFixed(1) + '" height="' + h.toFixed(1) + '" class="pz-' + z.cls + '"/>');
    });
    // right-side line labels, kept apart
    var rl = lines.filter(function (l) { return l.label; }).map(function (l) { return { y: Y(l.y), l: l }; }).sort(function (a, b) { return a.y - b.y; });
    for (var i = 1; i < rl.length; i++) if (rl[i].y - rl[i - 1].y < 13) rl[i].y = rl[i - 1].y + 13;
    lines.forEach(function (l) {
      var x0 = l.x0 == null || l.x0 < 0 ? LM : X(l.x0), x1 = l.x1 == null ? W - RM + 2 : Math.min(W - RM + 2, X(Math.min(l.x1, n - 0.5)));
      o.push('<line x1="' + x0.toFixed(1) + '" x2="' + x1.toFixed(1) + '" y1="' + Y(l.y).toFixed(1) + '" y2="' + Y(l.y).toFixed(1) + '" class="pl-' + l.cls + '"/>');
    });
    rl.forEach(function (r) { o.push('<text x="' + (W - RM + 8) + '" y="' + (r.y + 4).toFixed(1) + '" class="pt-' + r.l.cls + '">' + esc(T(r.l.label)) + '</text>'); });
    sc.c.forEach(function (k, i) {
      var x = X(i), up = bear ? k.c < k.o : k.c >= k.o, bw = Math.max(4, cw * 0.56);
      var yo = Y(k.o), yc = Y(k.c), top = Math.min(yo, yc), bh = Math.max(1.5, Math.abs(yo - yc));
      o.push('<line x1="' + x.toFixed(1) + '" x2="' + x.toFixed(1) + '" y1="' + Y(k.h).toFixed(1) + '" y2="' + Y(k.l).toFixed(1) + '" class="' + (up ? 'pw-up' : 'pw-dn') + '"/>');
      o.push('<rect x="' + (x - bw / 2).toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + bh.toFixed(1) + '" class="' + (up ? 'pc-up' : 'pc-dn') + '"/>');
      var yy = Math.min(Y(k.h), Y(k.l)), yz = Math.max(Y(k.h), Y(k.l));
      boxes.push({ x0: x - bw / 2 - 1, x1: x + bw / 2 + 1, y0: yy, y1: yz, c: 1 });
    });
    var tx = [];
    function clash(b) { return boxes.some(function (o2) { return !(b.x1 < o2.x0 || b.x0 > o2.x1 || b.y1 < o2.y0 || b.y0 > o2.y1); }); }
    marks.forEach(function (m) {
      var x = X(m.x), y = Y(m.y), s = bear ? -m.side : m.side;
      if (m.t === 'num') { o.push('<circle cx="' + x.toFixed(1) + '" cy="' + (y + (s > 0 ? -12 : 12)).toFixed(1) + '" r="8" class="pm-num"/><text x="' + x.toFixed(1) + '" y="' + (y + (s > 0 ? -8.5 : 15.5)).toFixed(1) + '" class="pt-num">' + m.label + '</text>'); boxes.push({ x0: x - 9, x1: x + 9, y0: y - 22, y1: y + 22 }); return; }
      if (m.t === 'fill') o.push('<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="5" class="pm-fill"/>');
      else if (m.t === 'touch') o.push('<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="4" class="pm-touch"/>');
      else if (m.t === 'half') o.push('<rect x="' + (x - 4).toFixed(1) + '" y="' + (y - 4).toFixed(1) + '" width="8" height="8" class="pm-half"/>');
      var label = T(m.label), w = label.length * 6.25 + 4;
      var anchor = x + w / 2 > W - RM ? 'end' : (x - w / 2 < LM ? 'start' : 'middle');
      var bx0 = anchor === 'end' ? x - w : anchor === 'start' ? x : x - w / 2;
      var ty = null;
      for (var k = 0; k < 7; k++) {
        var dy = (s > 0 ? -1 : 1) * (14 + k * 13) * (k % 2 === 1 && k > 2 ? -1 : 1), cand = y + dy + (s > 0 ? 0 : 6);
        if (cand < TM - 4 || cand > TM + PH + 12) continue;
        var bb = { x0: bx0, x1: bx0 + w, y0: cand - 10, y1: cand + 2 };
        if (!clash(bb)) { ty = cand; boxes.push(bb); break; }
      }
      if (ty == null) { ty = y + (s > 0 ? -14 : 20); boxes.push({ x0: bx0, x1: bx0 + w, y0: ty - 10, y1: ty + 2 }); }
      tx.push('<text x="' + x.toFixed(1) + '" y="' + ty.toFixed(1) + '" text-anchor="' + anchor + '" class="ph pt-' + (m.t === 'fill' ? 'fill' : m.t === 'touch' ? 'touch' : 'tag') + '">' + esc(label) + '</text>');
    });
    o = o.concat(tx);
    notes.forEach(function (t, i) {
      var y = 8 + i * 21, txt = T(t.text), w = Math.min(W - 24, 18 + txt.length * 6.25 * 1.3);
      o.push('<rect x="' + LM + '" y="' + y + '" width="' + w.toFixed(1) + '" height="17" rx="2" class="' + (t.f ? 'pz-chip' : 'pz-chip2') + '"/><text x="' + (LM + 7) + '" y="' + (y + 12.5) + '" class="pt-note' + (t.f ? ' f' : '') + '">' + esc(txt) + '</text>');
    });
    var lx = LM, ly = TM + PH + 22;
    legend.forEach(function (l) {
      var txt = T(l.t), w = 16 + txt.length * 6.25 + 14;
      if (lx + w > W - 4) { return; }
      o.push('<rect x="' + lx + '" y="' + (ly - 9) + '" width="11" height="11" class="pz-' + l.cls + '"/><text x="' + (lx + 16) + '" y="' + ly + '" class="pt-' + l.cls + '">' + esc(txt) + '</text>');
      lx += w;
    });
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" class="pic" aria-label="' + esc((bear ? 'Short' : 'Long') + ' example of ' + (spec.code || 'the setup') + (filt ? ', filter on' : ', filter off')) + '">' + o.join('') + '</svg>';
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function hasFilter(spec) {
    var sc = (B[spec.t] || B.edge)(spec);
    return sc.zones.concat(sc.lines, sc.marks, sc.notes).some(function (x) { return x.f; });
  }
  window.MMMPics = { render: render, hasFilter: hasFilter, swapWords: swapWords };
})();
