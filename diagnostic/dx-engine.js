// MMM Trader Profile Assessment - scoring engine.
// DX.score(answers, tr) -> payload saved to the journal. answers: { id: index }.
//   profile + scenario ids -> chosen option index; behavior items -> 0..4 (Never..Always).
DX.TXT = {
  gapHead: 'Knowing vs doing',
  gapBody: "Your scenario answer was sound, but your day-to-day habits don't follow it.",
  blindHead: 'Blind spot',
  blindBody: 'The problem you named is not where your answers show the biggest leak.',
  awareHead: 'Good self-awareness',
  awareBody: 'The problem you named matches what your answers show.',
  perfectHead: 'Possibly too perfect',
  perfectBody: 'Almost every answer is the ideal one. Real traders break rules sometimes, so re-check that you answered how you actually trade.',
  patternHead: 'Pattern answering',
  patternBody: 'Many of your answers are identical, even where the statements point in opposite directions. Your result is less reliable.',
  expHead: 'Experience is not discipline',
  expBody: 'Years in the market have not turned into consistent habits. Structure, not time, is what fixes this.',
  edgeHead: 'Discipline may not be your only problem',
  edgeBody: 'Your habits look solid but your results are negative. Check your strategy edge and expectancy in the journal statistics.',
  luckHead: 'Profitable despite loose habits',
  luckBody: 'You are making money while breaking rules. That is fragile: one bad streak can wipe out the edge.',
  conf: ['Low confidence', 'Medium confidence', 'High confidence'],
  cons: ['Many contradictions', 'Some contradictions', 'Mostly consistent', 'Highly consistent']
};

DX.catByKey = function (k) { for (var i = 0; i < DX.CATS.length; i++) if (DX.CATS[i].key === k) return DX.CATS[i]; return null; };

DX.levelIdx = function (p) { return p >= 80 ? 3 : p >= 60 ? 2 : p >= 40 ? 1 : 0; };

DX.score = function (ans, tr) {
  tr = tr || function (t) { return t; };
  var g = {}, i;
  DX.ITEMS.forEach(function (it) { var v = ans[it.id]; g[it.id] = it.pos ? v : 4 - v; });
  var scen = {};
  DX.SCENARIOS.forEach(function (s) { scen[s.id] = s; g[s.id] = s.opts[ans[s.id]].g; });
  var item = {};
  DX.ITEMS.forEach(function (it) { item[it.id] = it; });

  // ---- category scores: 5 behavior items + 1 scenario (double weight) ----
  var cats = DX.CATS.map(function (c) {
    var sum = 0, n = 0, scaleSum = 0;
    DX.ITEMS.forEach(function (it) { if (it.cat === c.key) { sum += g[it.id]; scaleSum += g[it.id]; n++; } });
    var sc = 0;
    DX.SCENARIOS.forEach(function (s) { if (s.cat === c.key) sc = g[s.id]; });
    var pct = Math.round(100 * (sum + 2 * sc) / (4 * (n + 2)));
    var scalePct = Math.round(100 * scaleSum / (4 * n));
    var scenPct = Math.round(100 * sc / 4);
    return { key: c.key, name: c.name, pct: pct, scalePct: scalePct, scenPct: scenPct };
  });
  var overall = Math.round(cats.reduce(function (s, c) { return s + c.pct; }, 0) / cats.length);
  var band = overall >= 80 ? 'Tight Discipline' : overall >= 60 ? 'Developing Discipline' : overall >= 40 ? 'Leaking Edge' : 'Critical Leak';
  var sorted = cats.slice().sort(function (a, b) { return a.pct - b.pct; });
  var weakest = sorted[0], strongest = sorted[sorted.length - 1];

  // ---- consistency: do paired answers agree? ----
  var penalty = 0, contra = [];
  var ansLabel = function (id) { return scen[id] ? scen[id].opts[ans[id]].t : DX.SCALE[ans[id]]; };
  var textOf = function (id) { return scen[id] ? scen[id].text : item[id].text; };
  DX.PAIRS.forEach(function (p) {
    var gap = Math.abs(g[p[0]] - g[p[1]]);
    if (gap >= 3) { penalty += 1; contra.push({ gap: gap, a: p[0], b: p[1] }); }
    else if (gap === 2) penalty += 0.35;
  });
  var consistency = Math.max(0, Math.round(100 * (1 - penalty / DX.PAIRS.length)));
  var consIdx = consistency >= 85 ? 3 : consistency >= 70 ? 2 : consistency >= 50 ? 1 : 0;
  contra.sort(function (a, b) { return b.gap - a.gap; });
  var contradictions = contra.slice(0, 4).map(function (c) {
    return { a: tr(textOf(c.a)), aAns: tr(ansLabel(c.a)), b: tr(textOf(c.b)), bAns: tr(ansLabel(c.b)) };
  });

  // ---- answer-quality checks ----
  var itemMean = DX.ITEMS.reduce(function (s, it) { return s + g[it.id]; }, 0) / DX.ITEMS.length;
  var scenMean = DX.SCENARIOS.reduce(function (s, x) { return s + g[x.id]; }, 0) / DX.SCENARIOS.length;
  var tooPerfect = itemMean >= 3.7 && scenMean >= 3.5;
  var counts = {};
  DX.ITEMS.forEach(function (it) { counts[ans[it.id]] = (counts[ans[it.id]] || 0) + 1; });
  var maxSame = Math.max.apply(null, Object.keys(counts).map(function (k) { return counts[k]; }));
  var pattern = maxSame >= Math.round(DX.ITEMS.length * 0.7);
  var confIdx = (pattern || consistency < 50) ? 0 : (tooPerfect || consistency < 70) ? 1 : 2;

  // ---- archetype ----
  var minCat = sorted[0].pct;
  var primary;
  if (overall >= 85 && minCat >= 70 && consistency >= 75) primary = 'disciplined';
  else if (consistency < 50 && overall < 80) primary = 'inconsistent';
  else primary = weakest.key;
  var secondKey = sorted[1].key;
  var secondary = (primary === 'disciplined') ? null : (primary === 'inconsistent' ? weakest.key : (sorted[1].pct < 75 ? secondKey : null));

  // ---- risk of blowing up: risk, stops and revenge combined ----
  var riskPct = Math.round(['RM', 'SE', 'RR'].reduce(function (s, k) { return s + cats.filter(function (c) { return c.key === k; })[0].pct; }, 0) / 3);
  var riskIdx = riskPct >= 80 ? 3 : riskPct >= 60 ? 2 : riskPct >= 40 ? 1 : 0;

  // ---- profile + self-perception ----
  var prof = DX.PROFILE.map(function (q) { return { id: q.id, q: tr(q.text), a: tr(q.opts[ans[q.id]]), idx: ans[q.id] }; });
  var selfQ = DX.PROFILE[DX.PROFILE.length - 1];
  var selfKey = selfQ.cats[ans.self];
  var weakest3 = sorted.slice(0, 3).map(function (c) { return c.key; });
  var selfCat = DX.catByKey(selfKey);

  // ---- insights ----
  var T = DX.TXT, ins = [];
  cats.forEach(function (c) {
    if (c.scenPct - c.scalePct >= 30 && c.scalePct < 70) ins.push({ kind: 'gap', head: tr(T.gapHead), body: tr(T.gapBody), chips: [tr(c.name)] });
  });
  ins = ins.slice(0, 2);
  if (weakest3.indexOf(selfKey) === -1) ins.push({ kind: 'blind', head: tr(T.blindHead), body: tr(T.blindBody), chips: [tr(selfCat.name), tr(weakest.name)] });
  else ins.push({ kind: 'aware', head: tr(T.awareHead), body: tr(T.awareBody), chips: [tr(selfCat.name)] });
  if (ans.exp === 3 && overall < 50) ins.push({ kind: 'exp', head: tr(T.expHead), body: tr(T.expBody) });
  if (ans.res >= 2 && overall >= 75) ins.push({ kind: 'edge', head: tr(T.edgeHead), body: tr(T.edgeBody) });
  if (ans.res === 0 && overall < 50) ins.push({ kind: 'luck', head: tr(T.luckHead), body: tr(T.luckBody) });
  if (tooPerfect) ins.push({ kind: 'perfect', head: tr(T.perfectHead), body: tr(T.perfectBody) });
  if (pattern) ins.push({ kind: 'pattern', head: tr(T.patternHead), body: tr(T.patternBody) });

  // ---- fix plan: the weakest categories below 80, max 3 ----
  var need = sorted.filter(function (c) { return c.pct < 80; }).slice(0, 3);
  if (!need.length) need = [sorted[0]];
  var fixPlan = need.map(function (c) {
    var f = DX.FIXES[c.key];
    return { cat: c.name, label: tr(c.name), pct: c.pct, title: tr(f.title), steps: f.steps.map(tr) };
  });

  // ---- what to watch: worst answers ----
  var bad = [];
  DX.ITEMS.forEach(function (it) { if (g[it.id] <= 1) bad.push({ g: g[it.id], cat: it.cat, text: tr(it.text), ans: tr(DX.SCALE[ans[it.id]]) }); });
  DX.SCENARIOS.forEach(function (s) { if (g[s.id] <= 1) bad.push({ g: g[s.id], cat: s.cat, text: tr(s.text), ans: tr(s.opts[ans[s.id]].t) }); });
  var catPctByKey = {}; cats.forEach(function (c) { catPctByKey[c.key] = c.pct; });
  bad.sort(function (a, b) { return a.g - b.g || catPctByKey[a.cat] - catPctByKey[b.cat]; });
  var flags = bad.slice(0, 8).map(function (b) { return { text: b.text, ans: b.ans }; });

  var strengths = cats.slice().sort(function (a, b) { return b.pct - a.pct; }).filter(function (c) { return c.pct >= 70; }).slice(0, 3).map(function (c) { return tr(c.name); });
  var arch = DX.ARCHETYPES[primary];
  return {
    v: 2, score: overall, band: band, bandLabel: tr(band),
    archetype: arch.label, archetypeLabel: tr(arch.label), archetypeNote: tr(arch.note),
    secondaryLabel: secondary ? tr(DX.ARCHETYPES[secondary].label) : '',
    strongest: strongest.name, strongestLabel: tr(strongest.name), strongestPct: strongest.pct,
    weakest: weakest.name, weakestLabel: tr(weakest.name), weakestPct: weakest.pct,
    cats: cats.map(function (c) { return { name: c.name, label: tr(c.name), pct: c.pct, level: DX.LEVELS[DX.levelIdx(c.pct)], levelLabel: tr(DX.LEVELS[DX.levelIdx(c.pct)]), scalePct: c.scalePct, scenPct: c.scenPct }; }),
    consistency: { score: consistency, label: tr(T.cons[consIdx]), idx: consIdx },
    confidence: { idx: confIdx, label: tr(T.conf[confIdx]) },
    risk: { pct: riskPct, idx: riskIdx, label: tr(DX.RISK[riskIdx]) },
    insights: ins, contradictions: contradictions, fixPlan: fixPlan, strengths: strengths,
    flags: flags, profile: prof, selfLabel: tr(selfCat.name)
  };
};

if (typeof module !== 'undefined') module.exports = DX;
