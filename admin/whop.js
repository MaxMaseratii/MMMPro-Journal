/* Admin · Whop tab · live "Whop Control" (MiniMax OS).
   Reads and edits your Whop store through the MiniMax OS engine (window.MMM_ENGINE_URL),
   which holds the Whop API key; every call carries your admin Firebase login.
   Edit product names, headlines, descriptions and visibility; create, pause and restart promo codes;
   see 30-day money, failed renewals and the latest payments. The data.json charts stay below. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var BASE = String(window.MMM_ENGINE_URL || '').replace(/\/+$/, '');
  var D = null, SEL = null, started = false, ARM = {};
  var usd = function (n) { return n == null ? '—' : '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }); };
  var when = function (d) { return d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' ' + new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ''; };

  var CSS = [
    '#wlive{display:grid;gap:14px;margin-bottom:22px;--jc:#3ee8ff}',
    '#wlive [hidden]{display:none!important}',
    '#wlive>*,#wlive .g2>*,#wlive .ks>*{min-width:0}#wlive .st span{overflow-wrap:anywhere}',
    '@media (max-width:560px){#wlive .ks{grid-template-columns:1fr 1fr}#wlive .wp{padding:14px}}',
    '#wlive .wp{position:relative;border:1px solid var(--rule);border-radius:6px;padding:16px 18px;background:var(--hud),var(--sheet)}',
    '#wlive .lb{font:600 10.5px/1 "JetBrains Mono",monospace;letter-spacing:.18em;text-transform:uppercase;color:var(--mute)}',
    '#wlive .lb b{color:var(--jc)}',
    '#wlive .top{display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;justify-content:space-between}',
    '#wlive .top h2{margin:6px 0 0;font:700 18px var(--sans);letter-spacing:.12em;text-transform:uppercase;color:#effcff}',
    '#wlive .st{display:flex;flex-wrap:wrap;gap:6px 16px;font:600 11px "JetBrains Mono",monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}',
    '#wlive .st b{color:#effcff;font-weight:600}#wlive .st .ok{color:var(--win)}',
    '#wlive .ks{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}',
    '#wlive .k{border:1px solid var(--rule);border-radius:6px;padding:12px 14px;background:var(--hud),var(--sheet)}',
    '#wlive .k b{display:block;font:700 24px/1.1 "JetBrains Mono",monospace;color:#f1fdff;text-shadow:0 0 16px rgba(62,232,255,.25)}',
    '#wlive .k span{display:block;margin-top:6px;font:600 10.5px "JetBrains Mono",monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}',
    '#wlive .k.bad b{color:var(--loss);text-shadow:0 0 16px rgba(255,93,108,.35)}#wlive .k.good b{color:var(--win)}',
    '#wlive .g2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:14px;align-items:start}',
    '@media (max-width:1050px){#wlive .g2{grid-template-columns:1fr}}',
    '#wlive .prods{display:grid;gap:8px;max-height:640px;overflow:auto;padding-right:4px}',
    '#wlive .pc{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 10px;text-align:left;width:100%;cursor:pointer;color:var(--ink);background:rgba(2,8,12,.6);border:1px solid var(--rule);border-radius:6px;padding:10px 12px;transition:border-color .15s,box-shadow .15s}',
    '#wlive .pc:hover{border-color:var(--rule2)}#wlive .pc[aria-pressed=true]{border-color:var(--jc);box-shadow:0 0 18px -6px var(--jc)}',
    '#wlive .pc .t{font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '#wlive .pc .p{font:600 12px "JetBrains Mono",monospace;color:var(--jc);white-space:nowrap}',
    '#wlive .pc .h{grid-column:1/3;font-size:12.5px;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '#wlive .pc .m{grid-column:1/3;display:flex;gap:8px;align-items:center;font:600 10.5px "JetBrains Mono",monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--faint)}',
    '#wlive .vz{padding:2px 6px;border-radius:3px;font:700 10px "JetBrains Mono",monospace;letter-spacing:.1em}',
    '#wlive .vz.visible{color:var(--win);background:rgba(54,241,161,.12)}#wlive .vz.hidden{color:var(--amber);background:rgba(255,178,62,.12)}#wlive .vz.archived{color:var(--faint);background:rgba(255,255,255,.05)}',
    '#wlive label.f{display:block;margin-top:12px}#wlive label.f>span{display:flex;justify-content:space-between;font:600 10.5px "JetBrains Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin-bottom:5px}',
    '#wlive label.f>span i{font-style:normal;color:var(--faint)}#wlive label.f>span i.over{color:var(--loss)}',
    '#wlive input.in,#wlive textarea.in,#wlive select.in{width:100%;box-sizing:border-box;background:rgba(2,8,12,.85);color:var(--ink);border:1px solid var(--rule2);border-radius:5px;padding:9px 10px;font:14px var(--sans)}',
    '#wlive textarea.in{min-height:190px;resize:vertical;line-height:1.55}',
    '#wlive .in:focus{outline:0;border-color:var(--jc);box-shadow:0 0 0 3px rgba(62,232,255,.12)}',
    '#wlive .seg3{display:inline-flex;gap:4px}#wlive .seg3 button{font:600 11px "JetBrains Mono",monospace;letter-spacing:.1em;text-transform:uppercase;background:transparent;color:var(--mute);border:1px solid var(--rule2);border-radius:4px;padding:7px 10px;cursor:pointer}',
    '#wlive .seg3 button[aria-pressed=true]{background:var(--jc);border-color:var(--jc);color:#02131a}',
    '#wlive .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:14px}',
    '#wlive .price{margin-top:8px;font:12.5px "JetBrains Mono",monospace;color:var(--mute)}#wlive .price b{color:var(--jc)}',
    '#wlive table{width:100%;border-collapse:collapse;font-size:13px}#wlive th{text-align:left;font:600 10.5px "JetBrains Mono",monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);padding:8px;border-bottom:1px solid var(--rule2)}',
    '#wlive td{padding:8px;border-bottom:1px solid var(--rule);vertical-align:top}#wlive td.n{font-family:"JetBrains Mono",monospace;text-align:right;white-space:nowrap}',
    '#wlive tr:hover td{background:rgba(62,232,255,.04)}#wlive .tw{overflow-x:auto}',
    '#wlive .sub{display:block;color:var(--mute);font-size:12px}#wlive .bad{color:var(--loss)}#wlive .ok{color:var(--win)}#wlive .dim{color:var(--faint)}',
    '#wlive .mk{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;align-items:end;margin-top:12px}',
    '#wlive .mk label{display:block;font:600 10.5px "JetBrains Mono",monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--mute)}',
    '#wlive .mk .chk{display:flex;gap:6px;align-items:center;font:13px var(--sans);text-transform:none;letter-spacing:0;color:var(--ink)}',
    '#wlive .err{color:var(--loss);font:12.5px "JetBrains Mono",monospace}',
    '#wlive .setup ol{margin:8px 0 0;padding-left:20px;line-height:1.7;color:#cfe3e9;font-size:14px}#wlive .setup code{font:12.5px "JetBrains Mono",monospace;color:var(--jc)}',
    '#wlive .empty{color:var(--mute);font:12.5px "JetBrains Mono",monospace;padding:14px 0}'
  ].join('\n');

  function user() { return window.MMM && window.MMM.user && window.MMM.user(); }
  function api(path, body) {
    var u = user();
    if (!u) return Promise.reject(new Error('Log in first.'));
    return u.getIdToken().then(function (tok) {
      return fetch(BASE + '/api' + path, { method: body ? 'POST' : 'GET', headers: Object.assign({ Authorization: 'Bearer ' + tok }, body ? { 'Content-Type': 'application/json' } : {}), body: body ? JSON.stringify(body) : undefined });
    }).then(function (r) { return r.json().catch(function () { return { ok: false, error: 'The engine answered ' + r.status }; }); })
      .then(function (j) { if (!j.ok) throw new Error(j.error || 'Something went wrong.'); return j; });
  }
  function toast(t) { var el = document.createElement('div'); el.className = 'toast'; el.textContent = t; document.body.appendChild(el); setTimeout(function () { el.remove(); }, 2400); }
  function sk(n) { var s = ''; for (var i = 0; i < n; i++) s += '<div class="jv-sk" style="width:' + (55 + (i * 17) % 40) + '%"></div>'; return s; }
  function priceText(p) {
    if (!p) return 'No price set';
    if (p.billing === 'renewal') return usd(p.renewal) + ' every ' + (p.period_days || '?') + ' days' + (p.initial && p.initial !== p.renewal ? ' (first payment ' + usd(p.initial) + ')' : '') + (p.trial_days ? ' · ' + p.trial_days + '-day trial' : '');
    return (p.initial ? usd(p.initial) : 'Free') + ' one time';
  }
  function short(p) { return !p ? '—' : p.billing === 'renewal' ? usd(p.renewal) + '/' + (p.period_days === 30 ? 'mo' : p.period_days + 'd') : p.initial ? usd(p.initial) : 'FREE'; }

  function shell() {
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var box = document.createElement('div'); box.id = 'wlive';
    $('whop').insertBefore(box, $('whop').firstChild);
    box.innerHTML =
      '<div class="wp top"><div><div class="lb">// whop control · <b>live</b></div><h2>Store · Max Maserati</h2></div>' +
      '<div class="st" id="wvSt"><span>Connecting…</span></div>' +
      '<div class="row" style="margin:0"><button class="btn" type="button" id="wvSync">Sync</button><a class="btn" href="https://whop.com/dashboard/" target="_blank" rel="noopener">Whop dashboard</a></div></div>' +
      '<div id="wvBody"><div class="wp">' + sk(6) + '</div></div>';
    $('wvSync').onclick = function () { load(true); };
  }

  function load(fresh) {
    $('wvSync').disabled = true;
    return api('/whop/overview' + (fresh ? '?fresh=1' : '')).then(function (j) {
      if (!j.ready) return setup();
      D = j; draw(); if (fresh) toast('Whop synced');
    }).catch(function (e) {
      $('wvBody').innerHTML = '<div class="wp"><div class="err">' + esc(e.message) + '</div></div>';
      $('wvSt').innerHTML = '<span class="bad">Offline</span>';
    }).finally(function () { $('wvSync').disabled = false; });
  }

  function setup() {
    $('wvSt').innerHTML = '<span class="bad">Not connected</span>';
    $('wvBody').innerHTML = '<div class="wp setup"><div class="lb">// connect whop · one time</div><ol>' +
      '<li>Open <a href="https://whop.com/dashboard/developer" target="_blank" rel="noopener">whop.com/dashboard/developer</a> on your <b>Max Maserati</b> business.</li>' +
      '<li>Create an <b>API key</b>. Give it read on products, plans, payments, members and promo codes, and write on products and promo codes.</li>' +
      '<li>In Render → <b>minimax-engine</b> → Environment, add <code>WHOP_API_KEY</code> with that key, then Save.</li>' +
      '<li>Come back here and press <b>Sync</b>.</li></ol></div>';
  }

  function draw() {
    var k = D.kpis;
    $('wvSt').innerHTML = '<span><b class="ok">● Online</b></span><span>Synced <b>' + esc(when(D.fetched_at)) + '</b></span><span>' + esc(D.account) + '</span>';
    $('wvBody').innerHTML =
      '<div class="ks">' +
        kpi(usd(k.revenue_30d), 'Revenue · 30 days', 'good') + kpi(k.paid_30d, 'Paid sales · 30 days') + kpi(k.free_joins_30d, 'Free joins · 30 days') +
        kpi(k.at_risk_count ? usd(k.at_risk_usd) : '$0', k.at_risk_count + ' failed renewals', k.at_risk_count ? 'bad' : '') +
        kpi(k.members, 'Members (all products)') + kpi(k.visible_products, 'Products on sale') + kpi(k.active_promos, 'Active promo codes') +
      '</div>' +
      '<div class="g2"><section class="wp" id="wvProducts"><div class="lb">// products · click to edit</div><div class="prods" id="wvList" style="margin-top:12px"></div></section>' +
      '<section class="wp" id="wvEdit"></section></div>' +
      '<section class="wp" id="wvRisk"><div class="lb">// money at risk · failed renewals Whop will retry</div><div class="tw" id="wvRiskT"></div></section>' +
      '<section class="wp" id="wvPromos"><div class="lb">// promo codes</div>' +
        '<div class="mk"><div><label for="wvCode">Code</label><input class="in" id="wvCode" placeholder="BLACKFRIDAY30" maxlength="40" autocomplete="off" spellcheck="false" style="text-transform:uppercase"></div>' +
        '<div><label for="wvType">Type</label><select class="in" id="wvType"><option value="percentage">% off</option><option value="flat_amount">$ off</option></select></div>' +
        '<div><label for="wvAmt">Amount</label><input class="in" id="wvAmt" type="number" min="1" step="1" value="20"></div>' +
        '<div><label for="wvMonths">Months it lasts</label><input class="in" id="wvMonths" type="number" min="1" max="36" value="1"></div>' +
        '<div><label for="wvProd">Product</label><select class="in" id="wvProd"><option value="">All products</option>' + D.products.filter(function (p) { return p.visibility !== 'archived'; }).map(function (p) { return '<option value="' + esc(p.id) + '">' + esc(p.title) + '</option>'; }).join('') + '</select></div>' +
        '<div><label for="wvStock">Max uses (0 = no limit)</label><input class="in" id="wvStock" type="number" min="0" value="0"></div>' +
        '<div><label class="chk"><input type="checkbox" id="wvNew"> New customers only</label></div>' +
        '<div><button class="btn gold" type="button" id="wvMake">Create code</button></div></div>' +
        '<div class="err" id="wvPErr" style="margin-top:8px"></div><div class="tw" id="wvPromoT" style="margin-top:10px"></div></section>' +
      '<section class="wp"><div class="lb">// latest payments · 30 days</div><div class="tw" id="wvPayT"></div></section>';
    drawList(); drawEdit(); drawRisk(); drawPromos(); drawPays();
    $('wvMake').onclick = makePromo;
    $('wvList').onclick = function (e) { var b = e.target.closest('[data-id]'); if (!b) return; SEL = b.dataset.id; drawList(); drawEdit(); if (window.innerWidth < 1050) $('wvEdit').scrollIntoView({ behavior: 'smooth' }); };
  }
  function kpi(v, l, c) { return '<div class="k ' + (c || '') + '"><b>' + esc(v) + '</b><span>' + esc(l) + '</span></div>'; }

  function drawList() {
    if (!SEL && D.products.length) SEL = D.products[0].id;
    $('wvList').innerHTML = D.products.map(function (p) {
      return '<button type="button" class="pc" data-id="' + esc(p.id) + '" aria-pressed="' + (SEL === p.id) + '"><span class="t">' + esc(p.title) + '</span><span class="p">' + esc(short(p.price)) + '</span>' +
        '<span class="h">' + esc(p.headline || 'No headline') + '</span><span class="m"><span class="vz ' + esc(p.visibility) + '">' + esc(p.visibility) + '</span>' + p.members + ' members</span></button>';
    }).join('') || '<div class="empty">No products.</div>';
  }

  function drawEdit() {
    var p = D.products.filter(function (x) { return x.id === SEL; })[0];
    var box = $('wvEdit');
    if (!p) { box.innerHTML = '<div class="lb">// editor</div><div class="empty">Pick a product.</div>'; return; }
    box.innerHTML = '<div class="lb">// editor · ' + esc(p.id) + '</div>' +
      '<div class="price">Price <b>' + esc(priceText(p.price)) + '</b> · ' + p.members + ' members' + (p.reviews ? ' · ' + p.reviews + ' reviews (' + p.rating.toFixed(1) + '★)' : '') + '</div>' +
      field('Title', 'wvT', p.title, 80) + field('Headline', 'wvH', p.headline, 80) +
      '<label class="f"><span>Description <i id="wvDc"></i></span><textarea class="in" id="wvD" maxlength="1500">' + esc(p.description) + '</textarea></label>' +
      '<label class="f"><span>Who can see it</span></label><div class="seg3" id="wvV">' + ['visible', 'hidden', 'archived'].map(function (v) { return '<button type="button" data-v="' + v + '" aria-pressed="' + (p.visibility === v) + '">' + v + '</button>'; }).join('') + '</div>' +
      '<div class="row"><button class="btn gold" type="button" id="wvSave">Save to Whop</button><button class="btn" type="button" id="wvReset">Undo changes</button><span class="err" id="wvErr"></span></div>' +
      '<p class="dim" style="font-size:12.5px;margin:10px 0 0">Prices are changed in the Whop dashboard. Saving here updates the product page right away.</p>';
    var counters = [['wvT', 80], ['wvH', 80], ['wvD', 1500]];
    counters.forEach(function (c) {
      var el = $(c[0]), out = $(c[0] + 'c');
      var upd = function () { out.textContent = el.value.length + ' / ' + c[1]; out.className = el.value.length > c[1] ? 'over' : ''; };
      el.addEventListener('input', upd); upd();
    });
    var vis = p.visibility;
    $('wvV').onclick = function (e) { var b = e.target.closest('[data-v]'); if (!b) return; vis = b.dataset.v; [].forEach.call($('wvV').children, function (x) { x.setAttribute('aria-pressed', String(x.dataset.v === vis)); }); };
    $('wvReset').onclick = drawEdit;
    $('wvSave').onclick = function () {
      var f = {}, t = $('wvT').value.trim(), h = $('wvH').value.trim(), d = $('wvD').value;
      if (t !== p.title) f.title = t;
      if (h !== (p.headline || '')) f.headline = h;
      if (d !== (p.description || '')) f.description = d;
      if (vis !== p.visibility) f.visibility = vis;
      if (!Object.keys(f).length) { $('wvErr').textContent = 'Nothing changed.'; return; }
      if (f.visibility === 'archived' && !ARM[p.id]) { ARM[p.id] = true; $('wvErr').textContent = 'Archiving takes it off sale. Press Save again to confirm.'; return; }
      delete ARM[p.id];
      var b = $('wvSave'); b.disabled = true; b.textContent = 'Saving…'; $('wvErr').textContent = '';
      api('/whop/product', { id: p.id, fields: f }).then(function (j) {
        Object.assign(p, j.product); toast('Saved to Whop'); drawList(); drawEdit();
      }).catch(function (e) { $('wvErr').textContent = e.message; b.disabled = false; b.textContent = 'Save to Whop'; });
    };
  }
  function field(label, id, val, max) { return '<label class="f"><span>' + label + ' <i id="' + id + 'c"></i></span><input class="in" id="' + id + '" maxlength="' + max + '" value="' + esc(val) + '"></label>'; }

  function drawRisk() {
    var r = D.at_risk;
    $('wvRiskT').innerHTML = r.length ? '<table><thead><tr><th>Customer</th><th>Product</th><th>Why it failed</th><th>Next try</th><th style="text-align:right">Amount</th></tr></thead><tbody>' + r.map(function (p) {
      return '<tr><td>' + esc(p.customer) + '<span class="sub">' + esc(p.email) + '</span></td><td>' + esc(p.product) + '</td><td class="bad">' + esc(p.failure || p.substatus) + '<span class="sub">' + p.failed_tries + ' failed tries · ' + esc(p.method) + '</span></td><td>' + esc(when(p.next_retry)) + '</td><td class="n">' + usd(p.usd) + '</td></tr>';
    }).join('') + '</tbody></table>' : '<div class="empty ok">No failed renewals. Every card went through.</div>';
  }

  function drawPromos() {
    var pc = D.promos;
    $('wvPromoT').innerHTML = pc.length ? '<table><thead><tr><th>Code</th><th>Discount</th><th>For</th><th>Uses</th><th>Status</th><th></th></tr></thead><tbody>' + pc.map(function (c) {
      var off = c.type === 'percentage' ? Math.round(c.amount_off * 100) + '% off' : usd(c.amount_off) + ' off';
      return '<tr><td><b style="font-family:\'JetBrains Mono\',monospace">' + esc(c.code) + '</b><span class="sub">' + esc(when(c.created_at)) + '</span></td><td>' + esc(off) + '<span class="sub">' + (c.months > 1 ? c.months + ' months' : 'first payment') + '</span></td>' +
        '<td>' + esc(c.product || 'All products') + (c.new_users_only ? '<span class="sub">new customers only</span>' : '') + '</td><td class="n">' + c.uses + (c.stock ? ' / ' + c.stock : '') + '</td>' +
        '<td class="' + (c.status === 'active' ? 'ok' : 'dim') + '">' + esc(c.status) + '</td><td><button class="btn" type="button" data-pid="' + esc(c.id) + '" data-on="' + (c.status !== 'active') + '">' + (c.status === 'active' ? 'Pause' : 'Turn on') + '</button></td></tr>';
    }).join('') + '</tbody></table>' : '<div class="empty">No promo codes yet.</div>';
    $('wvPromoT').onclick = function (e) {
      var b = e.target.closest('[data-pid]'); if (!b) return;
      b.disabled = true;
      api('/whop/promo/state', { id: b.dataset.pid, on: b.dataset.on === 'true' }).then(function (j) {
        D.promos = D.promos.map(function (c) { return c.id === j.promo.id ? j.promo : c; });
        D.kpis.active_promos = D.promos.filter(function (c) { return c.status === 'active'; }).length;
        drawPromos(); toast(j.promo.status === 'active' ? 'Code is on' : 'Code paused');
      }).catch(function (e) { toast(e.message); b.disabled = false; });
    };
  }

  function makePromo() {
    var body = { code: $('wvCode').value.trim().toUpperCase(), type: $('wvType').value, amount: Number($('wvAmt').value), months: Number($('wvMonths').value), product_id: $('wvProd').value || null, stock: Number($('wvStock').value), new_users_only: $('wvNew').checked };
    var b = $('wvMake'); b.disabled = true; $('wvPErr').textContent = '';
    api('/whop/promo', body).then(function (j) {
      D.promos.unshift(j.promo); D.kpis.active_promos++;
      drawPromos(); $('wvCode').value = ''; toast('Code ' + j.promo.code + ' is live');
    }).catch(function (e) { $('wvPErr').textContent = e.message; }).finally(function () { b.disabled = false; });
  }

  function drawPays() {
    var p = D.payments;
    $('wvPayT').innerHTML = p.length ? '<table><thead><tr><th>When</th><th>Customer</th><th>Product</th><th>Status</th><th style="text-align:right">Amount</th></tr></thead><tbody>' + p.map(function (x) {
      var cls = x.status === 'paid' ? 'ok' : x.status === 'open' ? 'bad' : 'dim';
      return '<tr><td>' + esc(when(x.created_at)) + '</td><td>' + esc(x.customer) + '<span class="sub">' + esc(x.email) + '</span></td><td>' + esc(x.product) + '<span class="sub">' + esc((x.reason || '').replace(/_/g, ' ')) + '</span></td>' +
        '<td class="' + cls + '">' + esc(x.substatus || x.status) + '</td><td class="n">' + usd(x.usd) + (x.refunded ? '<span class="sub bad">−' + usd(x.refunded) + '</span>' : '') + '</td></tr>';
    }).join('') + '</tbody></table>' : '<div class="empty">No payments in the last 30 days.</div>';
  }

  window.MMMWhop = function () {
    if (!BASE) return;
    if (!started) { started = true; shell(); }
    if (!D) load(false);
  };
})();
