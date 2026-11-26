/* MMM SOCIAL+ — publisher. Organic posts and paid ads across every major network.
   Whop belongs only to Trading (maxmaserati.com). */
(function (global) {
  'use strict';
  var KEY = 'mmm.social.plus.v4';
  var CSS = [
    '.sp{--bg:#07080a;--panel:#101318;--panel2:#0b0d10;--line:#2a3038;--ink:#e7ebf0;--mute:#8b949e;--faint:#5c6770;--gold:#e1b31a;--gold2:#f3d36a;--teal:#3dbea8;--bad:#ff5d6c;',
    'color:var(--ink);font:15px/1.5 Barlow,system-ui,sans-serif;background:var(--bg)}',
    '.sp *{box-sizing:border-box}',
    '.sp button,.sp select,.sp input,.sp textarea{font:inherit;color:inherit}',
    '.sp button{cursor:pointer}',
    '.top{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;padding:8px 4px 16px;flex-wrap:wrap}',
    '.mark{font:700 34px/0.9 "Barlow Condensed","Arial Narrow",sans-serif;letter-spacing:.04em;text-transform:uppercase;color:var(--gold);margin:0}',
    '.mark span{color:var(--ink)}',
    '.sub{margin:6px 0 0;color:var(--mute);max-width:62ch;font-size:14px}',
    '.modes{display:flex;padding:3px;border:1px solid var(--line);background:var(--panel2)}',
    '.modes button{min-height:44px;padding:0 18px;border:0;background:transparent;color:var(--mute);font:700 15px/1 "Barlow Condensed",sans-serif;letter-spacing:.08em;text-transform:uppercase}',
    '.modes button[aria-pressed=true]{background:var(--gold);color:#14120a}',
    '.shell{display:grid;grid-template-columns:272px minmax(0,1fr) 300px;gap:12px;align-items:start}',
    '.col{background:var(--panel);border:1px solid var(--line);padding:14px}',
    '.bizs{display:grid;gap:6px;margin-bottom:14px}',
    '.biz{display:flex;flex-direction:column;gap:2px;text-align:left;padding:10px 12px;min-height:44px;border:1px solid var(--line);background:var(--panel2);color:var(--ink)}',
    '.biz b{font:700 16px/1.1 "Barlow Condensed",sans-serif;letter-spacing:.05em;text-transform:uppercase}',
    '.biz small{color:var(--mute);font-size:12px}',
    '.biz.on{border-color:var(--gold);background:rgba(225,179,26,.08)}',
    '.biz.on b{color:var(--gold2)}',
    '.h{font:700 13px/1 "Barlow Condensed",sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);margin:0 0 8px}',
    '.acc{display:flex;gap:8px;align-items:center;width:100%;text-align:left;padding:8px;min-height:44px;border:1px solid transparent;background:transparent;color:var(--ink);margin:0 0 2px}',
    '.acc:hover{background:rgba(255,255,255,.03)}',
    '.acc.on{border-color:var(--gold);background:rgba(225,179,26,.07)}',
    '.dot{width:8px;height:8px;border-radius:50%;background:var(--faint);flex:none}',
    '.dot.live{background:var(--teal)}',
    '.mono{width:28px;height:28px;flex:none;display:grid;place-items:center;border:1px solid var(--line);font:700 12px/1 "Barlow Condensed",sans-serif;letter-spacing:.04em;color:var(--gold2)}',
    '.acc .nm{display:block;font-weight:600;font-size:13.5px}',
    '.acc .meta{display:block;color:var(--mute);font-size:12px}',
    '.grow{min-width:0}',
    '.add{display:grid;grid-template-columns:1fr;gap:6px;margin-top:10px}',
    '.sp input,.sp select,.sp textarea{width:100%;background:var(--panel2);border:1px solid var(--line);padding:10px 12px;outline:none}',
    '.sp textarea{min-height:140px;resize:vertical;font:14.5px/1.5 "IBM Plex Mono",ui-monospace,Menlo,monospace}',
    '.sp input:focus,.sp select:focus,.sp textarea:focus{border-color:var(--gold)}',
    '.lab{display:block;margin:12px 0 4px;font:600 12px/1 "Barlow Condensed",sans-serif;letter-spacing:.07em;text-transform:uppercase;color:var(--mute)}',
    '.seg{display:flex;flex-wrap:wrap;gap:6px}',
    '.seg button{min-height:40px;padding:0 12px;border:1px solid var(--line);background:var(--panel2);color:var(--mute);font:700 13px/1 "Barlow Condensed",sans-serif;letter-spacing:.06em;text-transform:uppercase}',
    '.seg button[aria-pressed=true]{border-color:var(--gold);color:#14120a;background:var(--gold)}',
    '.actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}',
    '.btn{min-height:44px;padding:0 16px;border:1px solid var(--line);background:transparent;color:var(--ink);font:700 15px/1 "Barlow Condensed",sans-serif;letter-spacing:.07em;text-transform:uppercase}',
    '.btn.gold{background:var(--gold);border-color:var(--gold);color:#14120a}',
    '.sp a.btn{display:inline-flex;align-items:center;text-decoration:none;margin-top:8px}',
    '.btn:disabled{opacity:.45;cursor:not-allowed}',
    '.msg{min-height:1.2em;margin:8px 0 0;color:var(--mute);font-size:13.5px}',
    '.msg.ok{color:var(--teal)}.msg.bad{color:var(--bad)}',
    '.card{border:1px solid var(--line);background:var(--panel2);padding:12px;margin:0 0 8px}',
    '.card .who{font:700 12px/1 "Barlow Condensed",sans-serif;letter-spacing:.07em;text-transform:uppercase;color:var(--gold2)}',
    '.card p{margin:8px 0 0;white-space:pre-wrap;font-size:13.5px;color:var(--ink)}',
    '.bar{height:3px;background:#1c2228;margin-top:8px}',
    '.bar i{display:block;height:100%;background:var(--teal);width:0}',
    '.bar i.hot{background:var(--bad)}',
    '.sponsored{display:inline-block;margin-top:8px;font:600 11px/1 "Barlow Condensed",sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);border:1px solid var(--line);padding:3px 6px}',
    '.qitem{border-top:1px solid var(--line);padding:12px 0}',
    '.tag{display:inline-block;margin-right:6px;padding:3px 6px;border:1px solid var(--line);font:700 11px/1 "Barlow Condensed",sans-serif;letter-spacing:.06em;text-transform:uppercase}',
    '.tag.ok{color:var(--teal);border-color:rgba(61,190,168,.5)}.tag.wait,.tag.pay{color:var(--gold2);border-color:rgba(225,179,26,.45)}',
    '.week{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;margin:0 0 12px}',
    '.day{border:1px solid var(--line);padding:6px;min-height:52px;background:var(--panel2)}',
    '.day b{display:block;font:700 12px/1 "Barlow Condensed",sans-serif;letter-spacing:.05em;text-transform:uppercase;color:var(--mute)}',
    '.day span{color:var(--gold2);font:700 16px/1 "Barlow Condensed",sans-serif}',
    '.grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
    '.pay{display:grid;gap:8px}',
    '.payrow{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:12px;min-height:64px;border:1px solid var(--line);background:var(--panel2);color:var(--ink)}',
    '.payrow.on{border-color:var(--gold);background:rgba(225,179,26,.07)}',
    '.payrow b{display:block;font:700 16px/1.1 "Barlow Condensed",sans-serif;letter-spacing:.04em;text-transform:uppercase}',
    '.markbox{width:72px;height:32px;flex:none;display:grid;place-items:center;border:1px solid var(--line);font:700 12px/1 "Barlow Condensed",sans-serif;letter-spacing:.04em}',
    '.payrow .meta{display:block;color:var(--mute);font-size:12px}',
    '@media (max-width:980px){.shell{grid-template-columns:1fr}.week{grid-template-columns:repeat(4,minmax(0,1fr))}}',
    '@media (max-width:560px){.grid2,.week{grid-template-columns:1fr 1fr}.mark{font-size:28px}}',
    '@media (prefers-reduced-motion:reduce){.sp *{transition:none!important}}'
  ].join('\n');

  var ORGANIC = [
    ['facebook', 'Facebook', 5000],
    ['instagram', 'Instagram', 2200],
    ['tiktok', 'TikTok', 2200],
    ['youtube', 'YouTube', 5000],
    ['x', 'X', 280],
    ['linkedin', 'LinkedIn', 3000],
    ['threads', 'Threads', 500],
    ['pinterest', 'Pinterest', 500],
    ['bluesky', 'Bluesky', 300],
    ['google', 'Google Business', 1500],
    ['snapchat', 'Snapchat', 160],
    ['telegram', 'Telegram', 4096],
    ['discord', 'Discord', 2000],
    ['whatsapp', 'WhatsApp', 700],
    ['reddit', 'Reddit', 40000]
  ];
  var ADS = [
    ['meta', 'Meta Ads', 'Facebook and Instagram'],
    ['youtube-ads', 'YouTube Ads', 'In-stream, in-feed, Shorts'],
    ['tiktok-ads', 'TikTok Ads', 'In-feed and Spark'],
    ['x-ads', 'X Ads', 'Promoted posts'],
    ['linkedin-ads', 'LinkedIn Ads', 'Sponsored content'],
    ['google-ads', 'Google Ads', 'Search and display'],
    ['pinterest-ads', 'Pinterest Ads', 'Promoted pins'],
    ['snap-ads', 'Snapchat Ads', 'Story and Spotlight']
  ];

  function seed() {
    function slot(id, network, name, live, note) {
      return { id: id, network: network, name: name, live: !!live, note: note || (live ? 'Ready to publish' : 'Not connected') };
    }
    var tradingOrg = [
      slot('fb', 'Facebook', 'Max Maserati Trading University', true),
      slot('ig', 'Instagram', 'Connect a page', false),
      slot('tt', 'TikTok', 'Connect a page', false),
      slot('yt', 'YouTube', 'Max Maserati', true, 'Ready. A video is required.'),
      slot('x', 'X', '@Emaxmaserati', true),
      slot('whop-public', 'Whop', 'Public forum', true, 'Trading only'),
      slot('whop-weekly', 'Whop', 'Weekly Analysis', true, 'Trading only · members')
    ];
    ORGANIC.forEach(function (n) {
      if (n[0] === 'facebook' || n[0] === 'instagram' || n[0] === 'tiktok' || n[0] === 'youtube' || n[0] === 'x') return;
      tradingOrg.push(slot('tr-' + n[0], n[1], 'Connect a page', false));
    });
    function blank(prefix) {
      return ORGANIC.filter(function (n) { return n[1] !== 'Whop'; }).map(function (n) {
        return slot(prefix + n[0], n[1], 'Connect a page', false);
      });
    }
    function ads(prefix) {
      return ADS.map(function (a) {
        return slot(prefix + a[0], a[1], a[2], false, 'Add a funded ad account to run this');
      });
    }
    return [
      { id: 'trading', name: 'Trading', site: 'maxmaserati.com', blurb: 'Several pages. Whop is only here.', organic: tradingOrg, ads: ads('tr-ad-') },
      { id: 'table', name: 'Table Fifty', site: 'tablefifty.co.uk', blurb: 'Half-price tables and delivery, UK-wide. No Whop.', organic: blank('tf-'), ads: ads('tf-ad-') },
      { id: 'ayiti', name: 'Ayiti P2P', site: 'ayitip2p.com', blurb: 'Its own business. No Whop.', organic: blank('ap-'), ads: ads('ap-ad-') }
    ];
  }

  function limitOf(network) {
    var hit = ORGANIC.filter(function (n) { return n[1] === network; })[0];
    if (network === 'Whop') return 5000;
    return hit ? hit[2] : 5000;
  }
  function letter(network) { return (network || '?').replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase(); }

  var LOGIN = {
    Facebook: 'https://www.facebook.com/login.php',
    Instagram: 'https://www.instagram.com/accounts/login/',
    TikTok: 'https://www.tiktok.com/login',
    YouTube: 'https://accounts.google.com/ServiceLogin?service=youtube&passive=true&continue=https%3A%2F%2Fwww.youtube.com%2F',
    X: 'https://x.com/i/flow/login',
    LinkedIn: 'https://www.linkedin.com/login',
    Threads: 'https://www.threads.net/login',
    Pinterest: 'https://www.pinterest.com/login/',
    Bluesky: 'https://bsky.app/',
    'Google Business': 'https://business.google.com/',
    Snapchat: 'https://accounts.snapchat.com/accounts/login',
    Telegram: 'https://web.telegram.org/',
    Discord: 'https://discord.com/login',
    WhatsApp: 'https://web.whatsapp.com/',
    Reddit: 'https://www.reddit.com/login/',
    Whop: 'https://whop.com/login/',
    'Meta Ads': 'https://adsmanager.facebook.com/',
    'YouTube Ads': 'https://ads.google.com/',
    'TikTok Ads': 'https://ads.tiktok.com/',
    'X Ads': 'https://ads.x.com/',
    'LinkedIn Ads': 'https://www.linkedin.com/campaignmanager/',
    'Google Ads': 'https://ads.google.com/',
    'Pinterest Ads': 'https://ads.pinterest.com/',
    'Snapchat Ads': 'https://ads.snapchat.com/'
  };

  function load() {
    var s = { biz: 'trading', mode: 'organic', tone: 'same', text: '', custom: {}, when: 'now', at: '', link: '', selected: ['fb', 'x'], items: [], extra: { trading: { organic: [], ads: [] }, table: { organic: [], ads: [] }, ayiti: { organic: [], ads: [] } }, wallets: {}, linked: {}, objective: 'Traffic', budget: '20', currency: 'GBP', start: '', end: '', audience: '' };
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!raw) return s;
      ['biz', 'mode', 'tone', 'text', 'when', 'at', 'link', 'objective', 'budget', 'currency', 'start', 'end', 'audience'].forEach(function (k) { if (raw[k] != null) s[k] = raw[k]; });
      if (Array.isArray(raw.selected)) s.selected = raw.selected;
      if (raw.custom) s.custom = raw.custom;
      if (Array.isArray(raw.items)) s.items = raw.items;
      if (raw.extra) s.extra = raw.extra;
      if (raw.wallets) s.wallets = raw.wallets;
      if (raw.linked) s.linked = raw.linked;
      return s;
    } catch (e) { return s; }
  }

  function businesses(state) {
    function apply(list) {
      return (list || []).map(function (p) {
        var o = state.linked && state.linked[p.id];
        if (!o) return p;
        return { id: p.id, network: p.network, name: o.name || p.name, live: true, note: 'Connected' };
      });
    }
    return seed().map(function (b) {
      var ex = (state.extra && state.extra[b.id]) || { organic: [], ads: [] };
      return {
        id: b.id, name: b.name, site: b.site, blurb: b.blurb,
        organic: apply(b.organic.concat(ex.organic || [])),
        ads: apply(b.ads.concat(ex.ads || []))
      };
    });
  }
  function pool(state) {
    var out = [];
    businesses(state).forEach(function (b) {
      b.organic.forEach(function (p) { out.push({ biz: b, kind: 'organic', plat: p }); });
      b.ads.forEach(function (p) { out.push({ biz: b, kind: 'ads', plat: p }); });
    });
    return out;
  }
  function find(state, id) {
    var hit = null;
    pool(state).forEach(function (x) { if (x.plat.id === id) hit = x; });
    return hit;
  }
  function uid(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

  function mount(root) {
    if (!root || root.dataset.mmmSocial) return;
    root.dataset.mmmSocial = '1';
    root.replaceChildren();
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    var state = load();
    var pending = null;

    function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
    function el(tag, cls, text) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      return n;
    }
    function report() {
      if (global.parent === global) return;
      try { global.parent.postMessage({ mmmSocial: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) }, location.origin); } catch (e) {}
    }
    function chosen() {
      return state.selected.map(function (id) { return find(state, id); }).filter(function (x) { return x && x.kind === state.mode; });
    }
    function caption(id) {
      var t = state.tone === 'custom' ? (state.custom[id] || '') : (state.text || '');
      if (state.mode === 'organic' && state.link && t.indexOf(state.link) < 0) t = (t ? t + '\n\n' : '') + state.link;
      return t.trim();
    }

    var wrap = el('div', 'sp');
    root.appendChild(wrap);
    var top = el('div', 'top');
    var titles = el('div');
    var h = el('h1', 'mark');
    h.appendChild(document.createTextNode('MMM '));
    h.appendChild(el('span', '', 'SOCIAL+'));
    titles.appendChild(h);
    titles.appendChild(el('p', 'sub', 'One desk for Trading, Table Fifty and Ayiti P2P. Organic posts and paid ads. Nothing goes out until you approve it.'));
    var modes = el('div', 'modes');
    var bOrg = el('button', '', 'Organic');
    var bAds = el('button', '', 'Paid ads');
    var bBill = el('button', '', 'Billing');
    bOrg.type = bAds.type = bBill.type = 'button';
    modes.appendChild(bOrg); modes.appendChild(bAds); modes.appendChild(bBill);
    top.appendChild(titles); top.appendChild(modes);
    wrap.appendChild(top);

    var shell = el('div', 'shell');
    var left = el('aside', 'col');
    var mid = el('section', 'col');
    var right = el('aside', 'col');
    shell.appendChild(left); shell.appendChild(mid); shell.appendChild(right);
    wrap.appendChild(shell);
    var queue = el('section', 'col');
    queue.style.marginTop = '12px';
    wrap.appendChild(queue);

    var bizBox = el('div', 'bizs');
    var listBox = el('div');
    var addBox = el('div', 'add');
    left.appendChild(bizBox);
    left.appendChild(el('h2', 'h', 'Accounts'));
    left.appendChild(listBox);
    left.appendChild(addBox);

    var cap = document.createElement('textarea');
    cap.placeholder = 'Write the post once. Or switch to a different caption per account.';
    var customBox = el('div');
    var link = document.createElement('input');
    link.type = 'url'; link.placeholder = 'https://';
    var whenBox = el('div', 'seg');
    var at = document.createElement('input');
    at.type = 'datetime-local';
    var adGrid = el('div', 'grid2');
    var objective = document.createElement('select');
    ['Awareness', 'Traffic', 'Engagement', 'Leads', 'Sales'].forEach(function (o) { var opt = document.createElement('option'); opt.textContent = o; objective.appendChild(opt); });
    var budget = document.createElement('input');
    budget.inputMode = 'decimal'; budget.placeholder = '20';
    var currency = document.createElement('select');
    ['GBP', 'USD', 'EUR'].forEach(function (c) { var opt = document.createElement('option'); opt.textContent = c; currency.appendChild(opt); });
    var start = document.createElement('input'); start.type = 'date';
    var end = document.createElement('input'); end.type = 'date';
    var audience = document.createElement('textarea');
    audience.placeholder = 'Who should see it. Country, age, interest. Example: UK, 25–45, restaurants.';
    audience.style.minHeight = '80px';
    var msg = el('p', 'msg');
    var actions = el('div', 'actions');
    var saveBtn = el('button', 'btn', 'Save draft');
    var okBtn = el('button', 'btn gold', 'Approve');
    saveBtn.type = okBtn.type = 'button';
    actions.appendChild(saveBtn); actions.appendChild(okBtn);

    function field(label, node) {
      var wrap = el('div');
      wrap.appendChild(el('label', 'lab', label));
      wrap.appendChild(node);
      return wrap;
    }

    mid.appendChild(el('h2', 'h', 'Composer'));
    var tone = el('div', 'seg');
    var sameBtn = el('button', '', 'Same text');
    var customBtn = el('button', '', 'Different per account');
    sameBtn.type = customBtn.type = 'button';
    tone.appendChild(sameBtn); tone.appendChild(customBtn);
    mid.appendChild(tone);
    var capLab = el('label', 'lab', 'Caption');
    mid.appendChild(capLab); mid.appendChild(cap); mid.appendChild(customBox);
    var organicExtra = el('div');
    organicExtra.appendChild(field('Link', link));
    var whenLab = el('label', 'lab', 'When');
    organicExtra.appendChild(whenLab); organicExtra.appendChild(whenBox); organicExtra.appendChild(at);
    mid.appendChild(organicExtra);
    var adExtra = el('div');
    adGrid.appendChild(field('Objective', objective));
    adGrid.appendChild(field('Daily budget', budget));
    adGrid.appendChild(field('Currency', currency));
    adGrid.appendChild(field('Start', start));
    adExtra.appendChild(adGrid);
    adExtra.appendChild(field('End', end));
    adExtra.appendChild(field('Audience', audience));
    var payerLine = el('p', 'msg', '');
    adExtra.appendChild(payerLine);
    var toBill = el('button', 'btn', 'Connect Google Pay or Apple Pay');
    toBill.type = 'button';
    toBill.addEventListener('click', function () { state.mode = 'billing'; save(); paintBilling(); paintButtons(); });
    adExtra.appendChild(toBill);
    adExtra.appendChild(el('p', 'msg', 'The wallet confirms who pays. This desk never stores a full card number and does not charge by itself. Meta, Google, YouTube, TikTok and X charge the daily budget after you say go.'));
    mid.appendChild(adExtra);
    var billBox = el('div');
    mid.appendChild(billBox);
    mid.appendChild(actions);
    mid.appendChild(msg);

    right.appendChild(el('h2', 'h', 'Preview'));
    var preview = el('div');
    right.appendChild(preview);

    function setPressed(btn, on) { btn.setAttribute('aria-pressed', on ? 'true' : 'false'); }

    function bag() {
      if (!state.wallets[state.biz]) state.wallets[state.biz] = { google: null, apple: null, card: null, use: '' };
      return state.wallets[state.biz];
    }
    function payerText() {
      var w = bag();
      var row = w[w.use];
      if (!row) return 'No wallet yet. Open Billing and connect Google Pay, Apple Pay, or a card.';
      return (w.use === 'google' ? 'Google Pay' : w.use === 'apple' ? 'Apple Pay' : 'Card') + ' · ' + row.detail + (row.confirmed ? ' · wallet confirmed' : ' · selected');
    }
    function googlePayRequest(price) {
      var method = {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA']
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: { gateway: 'example', gatewayMerchantId: 'mmmSocial' }
        }
      };
      return {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [method],
        merchantInfo: { merchantName: 'MMM SOCIAL+' },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: price,
          currencyCode: state.currency || 'GBP',
          countryCode: 'GB'
        }
      };
    }
    function ensureGooglePay() {
      if (global.google && global.google.payments && global.google.payments.api) return Promise.resolve(true);
      return new Promise(function (resolve) {
        var s = document.createElement('script');
        s.src = 'https://pay.google.com/gp/p/js/pay.js';
        s.async = true;
        s.onload = function () { resolve(true); };
        s.onerror = function () { resolve(false); };
        document.head.appendChild(s);
      });
    }
    function priceNow() {
      var n = parseFloat(state.budget);
      return (n > 0 ? n : 1).toFixed(2);
    }
    function openGoogle() {
      return ensureGooglePay().then(function (ok) {
        if (ok && global.google && global.google.payments && global.google.payments.api) {
          var client = new global.google.payments.api.PaymentsClient({ environment: 'TEST' });
          var request = googlePayRequest(priceNow());
          return client.isReadyToPay({
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: request.allowedPaymentMethods
          }).then(function (ready) {
            if (!ready || !ready.result) throw new Error('Google Pay is not on this device. Chrome with a Google account can confirm it. The method is still saved for this business.');
            return client.loadPaymentData(request);
          }).then(function (data) {
            return { confirmed: true, detail: (data && data.email) || 'Google Pay wallet' };
          });
        }
        throw new Error('Google Pay did not load. The method is still saved for this business.');
      });
    }
    function openApple() {
      if (global.ApplePaySession && global.ApplePaySession.canMakePayments && global.ApplePaySession.canMakePayments()) {
        return new Promise(function (resolve, reject) {
          try {
            var session = new global.ApplePaySession(3, {
              countryCode: 'GB',
              currencyCode: state.currency || 'GBP',
              supportedNetworks: ['visa', 'masterCard', 'amex'],
              merchantCapabilities: ['supports3DS'],
              total: { label: 'MMM ad budget', amount: priceNow() }
            });
            session.onvalidatemerchant = function () {
              try { session.abort(); } catch (e) {}
              reject(new Error('Apple Pay is on this device. The site still needs an Apple merchant certificate before the sheet can take payment. The method is saved.'));
            };
            session.oncancel = function () { reject(new Error('Apple Pay cancelled.')); };
            session.begin();
          } catch (err) {
            reject(err);
          }
        });
      }
      return Promise.reject(new Error('Apple Pay opens in Safari on iPhone, iPad, or Mac. The method is saved for this business.'));
    }
    function remember(kind, detail, confirmed, note) {
      var w = bag();
      w[kind] = { detail: detail, confirmed: !!confirmed, at: new Date().toISOString() };
      w.use = kind;
      save();
      msg.className = note && !confirmed ? 'msg' : 'msg ok';
      msg.textContent = note || (confirmed ? 'Wallet confirmed. No card number was stored.' : 'Saved as the payer for this business.');
      paintBilling();
      paintButtons();
    }
    function paintBilling() {
      billBox.replaceChildren();
      if (state.mode !== 'billing') return;
      var b = businesses(state).filter(function (x) { return x.id === state.biz; })[0];
      billBox.appendChild(el('h2', 'h', 'Billing · ' + b.name));
      billBox.appendChild(el('p', 'msg', 'Connect the wallet that pays ads for ' + b.site + '. Google Pay and Apple Pay. Card is last 4 only.'));
      var w = bag();
      function row(kind, title, hint) {
        var saved = w[kind];
        var btn = el('button', 'payrow' + (w.use === kind && saved ? ' on' : ''));
        btn.type = 'button';
        btn.appendChild(el('span', 'markbox', kind === 'google' ? 'G Pay' : kind === 'apple' ? 'Apple' : 'Card'));
        var g = el('span', 'grow');
        g.appendChild(el('b', '', title));
        g.appendChild(el('span', 'meta', saved ? saved.detail + (saved.confirmed ? ' · confirmed' : ' · selected') : hint));
        btn.appendChild(g);
        btn.addEventListener('click', function () {
          if (kind === 'card') return;
          msg.className = 'msg';
          msg.textContent = 'Opening ' + title + '…';
          var job = kind === 'google' ? openGoogle() : openApple();
          job.then(function (res) {
            remember(kind, (res && res.detail) || title, true, title + ' confirmed for ' + b.name + '. Nothing was charged.');
          }).catch(function (err) {
            remember(kind, title, false, err && err.message ? err.message : 'Saved as the payer.');
          });
        });
        return btn;
      }
      var list = el('div', 'pay');
      list.appendChild(row('google', 'Google Pay', 'Confirm in Chrome. No card number is saved.'));
      list.appendChild(row('apple', 'Apple Pay', 'Confirm in Safari. No card number is saved.'));
      billBox.appendChild(list);
      var card = el('div', 'card');
      card.appendChild(el('div', 'who', 'Card on file'));
      card.appendChild(el('p', 'msg', 'Last 4 digits and the brand. Never the full number.'));
      var brand = document.createElement('select');
      ['Visa', 'Mastercard', 'Amex'].forEach(function (c) { var o = document.createElement('option'); o.textContent = c; brand.appendChild(o); });
      var last4 = document.createElement('input');
      last4.inputMode = 'numeric';
      last4.maxLength = 4;
      last4.placeholder = 'Last 4';
      last4.autocomplete = 'off';
      var saveCard = el('button', 'btn gold', 'Save card');
      saveCard.type = 'button';
      saveCard.addEventListener('click', function () {
        var digits = (last4.value || '').replace(/\s/g, '');
        if (!/^\d{4}$/.test(digits)) { msg.className = 'msg bad'; msg.textContent = 'Enter only the last 4 digits.'; return; }
        remember('card', brand.value + ' · ' + digits, true, 'Card saved as ' + brand.value + ' ending ' + digits + '. The full number was not stored.');
      });
      var grid = el('div', 'grid2');
      grid.appendChild(brand);
      grid.appendChild(last4);
      card.appendChild(grid);
      card.appendChild(saveCard);
      if (w.card) card.appendChild(el('p', 'msg ok', 'On file: ' + w.card.detail));
      billBox.appendChild(card);
      report();
    }

    function paintBiz() {
      bizBox.replaceChildren();
      businesses(state).forEach(function (b) {
        var live = b.organic.concat(b.ads).filter(function (p) { return p.live; }).length;
        var btn = el('button', 'biz' + (state.biz === b.id ? ' on' : ''));
        btn.type = 'button';
        btn.appendChild(el('b', '', b.name));
        btn.appendChild(el('small', '', b.site + ' · ' + live + ' ready'));
        btn.addEventListener('click', function () { state.biz = b.id; save(); paintSide(); paintPreview(); paintBilling(); paintButtons(); });
        bizBox.appendChild(btn);
      });
    }

    function paintSide() {
      var b = businesses(state).filter(function (x) { return x.id === state.biz; })[0];
      listBox.replaceChildren();
      listBox.appendChild(el('p', 'msg', b.blurb));
      var rows = state.mode === 'ads' ? b.ads : b.organic;
      if (pending && rows.some(function (r) { return r.id === pending.id; })) {
        var box = el('div', 'card');
        var url = LOGIN[pending.network];
        box.appendChild(el('div', 'who', 'Sign in · ' + pending.network));
        box.appendChild(el('p', 'msg', 'Log in on ' + pending.network + ', then name the page and mark it connected.'));
        if (url) {
          var a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.className = 'btn gold';
          a.textContent = 'Open ' + pending.network + ' login';
          box.appendChild(a);
        }
        var pageName = document.createElement('input');
        pageName.placeholder = state.mode === 'ads' ? 'Ad account name' : 'Page or @handle';
        pageName.value = pending.name || '';
        pageName.style.marginTop = '8px';
        box.appendChild(pageName);
        var done = el('button', 'btn', 'Mark connected');
        done.type = 'button';
        done.style.marginTop = '8px';
        done.addEventListener('click', function () {
          var label = pageName.value.trim();
          if (!label || label === 'Connect a page') { msg.className = 'msg bad'; msg.textContent = 'Name the page or account you just signed into.'; return; }
          state.linked[pending.id] = { name: label };
          if (state.selected.indexOf(pending.id) < 0) state.selected.push(pending.id);
          var netName = pending.network;
          pending = null;
          save();
          msg.className = 'msg ok';
          msg.textContent = netName + ' is connected on this desk.';
          paintBiz(); paintSide(); paintCustom(); paintPreview(); paintButtons();
        });
        box.appendChild(done);
        listBox.appendChild(box);
      }
      rows.forEach(function (p) {
        var on = state.selected.indexOf(p.id) >= 0;
        var btn = el('button', 'acc' + (on ? ' on' : ''));
        btn.type = 'button';
        var mark = el('span', 'mono', letter(p.network));
        var dot = el('span', 'dot' + (p.live ? ' live' : ''));
        var g = el('span', 'grow');
        g.appendChild(el('span', 'nm', p.network));
        g.appendChild(el('span', 'meta', p.name + ' · ' + (p.live ? 'Ready' : 'Sign in')));
        btn.appendChild(mark); btn.appendChild(g); btn.appendChild(dot);
        btn.addEventListener('click', function () {
          if (!p.live) {
            pending = { id: p.id, network: p.network, name: p.name === 'Connect a page' ? '' : p.name };
            var login = LOGIN[p.network];
            if (login) window.open(login, '_blank', 'noopener,noreferrer');
            msg.className = 'msg';
            msg.textContent = 'Sign in to ' + p.network + ', then mark the page connected.';
            paintSide();
            return;
          }
          var i = state.selected.indexOf(p.id);
          if (i >= 0) state.selected.splice(i, 1); else state.selected.push(p.id);
          save(); paintSide(); paintCustom(); paintPreview(); paintButtons();
        });
        listBox.appendChild(btn);
      });
      addBox.replaceChildren();
      var net = document.createElement('select');
      var catalog = state.mode === 'ads' ? ADS.map(function (a) { return a[1]; }) : ORGANIC.map(function (n) { return n[1]; }).concat(b.id === 'trading' ? ['Whop'] : []);
      catalog.forEach(function (n) { var o = document.createElement('option'); o.textContent = n; net.appendChild(o); });
      var name = document.createElement('input');
      name.placeholder = state.mode === 'ads' ? 'Ad account name' : 'Page or @handle';
      var go = el('button', 'btn', state.mode === 'ads' ? 'Add ad account' : 'Add page');
      go.type = 'button';
      go.addEventListener('click', function () {
        var label = name.value.trim();
        if (!label) return;
        if (net.value === 'Whop' && b.id !== 'trading') return;
        state.extra[b.id] = state.extra[b.id] || { organic: [], ads: [] };
        var id = uid(b.id);
        var row = { id: id, network: net.value, name: label, live: false, note: 'Saved. Tell me when the login is connected.' };
        state.extra[b.id][state.mode === 'ads' ? 'ads' : 'organic'].push(row);
        state.selected.push(id);
        name.value = '';
        save(); paintSide(); paintCustom(); paintPreview();
      });
      addBox.appendChild(net); addBox.appendChild(name); addBox.appendChild(go);
    }

    function paintCustom() {
      customBox.replaceChildren();
      if (state.mode === 'billing') { customBox.hidden = true; cap.hidden = true; capLab.hidden = true; return; }
      if (state.tone !== 'custom') { customBox.hidden = true; cap.hidden = false; capLab.hidden = false; return; }
      customBox.hidden = false; cap.hidden = true; capLab.hidden = true;
      var list = chosen();
      if (!list.length) { customBox.appendChild(el('p', 'msg', 'Select at least one account.')); return; }
      list.forEach(function (hit) {
        customBox.appendChild(el('label', 'lab', hit.biz.name + ' · ' + hit.plat.network + ' · ' + hit.plat.name));
        var ta = document.createElement('textarea');
        ta.value = state.custom[hit.plat.id] || '';
        ta.addEventListener('input', function () { state.custom[hit.plat.id] = ta.value; save(); paintPreview(); });
        customBox.appendChild(ta);
      });
    }

    function paintPreview() {
      preview.replaceChildren();
      var list = chosen();
      if (!list.length) { preview.appendChild(el('p', 'msg', 'Select accounts on the left. The post previews here, one card per page.')); return; }
      list.forEach(function (hit) {
        var text = caption(hit.plat.id);
        var max = state.mode === 'ads' ? 500 : limitOf(hit.plat.network);
        var card = el('article', 'card');
        card.appendChild(el('div', 'who', hit.plat.network + ' · ' + hit.plat.name));
        card.appendChild(el('p', '', text || 'Caption will show here.'));
        if (state.mode === 'ads') card.appendChild(el('div', 'sponsored', 'Sponsored · ' + state.objective + ' · ' + (state.currency || 'GBP') + ' ' + (state.budget || '0') + '/day'));
        else {
          var bar = el('div', 'bar');
          var i = document.createElement('i');
          var pct = Math.min(100, Math.round((text.length / max) * 100));
          i.style.width = pct + '%';
          if (text.length > max) i.className = 'hot';
          bar.appendChild(i);
          card.appendChild(bar);
          card.appendChild(el('div', 'msg', text.length + ' / ' + max + (hit.plat.live ? '' : ' · not connected yet')));
        }
        preview.appendChild(card);
      });
      report();
    }

    function paintButtons() {
      var billing = state.mode === 'billing';
      var n = chosen().length;
      okBtn.textContent = state.mode === 'ads' ? (n ? ('Approve ad · ' + n) : 'Approve ad') : (n ? ('Approve · ' + n) : 'Approve');
      setPressed(bOrg, state.mode === 'organic');
      setPressed(bAds, state.mode === 'ads');
      setPressed(bBill, billing);
      setPressed(sameBtn, state.tone === 'same');
      setPressed(customBtn, state.tone === 'custom');
      tone.hidden = billing;
      organicExtra.hidden = state.mode !== 'organic';
      adExtra.hidden = state.mode !== 'ads';
      billBox.hidden = !billing;
      actions.hidden = billing;
      at.hidden = state.when !== 'later';
      cap.hidden = billing || state.tone === 'custom';
      capLab.hidden = billing || state.tone === 'custom';
      if (billing) customBox.hidden = true;
      if (state.mode === 'ads') payerLine.textContent = payerText();
    }

    function paintWhen() {
      whenBox.replaceChildren();
      [['now', 'Post when I say go'], ['later', 'Schedule']].forEach(function (pair) {
        var b = el('button', '', pair[1]);
        b.type = 'button';
        setPressed(b, state.when === pair[0]);
        b.addEventListener('click', function () { state.when = pair[0]; save(); paintWhen(); paintButtons(); paintQueue(); });
        whenBox.appendChild(b);
      });
    }

    function paintQueue() {
      queue.replaceChildren();
      queue.appendChild(el('h2', 'h', 'Calendar'));
      var week = el('div', 'week');
      for (var d = 0; d < 7; d++) {
        var day = new Date(); day.setDate(day.getDate() + d);
        var key = day.toISOString().slice(0, 10);
        var count = state.items.filter(function (item) {
          if (item.when !== 'later' || !item.at) return false;
          return String(item.at).slice(0, 10) === key;
        }).length;
        var cell = el('div', 'day');
        cell.appendChild(el('b', '', day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })));
        cell.appendChild(el('span', '', count ? String(count) : '·'));
        week.appendChild(cell);
      }
      queue.appendChild(week);
      queue.appendChild(el('h2', 'h', 'Queue'));
      if (!state.items.length) { queue.appendChild(el('p', 'msg', 'No drafts. Write a post, or tell me the topic in chat and I will draft it for your approval.')); return; }
      state.items.forEach(function (item) {
        var card = el('div', 'qitem');
        var tag = el('span', 'tag ' + (item.kind === 'ads' ? 'pay' : item.status === 'approved' ? 'ok' : 'wait'), item.kind === 'ads' ? 'Paid' : (item.status === 'approved' ? 'Approved' : 'Draft'));
        card.appendChild(tag);
        card.appendChild(el('span', 'msg', item.kind === 'ads' ? (item.objective + ' · ' + item.currency + ' ' + item.budget + '/day' + (item.payer ? (' · ' + item.payer.detail) : '')) : (item.when === 'now' ? 'Post when you say go' : ('Schedule ' + (item.at || '')))));
        (item.pages || []).forEach(function (p) {
          card.appendChild(el('div', '', p.biz + ' · ' + p.network + ' · ' + p.name + (p.live ? '' : ' · connect first')));
          if (p.text) card.appendChild(el('p', 'msg', p.text));
        });
        var row = el('div', 'actions');
        if (item.status !== 'approved') {
          var ap = el('button', 'btn gold', 'Approve');
          ap.type = 'button';
          ap.addEventListener('click', function () {
            if (item.kind === 'ads' && !(item.payer && item.payer.detail)) { msg.className = 'msg bad'; msg.textContent = 'Connect Google Pay, Apple Pay, or a card in Billing before approving this ad.'; return; }
            item.status = 'approved'; save(); paintQueue();
          });
          row.appendChild(ap);
        }
        var del = el('button', 'btn', 'Remove');
        del.type = 'button';
        del.addEventListener('click', function () { state.items = state.items.filter(function (x) { return x.id !== item.id; }); save(); paintQueue(); });
        row.appendChild(del);
        card.appendChild(row);
        queue.appendChild(card);
      });
      report();
    }

    function take(status) {
      var list = chosen();
      if (!list.length) { msg.className = 'msg bad'; msg.textContent = 'Select at least one account.'; return; }
      var pages = list.map(function (hit) {
        return { id: hit.plat.id, biz: hit.biz.name, site: hit.biz.site, network: hit.plat.network, name: hit.plat.name, live: !!hit.plat.live, text: caption(hit.plat.id) };
      });
      if (state.mode === 'organic' && pages.every(function (p) { return !p.text; })) { msg.className = 'msg bad'; msg.textContent = 'Write the caption first.'; return; }
      if (state.mode === 'organic' && state.when === 'later' && !state.at) { msg.className = 'msg bad'; msg.textContent = 'Set the time.'; return; }
      if (state.mode === 'ads' && !(parseFloat(state.budget) > 0)) { msg.className = 'msg bad'; msg.textContent = 'Set a daily budget.'; return; }
      var payer = null;
      if (state.mode === 'ads') {
        var w = bag();
        if (w.use && w[w.use]) payer = { method: w.use, detail: w[w.use].detail, confirmed: !!w[w.use].confirmed };
        if (status === 'approved' && !payer) { msg.className = 'msg bad'; msg.textContent = 'Open Billing and connect Google Pay, Apple Pay, or a card.'; return; }
      }
      state.items.unshift({
        id: uid('post'), status: status, kind: state.mode, when: state.when, at: state.at, pages: pages,
        objective: state.objective, budget: state.budget, currency: state.currency, start: state.start, end: state.end, audience: state.audience, payer: payer
      });
      save();
      msg.className = 'msg ok';
      msg.textContent = status === 'approved'
        ? (state.mode === 'ads' ? ('Ad approved. Payer: ' + payer.detail + '. Nothing was charged. Say go in chat and I will place it. The ad account charges that wallet.') : 'Approved. Say post it in chat. I will send only the accounts that are connected.')
        : 'Draft saved.';
      paintQueue();
    }

    cap.addEventListener('input', function () { state.text = cap.value; save(); paintPreview(); });
    link.addEventListener('input', function () { state.link = link.value; save(); paintPreview(); });
    at.addEventListener('input', function () { state.at = at.value; save(); });
    objective.addEventListener('change', function () { state.objective = objective.value; save(); paintPreview(); });
    budget.addEventListener('input', function () { state.budget = budget.value; save(); paintPreview(); });
    currency.addEventListener('change', function () { state.currency = currency.value; save(); paintPreview(); });
    start.addEventListener('input', function () { state.start = start.value; save(); });
    end.addEventListener('input', function () { state.end = end.value; save(); });
    audience.addEventListener('input', function () { state.audience = audience.value; save(); });
    sameBtn.addEventListener('click', function () { state.tone = 'same'; save(); paintCustom(); paintButtons(); paintPreview(); });
    customBtn.addEventListener('click', function () { state.tone = 'custom'; save(); paintCustom(); paintButtons(); paintPreview(); });
    bOrg.addEventListener('click', function () { state.mode = 'organic'; save(); paintSide(); paintCustom(); paintButtons(); paintPreview(); });
    bAds.addEventListener('click', function () { state.mode = 'ads'; save(); paintSide(); paintCustom(); paintButtons(); paintPreview(); });
    bBill.addEventListener('click', function () { state.mode = 'billing'; save(); paintBilling(); paintButtons(); });
    saveBtn.addEventListener('click', function () { take('draft'); });
    okBtn.addEventListener('click', function () { take('approved'); });

    cap.value = state.text || '';
    link.value = state.link || '';
    at.value = state.at || '';
    objective.value = state.objective || 'Traffic';
    budget.value = state.budget || '';
    currency.value = state.currency || 'GBP';
    start.value = state.start || '';
    end.value = state.end || '';
    audience.value = state.audience || '';

    paintBiz(); paintSide(); paintWhen(); paintCustom(); paintBilling(); paintButtons(); paintPreview(); paintQueue();
  }

  global.MMMSocialDesk = { mount: mount };
})(window);
