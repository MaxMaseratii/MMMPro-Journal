/* MMM SOCIAL+ — private desk for five businesses.
   Publishing stays in the free native studios. This file only plans posts,
   logs numbers, and tracks API setup. No secrets belong here. */
(function (global) {
  'use strict';

  var KEY = 'mmm.social.plus.v1';
  var NETS = [
    { id: 'facebook', label: 'Facebook', studio: 'https://business.facebook.com/latest/composer', studioName: 'Meta Business Suite' },
    { id: 'instagram', label: 'Instagram', studio: 'https://business.facebook.com/latest/composer', studioName: 'Meta Business Suite' },
    { id: 'youtube', label: 'YouTube', studio: 'https://studio.youtube.com/', studioName: 'YouTube Studio' },
    { id: 'tiktok', label: 'TikTok', studio: 'https://www.tiktok.com/tiktokstudio/upload', studioName: 'TikTok Studio' }
  ];
  var STATUSES = ['Idea', 'Ready', 'In Studio', 'Posted'];
  var CHECKS = [
    { group: 'YouTube', items: [
      ['yt-cloud', 'Google Cloud project is created.'],
      ['yt-apis', 'YouTube Data API v3 and YouTube Analytics API are enabled.'],
      ['yt-oauth', 'OAuth client is created. The refresh token will live on Render, not in GitHub.'],
      ['yt-scopes', 'Scopes include yt-analytics.readonly and youtube.readonly.']
    ]},
    { group: 'Meta (Facebook + Instagram)', items: [
      ['meta-app', 'A Meta app exists at developers.facebook.com for accounts you own.'],
      ['meta-ig', 'Each Instagram is Business or Creator and linked to its Facebook Page.'],
      ['meta-perms', 'Permissions are the insights and page-read scopes, only for accounts you manage.'],
      ['meta-standard', 'Standard Access is enough while the app serves only your own accounts. No App Review.']
    ]},
    { group: 'TikTok', items: [
      ['tt-app', 'A TikTok developer app exists.'],
      ['tt-login', 'Login Kit is added, with user.info.basic and video.list.'],
      ['tt-limit', 'I know Display API returns views, likes, comments and shares only. Watch time stays in TikTok Studio.']
    ]},
    { group: 'Hosting, when you want automatic pulls', items: [
      ['host-render', 'Render will run the web service, a daily cron, and Postgres.'],
      ['host-secret', 'No API secret, token or client secret is pasted into this page.']
    ]}
  ];
  var PROMPT = [
    'Create a production-ready, self-hosted social analytics puller I will run myself on GitHub + Render.',
    'Requirements:',
    '- Pull analytics only for accounts I own, using official APIs:',
    '  - YouTube Analytics API (must be fully working)',
    '  - Meta Graph API / Instagram Insights (structure + a working example for my own Pages)',
    '  - TikTok Display API (structure + example: user.info.basic, video.list, optional user.info.stats)',
    '- Do not scrape Studio dashboards. Do not use unofficial APIs.',
    '- Be honest: TikTok Display API does not include watch time, completion rate or traffic source.',
    '- Meta: Standard Access, no App Review, because the app only serves accounts I own or manage. Instagram must be Business or Creator.',
    '- Store pulls in Postgres. Python, FastAPI, SQLAlchemy.',
    '- render.yaml: web service + daily cron (python -m app.pull) + free Postgres.',
    '- All secrets in environment variables. Never commit tokens.',
    '- README: how to get a YouTube refresh token, how to deploy on Render, how to add Meta and TikTok later.',
    '- MIT license. Minimal, clean code.',
    'Deliver a complete GitHub-ready project. Do not tell me to buy Buffer or Postiz Cloud.'
  ].join('\n');

  var CSS = [
    ':root{--bg:#07080a;--panel:#0f1114;--panel2:#0b0d10;--line:#252a31;--line2:#323942;--fg:#d9dde3;--mute:#8f97a1;--faint:#5f6873;--gold:#e1b31a;--gold2:#f2cf5b;--teal:#4fd1c5;--up:#3ddc97;--dn:#ff5c6c;',
    "--display:'Barlow Condensed','Arial Narrow',sans-serif;--body:'Barlow',system-ui,sans-serif;--mono:'IBM Plex Mono',ui-monospace,Menlo,Consolas,monospace}",
    '.mmm-social{color:var(--fg);font-family:var(--body);font-size:15px;max-width:1100px;margin:0 auto;padding:18px 16px 48px}',
    '.mmm-social h1{font:700 clamp(32px,4vw,48px)/1 var(--display);text-transform:uppercase;letter-spacing:.03em;color:var(--gold);margin:0 0 8px}',
    '.mmm-social h2{font:700 20px var(--display);text-transform:uppercase;letter-spacing:.05em;color:var(--gold);margin:0 0 8px}',
    '.mmm-social .lede{color:#c9d0d6;max-width:78ch;margin:0 0 16px;line-height:1.55}',
    '.mmm-social a{color:var(--teal)}',
    '.kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:12px}',
    '.kpi{background:var(--panel);border:1px solid var(--line);padding:12px 14px}',
    '.kpi b{display:block;font:700 28px/1 var(--display);color:var(--gold2);letter-spacing:.03em}',
    '.kpi span{color:var(--mute);font-size:12.5px}',
    '.steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin-bottom:12px}',
    '.steps div{background:var(--panel);padding:12px 14px;font-size:14px;line-height:1.45;color:#c9d0d6}',
    '.steps strong{display:block;font:700 14px var(--display);letter-spacing:.06em;text-transform:uppercase;color:var(--gold2);margin-bottom:3px}',
    '.chips{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}',
    '.chip{font:600 13px/1 var(--body);background:var(--panel);color:var(--fg);border:1px solid var(--line2);padding:8px 10px;cursor:pointer}',
    '.chip[aria-pressed=true]{background:var(--gold);border-color:var(--gold);color:#111}',
    '.chip small{color:inherit;opacity:.7;margin-left:6px;font-weight:500}',
    '.subnav{display:flex;flex-wrap:wrap;gap:4px;border-bottom:1px solid var(--line2);margin:0 0 14px}',
    '.subnav button{font:600 14px var(--body);background:none;color:var(--mute);border:0;border-bottom:3px solid transparent;padding:9px 12px;cursor:pointer}',
    '.subnav button[aria-selected=true]{color:var(--gold);border-bottom-color:var(--gold)}',
    '.box{border:1px solid var(--line);background:var(--panel);padding:14px 16px;margin-bottom:12px}',
    '.form{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}',
    '.span{grid-column:1/-1}',
    '.mmm-social label{display:block;font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:var(--mute);margin-bottom:4px}',
    '.mmm-social input,.mmm-social select,.mmm-social textarea{width:100%;box-sizing:border-box;background:var(--panel2);color:var(--fg);border:1px solid var(--line2);padding:9px 10px;font:14px var(--body)}',
    '.mmm-social textarea{min-height:96px;font:13.5px/1.45 var(--mono);resize:vertical}',
    '.row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px}',
    '.btn{display:inline-flex;align-items:center;gap:6px;font:700 14px/1 var(--display);letter-spacing:.06em;text-transform:uppercase;padding:10px 12px;border:1px solid var(--line2);background:transparent;color:var(--fg);cursor:pointer;text-decoration:none}',
    '.btn.gold{background:var(--gold);border-color:var(--gold);color:#111}',
    '.btn.tiny{padding:6px 8px;font-size:13px}',
    '.btn[disabled]{opacity:.5;cursor:wait}',
    '.msg{font-size:13.5px;color:var(--mute)}.msg.ok{color:var(--up)}.msg.bad{color:var(--dn)}',
    '.tw{overflow-x:auto}',
    '.mmm-social table{width:100%;border-collapse:collapse;font-size:13.5px;min-width:640px}',
    '.mmm-social th{font:600 12px var(--display);letter-spacing:.07em;text-transform:uppercase;color:var(--mute);text-align:left;padding:7px 8px;border-bottom:1px solid var(--line2)}',
    '.mmm-social td{padding:8px;border-bottom:1px solid var(--line);vertical-align:top}',
    '.day{font:700 13px var(--display);letter-spacing:.08em;text-transform:uppercase;color:var(--gold);padding-top:14px}',
    '.tag{display:inline-block;font:600 11px/1 var(--display);letter-spacing:.06em;text-transform:uppercase;padding:4px 6px;border:1px solid var(--line2);white-space:nowrap}',
    '.tag.facebook{color:#b7c4ff;border-color:#3d4d88}.tag.instagram{color:#f0c08a;border-color:#8a5a32}',
    '.tag.youtube{color:#ffb4b4;border-color:#8a3a3a}.tag.tiktok{color:#b6f3ea;border-color:#2f6d66}',
    '.cap{font:12.5px/1.4 var(--mono);color:#c9d0d6;white-space:pre-wrap;max-width:420px}',
    '.bars{display:grid;gap:8px}',
    '.bar{display:grid;grid-template-columns:92px 1fr auto;gap:8px;align-items:center;font-size:13px}',
    '.bar i{display:block;height:8px;background:var(--gold);border-radius:0}',
    '.bar em{font-style:normal;color:var(--mute);font:12px var(--mono)}',
    '.cols3{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}',
    '.check{display:flex;gap:8px;align-items:flex-start;text-transform:none;letter-spacing:0;font-size:14px;color:#c9d0d6;line-height:1.4;margin:0 0 8px}',
    '.check input{width:auto;margin-top:3px}',
    '.bizgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}',
    '.links{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}',
    'pre.prompt{white-space:pre-wrap;background:var(--panel2);border:1px solid var(--line2);padding:12px;font:12.5px/1.5 var(--mono);color:#cfd5da;margin:0}',
    '.note{color:var(--faint);font-size:12.5px;margin-top:8px}',
    '@media (max-width:760px){.kpis,.steps,.form,.cols3,.bizgrid{grid-template-columns:minmax(0,1fr)}.bar{grid-template-columns:72px 1fr}}'
  ].join('');

  function blank() {
    return {
      businesses: [
        { id: 'b1', name: 'MMM Trading', handles: { facebook: '', instagram: '', youtube: '', tiktok: '' } },
        { id: 'b2', name: 'MMM Journal', handles: { facebook: '', instagram: '', youtube: '', tiktok: '' } },
        { id: 'b3', name: 'Ayiti P2P', handles: { facebook: '', instagram: '', youtube: '', tiktok: '' } },
        { id: 'b4', name: 'Prop firms', handles: { facebook: '', instagram: '', youtube: '', tiktok: '' } },
        { id: 'b5', name: 'Personal brand', handles: { facebook: '', instagram: '', youtube: '', tiktok: '' } }
      ],
      posts: [],
      stats: [],
      checks: {},
      panel: 'queue',
      filterBiz: 'all',
      filterNet: 'all',
      filterStatus: 'all'
    };
  }

  function load() {
    var base = blank();
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return base;
      var d = JSON.parse(raw);
      if (!d || !Array.isArray(d.businesses) || d.businesses.length !== 5) return base;
      d.businesses.forEach(function (b, i) {
        b.id = base.businesses[i].id;
        b.name = String(b.name || base.businesses[i].name).slice(0, 48);
        b.handles = b.handles || {};
        NETS.forEach(function (n) { b.handles[n.id] = String(b.handles[n.id] || '').slice(0, 80); });
      });
      d.posts = Array.isArray(d.posts) ? d.posts : [];
      d.stats = Array.isArray(d.stats) ? d.stats : [];
      d.checks = d.checks && typeof d.checks === 'object' ? d.checks : {};
      d.panel = d.panel || 'queue';
      d.filterBiz = d.filterBiz || 'all';
      d.filterNet = d.filterNet || 'all';
      d.filterStatus = d.filterStatus || 'all';
      return d;
    } catch (e) { return base; }
  }

  function net(id) { return NETS.filter(function (n) { return n.id === id; })[0] || NETS[0]; }
  function biz(state, id) { return state.businesses.filter(function (b) { return b.id === id; })[0] || state.businesses[0]; }
  function uid(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function withinDays(value, days) {
    if (!value) return false;
    var t = new Date(value).getTime();
    if (isNaN(t)) return false;
    var now = Date.now();
    return t <= now + 86400000 && now - t <= days * 86400000;
  }
  function fmtWhen(s) {
    if (!s) return 'No time';
    var d = new Date(s);
    if (isNaN(d.getTime())) return s;
    return d.toLocaleString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }
  function dayLabel(s) {
    if (!s) return 'Unscheduled';
    var d = new Date(s);
    if (isNaN(d.getTime())) return 'Unscheduled';
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'short' });
  }
  function num(v) { var n = parseInt(v, 10); return isNaN(n) || n < 0 ? 0 : n; }
  function report() {
    if (global.parent === global) return;
    var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    try { global.parent.postMessage({ mmmSocial: h }, global.location.origin); } catch (e) {}
  }

  function mount(root) {
    if (!root || root.dataset.mmmSocial) return;
    root.dataset.mmmSocial = '1';
    root.replaceChildren();
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var state = load();
    function save() {
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
      paint();
    }

    var wrap = document.createElement('div');
    wrap.className = 'mmm-social';
    root.appendChild(wrap);

    function h(tag, cls) { var n = document.createElement(tag); if (cls) n.className = cls; return n; }
    function field(label, node) {
      var w = h('div');
      var l = h('label');
      l.textContent = label;
      w.appendChild(l);
      w.appendChild(node);
      return w;
    }

    var kpis = h('div', 'kpis');
    var steps = h('div', 'steps');
    steps.innerHTML = '<div><strong>1 · Plan it here</strong>Pick the business, the network, the time and the caption.</div>'
      + '<div><strong>2 · Publish free</strong>Open the native studio. The caption is copied. Paste it and schedule there.</div>'
      + '<div><strong>3 · Log the numbers</strong>Mark it posted, then write the views on Stats. API pulls come later, on Render.</div>';
    var links = h('div', 'links');
    [['Meta Business Suite', 'https://business.facebook.com/latest/composer'], ['YouTube Studio', 'https://studio.youtube.com/'], ['TikTok Studio', 'https://www.tiktok.com/tiktokstudio/upload']].forEach(function (pair) {
      var a = h('a', 'btn');
      a.href = pair[1];
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = pair[0];
      links.appendChild(a);
    });
    var chips = h('div', 'chips');
    var sub = h('div', 'subnav');
    ['queue', 'stats', 'accounts', 'api', 'prompt'].forEach(function (id) {
      var b = h('button');
      b.type = 'button';
      b.dataset.panel = id;
      b.textContent = { queue: 'Queue', stats: 'Stats', accounts: 'Accounts', api: 'API setup', prompt: 'Prompt' }[id];
      b.addEventListener('click', function () { state.panel = id; save(); });
      sub.appendChild(b);
    });

    var panels = {};
    ['queue', 'stats', 'accounts', 'api', 'prompt'].forEach(function (id) { panels[id] = h('div'); });

    /* Queue form */
    var qBiz = h('select'), qNet = h('select'), qWhen = h('input'), qTitle = h('input'), qCap = h('textarea'), qMsg = h('span', 'msg');
    qWhen.type = 'datetime-local';
    qTitle.maxLength = 140;
    qTitle.placeholder = 'Hook or title';
    qCap.maxLength = 4000;
    qCap.placeholder = 'Caption, hashtags, link. This is what you paste into the studio.';
    NETS.forEach(function (n) { var o = h('option'); o.value = n.id; o.textContent = n.label; qNet.appendChild(o); });
    var qForm = h('div', 'box');
    var form = h('div', 'form');
    var c1 = field('Business', qBiz); var c2 = field('Network', qNet); var c3 = field('Publish at', qWhen);
    var c4 = field('Title', qTitle); c4.classList.add('span');
    var c5 = field('Caption', qCap); c5.classList.add('span');
    form.appendChild(c1); form.appendChild(c2); form.appendChild(c3); form.appendChild(c4); form.appendChild(c5);
    var qRow = h('div', 'row');
    var qAdd = h('button', 'btn gold'); qAdd.type = 'button'; qAdd.textContent = 'Add to queue';
    qRow.appendChild(qAdd); qRow.appendChild(qMsg);
    qForm.appendChild(form); qForm.appendChild(qRow);
    var filters = h('div', 'chips');
    var listBox = h('div', 'box');
    var listTitle = h('h2'); listTitle.textContent = 'Queue';
    var listEl = h('div');
    listBox.appendChild(listTitle); listBox.appendChild(listEl);
    panels.queue.appendChild(qForm); panels.queue.appendChild(filters); panels.queue.appendChild(listBox);

    qAdd.addEventListener('click', function () {
      var cap = qCap.value.trim();
      var title = qTitle.value.trim();
      if (cap.length < 1 && title.length < 1) { qMsg.className = 'msg bad'; qMsg.textContent = 'Write a title or a caption first.'; return; }
      state.posts.unshift({
        id: uid('p'),
        businessId: qBiz.value,
        network: qNet.value,
        when: qWhen.value,
        title: title.slice(0, 140),
        caption: cap.slice(0, 4000),
        status: 'Ready',
        created: new Date().toISOString()
      });
      qTitle.value = ''; qCap.value = ''; qMsg.className = 'msg ok'; qMsg.textContent = 'Added.';
      save();
    });

    /* Stats */
    var sBiz = h('select'), sNet = h('select'), sDate = h('input'), sViews = h('input'), sLikes = h('input'), sComments = h('input'), sShares = h('input'), sFollows = h('input'), sWatch = h('input'), sNote = h('input'), sMsg = h('span', 'msg');
    sDate.type = 'date'; sDate.value = new Date().toISOString().slice(0, 10);
    [sViews, sLikes, sComments, sShares, sFollows, sWatch].forEach(function (n) { n.type = 'number'; n.min = '0'; n.placeholder = '0'; });
    sNote.maxLength = 180; sNote.placeholder = 'Optional note';
    NETS.forEach(function (n) { var o = h('option'); o.value = n.id; o.textContent = n.label; sNet.appendChild(o); });
    var sForm = h('div', 'box');
    var sf = h('div', 'form');
    [['Business', sBiz], ['Network', sNet], ['Date', sDate], ['Views', sViews], ['Likes', sLikes], ['Comments', sComments], ['Shares', sShares], ['New followers', sFollows], ['Watch minutes', sWatch]].forEach(function (pair) {
      sf.appendChild(field(pair[0], pair[1]));
    });
    var sn = field('Note', sNote); sn.classList.add('span'); sf.appendChild(sn);
    var sRow = h('div', 'row');
    var sAdd = h('button', 'btn gold'); sAdd.type = 'button'; sAdd.textContent = 'Log numbers';
    sRow.appendChild(sAdd); sRow.appendChild(sMsg);
    var sHead = h('h2'); sHead.textContent = 'Log a snapshot';
    sForm.appendChild(sHead);
    var sLede = h('p', 'lede'); sLede.textContent = 'Type the numbers from the native studio. This page does not sign in to Meta, YouTube or TikTok.';
    sForm.appendChild(sLede); sForm.appendChild(sf); sForm.appendChild(sRow);
    var chartBox = h('div', 'box');
    var logBox = h('div', 'box');
    panels.stats.appendChild(sForm); panels.stats.appendChild(chartBox); panels.stats.appendChild(logBox);
    sAdd.addEventListener('click', function () {
      state.stats.unshift({
        id: uid('s'), date: sDate.value, businessId: sBiz.value, network: sNet.value,
        views: num(sViews.value), likes: num(sLikes.value), comments: num(sComments.value),
        shares: num(sShares.value), followers: num(sFollows.value), watch: num(sWatch.value),
        note: sNote.value.trim().slice(0, 180)
      });
      sViews.value = sLikes.value = sComments.value = sShares.value = sFollows.value = sWatch.value = sNote.value = '';
      sMsg.className = 'msg ok'; sMsg.textContent = 'Logged on this browser.';
      save();
    });

    /* Accounts */
    var accBox = h('div');
    panels.accounts.appendChild(accBox);

    /* API + prompt */
    var apiBox = h('div');
    panels.api.appendChild(apiBox);
    var promptBox = h('div', 'box');
    var ph = h('h2'); ph.textContent = 'Prompt for Claude or Gemini';
    var plede = h('p', 'lede'); plede.textContent = 'Paste this when you want the Render puller. It does not belong in this static page, because tokens cannot live on GitHub Pages.';
    var pre = h('pre', 'prompt'); pre.textContent = PROMPT;
    var pRow = h('div', 'row');
    var pCopy = h('button', 'btn gold'); pCopy.type = 'button'; pCopy.textContent = 'Copy prompt';
    var pMsg = h('span', 'msg');
    pCopy.addEventListener('click', function () {
      var done = function () { pMsg.className = 'msg ok'; pMsg.textContent = 'Copied.'; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(PROMPT).then(done).catch(fallback);
      else fallback();
      function fallback() {
        var r = document.createRange(); r.selectNodeContents(pre); var s = getSelection(); s.removeAllRanges(); s.addRange(r);
        pMsg.className = 'msg'; pMsg.textContent = 'Selected. Press Ctrl or Cmd + C.';
      }
    });
    pRow.appendChild(pCopy); pRow.appendChild(pMsg);
    promptBox.appendChild(ph); promptBox.appendChild(plede); promptBox.appendChild(pre); promptBox.appendChild(pRow);
    panels.prompt.appendChild(promptBox);

    /* Footer tools */
    var tools = h('div', 'box');
    var tRow = h('div', 'row');
    var ex = h('button', 'btn'); ex.type = 'button'; ex.textContent = 'Download backup';
    var im = h('button', 'btn'); im.type = 'button'; im.textContent = 'Import backup';
    var file = h('input'); file.type = 'file'; file.accept = 'application/json'; file.hidden = true;
    var rs = h('button', 'btn'); rs.type = 'button'; rs.textContent = 'Reset this browser';
    var tMsg = h('span', 'msg');
    ex.addEventListener('click', function () {
      var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      var a = h('a'); a.href = URL.createObjectURL(blob); a.download = 'mmm-social-plus.json'; a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      tMsg.className = 'msg ok'; tMsg.textContent = 'Backup downloaded.';
    });
    im.addEventListener('click', function () { file.click(); });
    file.addEventListener('change', function () {
      var f = file.files && file.files[0]; file.value = ''; if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var d = JSON.parse(String(reader.result || ''));
          if (!d || !Array.isArray(d.businesses)) throw new Error('bad');
          localStorage.setItem(KEY, JSON.stringify(d));
          state = load();
          tMsg.className = 'msg ok'; tMsg.textContent = 'Imported.';
          paint();
        } catch (e) { tMsg.className = 'msg bad'; tMsg.textContent = 'That file is not an MMM SOCIAL+ backup.'; }
      };
      reader.readAsText(f);
    });
    rs.addEventListener('click', function () {
      if (!confirm('Clear the queue, stats and checklist stored in this browser?')) return;
      state = blank(); save();
      tMsg.className = 'msg'; tMsg.textContent = 'Cleared on this browser.';
    });
    tRow.appendChild(ex); tRow.appendChild(im); tRow.appendChild(file); tRow.appendChild(rs); tRow.appendChild(tMsg);
    var note = h('p', 'note');
    note.textContent = 'Saved in this browser only (localStorage). It does not sync to your phone until you download the backup and import it there. Publishing still happens in the studios.';
    tools.appendChild(tRow); tools.appendChild(note);

    var title = h('h1'); title.textContent = 'MMM SOCIAL+';
    var lede = h('p', 'lede');
    lede.textContent = 'One desk for five businesses. Meta, YouTube and TikTok stay on their own free schedulers. This page keeps the plan, the captions and the numbers you type in. Official API pulls can be added later on Render, under your control.';
    wrap.appendChild(title); wrap.appendChild(lede); wrap.appendChild(kpis); wrap.appendChild(steps); wrap.appendChild(links); wrap.appendChild(chips); wrap.appendChild(sub);
    Object.keys(panels).forEach(function (id) { wrap.appendChild(panels[id]); });
    wrap.appendChild(tools);

    function fillSelects() {
      [qBiz, sBiz].forEach(function (sel) {
        var cur = sel.value;
        sel.innerHTML = '';
        state.businesses.forEach(function (b) {
          var o = h('option'); o.value = b.id; o.textContent = b.name; sel.appendChild(o);
        });
        if (cur) sel.value = cur;
      });
    }

    function filteredPosts() {
      return state.posts.filter(function (p) {
        if (state.filterBiz !== 'all' && p.businessId !== state.filterBiz) return false;
        if (state.filterNet !== 'all' && p.network !== state.filterNet) return false;
        if (state.filterStatus !== 'all' && p.status !== state.filterStatus) return false;
        return true;
      }).slice().sort(function (a, b) {
        if (!a.when && !b.when) return 0;
        if (!a.when) return 1;
        if (!b.when) return -1;
        return a.when < b.when ? -1 : 1;
      });
    }

    function paint() {
      var posts = state.posts;
      var views7 = state.stats.reduce(function (s, r) { return s + (withinDays(r.date, 7) ? r.views : 0); }, 0);
      var cells = [
        [posts.filter(function (p) { return p.status === 'Ready'; }).length, 'Ready to paste'],
        [posts.filter(function (p) { return p.status === 'In Studio'; }).length, 'Sitting in a studio'],
        [posts.filter(function (p) { return p.status === 'Posted' && withinDays(p.when || p.created, 7); }).length, 'Posted in 7 days'],
        [views7, 'Views logged, 7 days']
      ];
      kpis.innerHTML = '';
      cells.forEach(function (c) {
        var d = h('div', 'kpi'); var b = h('b'); b.textContent = String(c[0]); var s = h('span'); s.textContent = c[1];
        d.appendChild(b); d.appendChild(s); kpis.appendChild(d);
      });

      chips.innerHTML = '';
      var all = h('button', 'chip'); all.type = 'button'; all.textContent = 'All five'; all.setAttribute('aria-pressed', state.filterBiz === 'all' ? 'true' : 'false');
      all.addEventListener('click', function () { state.filterBiz = 'all'; save(); });
      chips.appendChild(all);
      state.businesses.forEach(function (b) {
        var btn = h('button', 'chip'); btn.type = 'button';
        btn.setAttribute('aria-pressed', state.filterBiz === b.id ? 'true' : 'false');
        btn.appendChild(document.createTextNode(b.name));
        var sm = h('small'); sm.textContent = String(posts.filter(function (p) { return p.businessId === b.id && p.status !== 'Posted'; }).length); btn.appendChild(sm);
        btn.addEventListener('click', function () { state.filterBiz = b.id; save(); });
        chips.appendChild(btn);
      });

      [].forEach.call(sub.children, function (b) { b.setAttribute('aria-selected', b.dataset.panel === state.panel ? 'true' : 'false'); });
      Object.keys(panels).forEach(function (id) { panels[id].hidden = state.panel !== id; });
      fillSelects();

      filters.innerHTML = '';
      function addFilter(label, key, value) {
        var b = h('button', 'chip'); b.type = 'button'; b.textContent = label;
        b.setAttribute('aria-pressed', state[key] === value ? 'true' : 'false');
        b.addEventListener('click', function () { state[key] = value; save(); });
        filters.appendChild(b);
      }
      addFilter('All networks', 'filterNet', 'all');
      NETS.forEach(function (n) { addFilter(n.label, 'filterNet', n.id); });
      addFilter('All statuses', 'filterStatus', 'all');
      STATUSES.forEach(function (s) { addFilter(s, 'filterStatus', s); });

      var rows = filteredPosts();
      listEl.innerHTML = '';
      if (!rows.length) {
        var empty = h('p', 'lede'); empty.textContent = 'Nothing in this filter. Add a post above, then open the studio and paste it.';
        listEl.appendChild(empty);
      } else {
        var table = h('table');
        var thead = h('thead'); var hr = h('tr');
        ['When', 'Business', 'Network', 'Post', 'Status', ''].forEach(function (name) { var th = h('th'); th.textContent = name; hr.appendChild(th); });
        thead.appendChild(hr); table.appendChild(thead);
        var tb = h('tbody');
        var lastDay = '';
        rows.forEach(function (p) {
          var day = dayLabel(p.when);
          if (day !== lastDay) {
            lastDay = day;
            var dr = h('tr'); var dc = h('td'); dc.colSpan = 6; dc.className = 'day'; dc.textContent = day; dr.appendChild(dc); tb.appendChild(dr);
          }
          var tr = h('tr');
          function td(text, cls) { var c = h('td'); if (cls) c.className = cls; c.textContent = text; return c; }
          tr.appendChild(td(fmtWhen(p.when)));
          tr.appendChild(td(biz(state, p.businessId).name));
          var nc = h('td'); var tag = h('span', 'tag ' + p.network); tag.textContent = net(p.network).label; nc.appendChild(tag); tr.appendChild(nc);
          var pc = h('td');
          if (p.title) { var strong = h('strong'); strong.textContent = p.title; pc.appendChild(strong); pc.appendChild(h('br')); }
          var cap = h('div', 'cap'); cap.textContent = p.caption || ''; pc.appendChild(cap); tr.appendChild(pc);
          var sc = h('td'); var sel = h('select');
          STATUSES.forEach(function (s) { var o = h('option'); o.value = s; o.textContent = s; if (s === p.status) o.selected = true; sel.appendChild(o); });
          sel.addEventListener('change', function () { p.status = sel.value; save(); });
          sc.appendChild(sel); tr.appendChild(sc);
          var ac = h('td');
          var open = h('button', 'btn tiny gold'); open.type = 'button'; open.textContent = 'Copy + open';
          open.addEventListener('click', function () {
            var text = (p.title ? p.title + '\n\n' : '') + (p.caption || '');
            var go = function () { window.open(net(p.network).studio, '_blank', 'noopener'); };
            var mark = function () { if (p.status === 'Ready' || p.status === 'Idea') p.status = 'In Studio'; save(); };
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { mark(); go(); }).catch(function () { mark(); go(); });
            else { mark(); go(); }
          });
          var del = h('button', 'btn tiny'); del.type = 'button'; del.textContent = 'Remove';
          del.addEventListener('click', function () {
            state.posts = state.posts.filter(function (x) { return x.id !== p.id; });
            save();
          });
          ac.appendChild(open); ac.appendChild(document.createTextNode(' ')); ac.appendChild(del); tr.appendChild(ac);
          tb.appendChild(tr);
        });
        table.appendChild(tb);
        var tw = h('div', 'tw'); tw.appendChild(table); listEl.appendChild(tw);
      }

      /* chart uses the business filter */
      var pool = state.stats.filter(function (r) { return state.filterBiz === 'all' || r.businessId === state.filterBiz; });
      chartBox.innerHTML = '';
      var ch = h('h2'); ch.textContent = 'Views by network';
      var cl = h('p', 'lede'); cl.textContent = state.filterBiz === 'all' ? 'All five businesses, everything you have logged.' : biz(state, state.filterBiz).name + ', everything you have logged.';
      chartBox.appendChild(ch); chartBox.appendChild(cl);
      var max = 1; var totals = {};
      NETS.forEach(function (n) { totals[n.id] = 0; });
      pool.forEach(function (r) { totals[r.network] = (totals[r.network] || 0) + r.views; });
      NETS.forEach(function (n) { if (totals[n.id] > max) max = totals[n.id]; });
      var bars = h('div', 'bars');
      NETS.forEach(function (n) {
        var row = h('div', 'bar');
        var name = h('span'); name.textContent = n.label;
        var track = h('span'); var i = document.createElement('i'); i.style.width = Math.round((totals[n.id] / max) * 100) + '%'; track.appendChild(i);
        var em = h('em'); em.textContent = String(totals[n.id]);
        row.appendChild(name); row.appendChild(track); row.appendChild(em); bars.appendChild(row);
      });
      chartBox.appendChild(bars);

      logBox.innerHTML = '';
      var lh = h('h2'); lh.textContent = 'Log';
      logBox.appendChild(lh);
      if (!pool.length) {
        var none = h('p', 'lede'); none.textContent = 'No numbers yet. After a post goes out, open the studio analytics and type the views here.';
        logBox.appendChild(none);
      } else {
        var st = h('table'); var sth = h('thead'); var sr = h('tr');
        ['Date', 'Business', 'Network', 'Views', 'Likes', 'Comments', 'Shares', 'Followers', 'Watch min', ''].forEach(function (name) { var th = h('th'); th.textContent = name; sr.appendChild(th); });
        sth.appendChild(sr); st.appendChild(sth);
        var sb = h('tbody');
        pool.slice(0, 40).forEach(function (r) {
          var tr = h('tr');
          [r.date, biz(state, r.businessId).name, net(r.network).label, r.views, r.likes, r.comments, r.shares, r.followers, r.watch].forEach(function (v) {
            var td = h('td'); td.textContent = String(v == null ? '' : v); tr.appendChild(td);
          });
          var td = h('td'); var del = h('button', 'btn tiny'); del.type = 'button'; del.textContent = 'Remove';
          del.addEventListener('click', function () { state.stats = state.stats.filter(function (x) { return x.id !== r.id; }); save(); });
          td.appendChild(del); tr.appendChild(td); sb.appendChild(tr);
        });
        st.appendChild(sb); var stw = h('div', 'tw'); stw.appendChild(st); logBox.appendChild(stw);
      }

      accBox.innerHTML = '';
      var ah = h('h2'); ah.textContent = 'Five businesses';
      var al = h('p', 'lede'); al.textContent = 'Rename each business and write the handle you post from. Handles are labels for you. They are not logins.';
      accBox.appendChild(ah); accBox.appendChild(al);
      var grid = h('div', 'bizgrid');
      state.businesses.forEach(function (b) {
        var card = h('div', 'box');
        var name = h('input'); name.value = b.name; name.maxLength = 48;
        name.addEventListener('input', function () { b.name = name.value.slice(0, 48); try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} });
        name.addEventListener('change', function () { paint(); });
        card.appendChild(field('Business name', name));
        NETS.forEach(function (n) {
          var inp = h('input'); inp.value = b.handles[n.id] || ''; inp.maxLength = 80; inp.placeholder = '@handle';
          inp.addEventListener('input', function () { b.handles[n.id] = inp.value.slice(0, 80); try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} });
          card.appendChild(field(n.label + ' handle', inp));
        });
        grid.appendChild(card);
      });
      accBox.appendChild(grid);

      apiBox.innerHTML = '';
      var apiH = h('h2'); apiH.textContent = 'Official APIs, when you want them';
      var apiL = h('p', 'lede');
      apiL.textContent = 'YouTube can return full private channel stats. Meta insights work for Pages and Instagram accounts you manage, with Standard Access and no review. TikTok’s public API is only profile and video counts. Deep TikTok Studio stats stay in TikTok. Tick these as you set them up. Nothing here stores a token.';
      apiBox.appendChild(apiH); apiBox.appendChild(apiL);
      var cols = h('div', 'cols3');
      CHECKS.forEach(function (group) {
        var card = h('div', 'box');
        var gh = h('h2'); gh.textContent = group.group; card.appendChild(gh);
        group.items.forEach(function (item) {
          var lab = h('label', 'check');
          var cb = h('input'); cb.type = 'checkbox'; cb.checked = !!state.checks[item[0]];
          cb.addEventListener('change', function () { state.checks[item[0]] = cb.checked; try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} });
          var span = h('span'); span.textContent = item[1];
          lab.appendChild(cb); lab.appendChild(span); card.appendChild(lab);
        });
        cols.appendChild(card);
      });
      apiBox.appendChild(cols);
      var docs = h('div', 'links');
      [['Google Cloud', 'https://console.cloud.google.com/'], ['Meta for developers', 'https://developers.facebook.com/apps/'], ['TikTok for developers', 'https://developers.tiktok.com/']].forEach(function (pair) {
        var a = h('a', 'btn'); a.href = pair[1]; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = pair[0]; docs.appendChild(a);
      });
      apiBox.appendChild(docs);
      report();
    }

    paint();
    global.addEventListener('resize', report);
  }

  global.MMMSocialDesk = { mount: mount };
})(window);
