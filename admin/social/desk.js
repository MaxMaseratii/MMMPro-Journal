/* MMM SOCIAL+ — the publisher. Its own product. Each business keeps its own color. */
(function (global) {
  'use strict';
  var KEY = 'mmm.social.plus.v4';
  var PLATFORM = { facebook: '1107484722267711', google: '' };
  var OAUTH_REDIRECT = 'https://www.maxmaserati.com/admin/social/index.html';
  var PENDING_OAUTH = null;
  try {
    if ((location.hash || '').indexOf('access_token=') >= 0) {
      var oauthParams = new URLSearchParams(location.hash.replace(/^#/, ''));
      var oauthToken = oauthParams.get('access_token');
      if (oauthToken) {
        PENDING_OAUTH = { token: oauthToken, network: sessionStorage.getItem('mmm.oauth.net') || '', view: sessionStorage.getItem('mmm.oauth.view') || '' };
        history.replaceState(null, '', location.pathname + location.search);
        if (window.opener && window.opener !== window) {
          window.opener.postMessage({ source: 'mmm-oauth', token: oauthToken, network: PENDING_OAUTH.network }, location.origin);
          window.close();
        }
      }
    }
  } catch (e) {}
  var CSS = [
    '.sp{--bg:#efece6;--panel:#fff;--panel2:#f7f6f3;--line:rgba(28,26,23,.1);--ink:#1a1916;--mute:#6f6a62;--faint:#b0aaa2;--brand:#1a1916;--brand2:#1a1916;--go:#1a1916;--on:#fff;--on-go:#fff;--live:#2f6f4e;--spend:#c2410c;--bad:#b42318;',
    'color:var(--ink);font:15px/1.5 "Instrument Sans",Manrope,system-ui,sans-serif;background:#efece6;padding:0;min-height:100vh;-webkit-font-smoothing:antialiased}',
    '.sp *{box-sizing:border-box}',
    '.sp button,.sp select,.sp input,.sp textarea{font:inherit;color:inherit}',
    '.sp button{cursor:pointer}',
    '.top,.nav{display:none}',
    '.shell{display:grid;grid-template-columns:260px minmax(0,1fr);min-height:100vh;background:transparent}',
    '.rail{display:flex;flex-direction:column;align-items:stretch;gap:2px;background:transparent;padding:28px 18px 18px}',
    '.railbrand{font:italic 26px/1 "Instrument Serif",Georgia,serif;color:#1a1916;padding:0 10px 22px}',
    '.plus{display:none}',
    '.gear{margin-top:auto;height:40px;border:0;border-radius:10px;background:transparent;color:#6f6a62;font-weight:600;font-size:14px;text-align:left;padding:0 10px}',
    '.main{position:relative;min-width:0;background:#fff;padding:36px 40px 64px;min-height:100vh;border-radius:22px 0 0 22px}',
    '.bizs{display:flex;flex-direction:column;gap:4px;margin:0 0 14px}',
    '.biz{width:100%;min-height:36px;padding:6px 10px;border:0;border-radius:10px;background:transparent;display:flex;align-items:center;gap:10px;text-align:left}',
    '.biz::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--biz,#ccc);flex:none}',
    '.biz b{font-weight:600;font-size:14px}',
    '.biz small,.rail>.h,.acc .dot{display:none}',
    '.biz.on{background:#fff}',
    '.feed{display:flex;flex-direction:column;gap:2px;overflow:auto;max-height:calc(100vh - 320px);margin-top:8px}',
    '.acc{width:100%;min-height:52px;padding:8px 8px;border:0;border-radius:12px;background:transparent;display:flex;align-items:center;gap:10px;text-align:left}',
    '.grow{display:flex;flex-direction:column;min-width:0;flex:1;align-items:flex-start}',
    '.acc .nm{display:block;font-weight:600;font-size:14px;letter-spacing:-.01em;line-height:1.2}',
    '.acc .meta{display:block;color:var(--mute);font-size:12px;line-height:1.3;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}',
    '.acc.on,.acc.open{background:#fff}',
    '.logo{width:36px;height:36px;border-radius:12px;display:grid;place-items:center;box-shadow:inset 0 0 0 1px rgba(0,0,0,.06)}.logo svg{width:18px;height:18px;display:block}',
    '.minis{display:flex;gap:4px;flex-wrap:wrap}.minis .logo{width:18px;height:18px;border-radius:5px}.minis .logo svg{width:11px;height:11px}',
    '.calhead{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin:0 0 16px}',
    '.caltitle{margin:0;font:400 44px/1 "Instrument Serif",Georgia,serif;letter-spacing:-.03em}',
    '.sub{margin:6px 0 0;color:var(--mute);font-size:14px}',
    '.week{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:0;margin-top:8px;border-top:1px solid rgba(28,26,23,.1)}',
    '.day{background:transparent;padding:12px 10px 16px;min-height:0;border-right:1px solid rgba(28,26,23,.06)}',
    '.day:last-child{border-right:0}',
    '.day.today .num{color:var(--brand)}',
    '.day b{display:block;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}',
    '.day .num{display:block;font:400 20px/1 "Instrument Serif",Georgia,serif;margin-top:4px}',
    '.slot{display:grid;gap:8px;margin-top:12px}',
    '.postc{display:block;background:#f7f6f3;border:0;border-radius:12px;padding:10px}',
    '.postc p{margin:0 0 8px;font-size:13px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}',
    '.loose{margin-top:28px;display:flex;flex-direction:column;gap:8px}',
    '.loose .postc{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid rgba(28,26,23,.08);padding:14px 16px}',
    '.loose .postc p{flex:1;margin:0;font-size:15px;-webkit-line-clamp:2}',
    '.kicker{grid-column:1/-1;margin:0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);font-weight:600}',
    '.mini{border:0;background:transparent;color:#1f8a4c;font-weight:600;font-size:12px;padding:4px 0 0}',
    '.tag{display:inline-block;margin-top:4px;font-size:11px;font-weight:600;color:var(--mute)}',
    '.tag.ok{color:#1f8a4c}.tag.wait{color:#9a6b12}.tag.pay{color:#e25b2a}',
    '.work,.setuphost{display:none}',
    '.stagecol{display:none}',
    '.sp[data-view="post"] .boardpage,.sp[data-view="setup"] .boardpage,.sp[data-view="account"] .boardpage{display:none}',
    '.sp[data-view="post"] .work{display:block;width:min(680px,100%);margin:0 auto;padding:8px 0 48px}',
    '.sp[data-view="setup"] .setuphost,.sp[data-view="account"] .account{display:block;width:min(560px,100%);margin:0 auto;padding:8px 0 48px}',
    '.account{display:none}',
    '.acctop{display:flex;align-items:center;gap:14px;margin:0 0 8px}',
    '.acctop .logo{width:48px;height:48px;border-radius:14px}',
    '.acctop .logo svg{width:26px;height:26px}',
    '.acctop h2{margin:0;font:400 36px/1 "Instrument Serif",Georgia,serif}',
    '.pagerow{display:flex;align-items:center;gap:12px;padding:12px 0;border-top:1px solid var(--line);flex-wrap:wrap}',
    '.pagerow select{width:auto;min-width:160px}',
    '.pagerow b{display:block;font-size:14px}',
    '.pagerow span{display:block;color:var(--mute);font-size:12px}',
    '.sp[data-theme="dark"]{--ink:#f3efe7;--mute:#a39c92;--line:rgba(255,255,255,.1);--panel:#1c1b19;background:#141311;color:#f3efe7}',
    '.sp[data-theme="dark"] .main{background:#1c1b19}',
    '.sp[data-theme="dark"] .biz.on,.sp[data-theme="dark"] .acc.on,.sp[data-theme="dark"] .acc.open{background:#2a2826}',
    '.sp[data-theme="dark"] .postc,.sp[data-theme="dark"] .phone .card,.sp[data-theme="dark"] .card{background:#262421;color:#f3efe7}',
    '.sp[data-theme="dark"] .loose .postc{background:#1c1b19;border-color:rgba(255,255,255,.08)}',
    '.sp[data-theme="dark"] .paper,.sp[data-theme="dark"] .day,.sp[data-theme="dark"] .caltitle{color:#f3efe7}',
    '.sp[data-theme="dark"] input,.sp[data-theme="dark"] select,.sp[data-theme="dark"] textarea{background:#141311;color:#f3efe7;border-color:rgba(255,255,255,.12)}',
    '.sp[data-theme="dark"] .btn{background:transparent;color:#f3efe7}',
    '.x{border:0;background:transparent;color:var(--mute);font-weight:600;padding:0 0 8px}',
    '.modes{display:flex;padding:4px;border:1px solid var(--line);background:#f6f7f4;border-radius:999px;gap:2px;width:max-content;margin-bottom:12px}',
    '.modes button{min-height:34px;padding:0 14px;border:0;border-radius:999px;background:transparent;color:var(--mute);font-weight:600;font-size:13px}',
    '.modes button.org[aria-pressed=true]{background:var(--brand);color:#fff}',
    '.modes button.ads[aria-pressed=true]{background:var(--spend);color:#fff}',
    '.modes button.bill[aria-pressed=true]{background:var(--bill);color:var(--bill-on)}',
    '.dest{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0 0 10px}',
    '.sp input,.sp select,.sp textarea{width:100%;background:#fff;border:1px solid var(--line);border-radius:12px;padding:11px 13px;outline:none;color:var(--ink)}',
    '.sp textarea{min-height:88px;resize:vertical;font:15px/1.45 "Instrument Sans",system-ui,sans-serif;background:#fff}',
    '.paper{min-height:200px;font:400 30px/1.3 "Instrument Serif",Georgia,serif;letter-spacing:-.02em;border:0;background:transparent;padding:12px 0 0;box-shadow:none}',
    '.caplab{position:absolute;width:1px;height:1px;overflow:hidden}',
    '.sp input:focus,.sp select:focus,.sp textarea:focus{border-color:var(--brand);box-shadow:0 0 0 3px color-mix(in srgb, var(--brand) 25%, transparent)}',
    '.lab{display:block;margin:14px 0 6px;font-weight:600;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute)}',
    '.seg{display:flex;flex-wrap:wrap;gap:6px}',
    '.seg button{min-height:34px;padding:0 12px;border:1px solid var(--line);border-radius:999px;background:#fff;color:var(--mute);font-weight:600;font-size:13px}',
    '.seg button[aria-pressed=true]{border-color:transparent;color:#fff;background:var(--brand)}',
    '.actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}',
    '.btn{min-height:40px;padding:0 16px;border:1px solid var(--line);border-radius:999px;background:#fff;color:var(--ink);font-weight:600;font-size:14px}',
    '.btn.go{background:var(--go);border-color:transparent;color:var(--on-go)}',
    '.sp a.btn{display:inline-flex;align-items:center;text-decoration:none;margin-top:8px}',
    '.btn:disabled{opacity:.4}',
    '.msg{min-height:1.2em;margin:8px 0 0;color:var(--mute);font-size:13px;line-height:1.45}',
    '.msg.ok{color:#1f8a4c}.msg.bad{color:var(--bad)}',
    '.card{border:1px solid var(--line);background:#fff;border-radius:16px;padding:12px;margin:0 0 10px}',
    '.card .who{display:flex;align-items:center;gap:10px}.card .who b{display:block;font-weight:600;font-size:14px}.card .who span{display:block;color:var(--mute);font-size:12px}',
    '.card p{margin:8px 0 0;white-space:pre-wrap}',
    '.phone{background:transparent;border-radius:0;padding:8px 0 0;margin-top:8px;color:#1a1916}',
    '.phone .card{background:#f7f6f3;border:0;color:#1a1916;border-radius:16px}',
    '.phone .msg{color:#6f6a62}',
    '.bar{height:3px;background:rgba(255,255,255,.15);margin-top:8px;border-radius:99px;overflow:hidden}',
    '.bar i{display:block;height:100%;background:#8fd9b4;width:0}.bar i.hot{background:#ff6b78}',
    '.sponsored{display:inline-block;margin-top:8px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#b7b2a8}',
    '.h{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--mute);margin:0 0 8px}',
    '.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}',
    '.pay{display:grid;gap:8px}',
    '.payrow{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:12px;min-height:64px;border:1px solid var(--line);border-radius:16px;background:#fff}',
    '.payrow.on{border-color:var(--bill);background:color-mix(in srgb, var(--bill) 12%, #fff)}',
    '.payrow b{display:block;font-weight:600}.payrow .meta{display:block;color:var(--mute);font-size:12px}',
    '.markbox{width:64px;height:32px;display:grid;place-items:center;border:1px solid var(--line);border-radius:8px;font-weight:700;font-size:12px}',
    '.swatches{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}',
    '.sw{width:26px;height:26px;min-height:26px;padding:0;border-radius:50%;border:2px solid transparent}',
    '.sw.on{border-color:#1c211c}',
    '.add{display:grid;gap:8px;margin-top:12px}',
    '.chip{min-height:32px;padding:0 10px;border:1px solid var(--line);border-radius:999px;background:#fff;font-size:13px}',
    '.chip.on{background:var(--brand);color:#fff;border-color:transparent}',
    '.chips{display:flex;flex-wrap:wrap;gap:6px}',
    '@media (max-width:800px){.shell{grid-template-columns:1fr}.main{border-radius:0;padding:24px 16px 48px}.week{grid-template-columns:repeat(2,minmax(0,1fr))}}',
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
      slot('whop-public', 'Whop', 'Public forum', true, 'Ready'),
      slot('whop-weekly', 'Whop', 'Weekly Analysis', true, 'Members')
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
      { id: 'trading', name: 'Trading', site: 'maxmaserati.com', blurb: 'Pages, ads, and Whop.', organic: tradingOrg, ads: ads('tr-ad-') },
      { id: 'table', name: 'Table Fifty', site: 'tablefifty.co.uk', blurb: 'Half-price tables and delivery, UK-wide.', organic: blank('tf-'), ads: ads('tf-ad-') },
      { id: 'ayiti', name: 'Ayiti P2P', site: 'ayitip2p.com', blurb: 'Its own business.', organic: blank('ap-'), ads: ads('ap-ad-') }
    ];
  }

  function freshPack(prefix) {
    function slot(id, network, name, live, note) {
      return { id: id, network: network, name: name, live: !!live, note: note || (live ? 'Ready to publish' : 'Not connected') };
    }
    return {
      organic: ORGANIC.map(function (n) { return slot(prefix + n[0], n[1], 'Connect a page', false); }),
      ads: ADS.map(function (a) { return slot(prefix + a[0], a[1], a[2], false, 'Add a funded ad account to run this'); })
    };
  }
  function limitOf(network) {
    var hit = ORGANIC.filter(function (n) { return n[1] === network; })[0];
    if (network === 'Whop') return 5000;
    return hit ? hit[2] : 5000;
  }
  function letter(network) { return (network || '?').replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase(); }

  var BRANDS = {"Facebook":{"bg":"#1877F2","fg":"#fff","d":"M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"},"Instagram":{"bg":"#E1306C","fg":"#fff","d":"M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"},"TikTok":{"bg":"#111111","fg":"#fff","d":"M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"},"YouTube":{"bg":"#FF0000","fg":"#fff","d":"M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"},"X":{"bg":"#0A0A0A","fg":"#fff","d":"M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"},"LinkedIn":{"bg":"#0A66C2","fg":"#fff","d":"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"},"Threads":{"bg":"#111111","fg":"#fff","d":"M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z"},"Pinterest":{"bg":"#E60023","fg":"#fff","d":"M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"},"Bluesky":{"bg":"#1185FE","fg":"#fff","d":"M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"},"Google Business":{"bg":"#fff","fg":"#4285F4","d":"M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"},"Snapchat":{"bg":"#FFFC00","fg":"#111","d":"M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"},"Telegram":{"bg":"#26A5E4","fg":"#fff","d":"M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"},"Discord":{"bg":"#5865F2","fg":"#fff","d":"M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"},"WhatsApp":{"bg":"#25D366","fg":"#fff","d":"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"},"Reddit":{"bg":"#FF4500","fg":"#fff","d":"M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z"},"Meta Ads":{"bg":"#0668E1","fg":"#fff","d":"M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"},"Whop":{"bg":"#FF4D00","fg":"#fff","d":""},"YouTube Ads":{"bg":"#FF0000","fg":"#fff","d":"M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"},"TikTok Ads":{"bg":"#111111","fg":"#fff","d":"M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"},"X Ads":{"bg":"#0A0A0A","fg":"#fff","d":"M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"},"LinkedIn Ads":{"bg":"#0A66C2","fg":"#fff","d":"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"},"Google Ads":{"bg":"#fff","fg":"#4285F4","d":"M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"},"Pinterest Ads":{"bg":"#E60023","fg":"#fff","d":"M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"},"Snapchat Ads":{"bg":"#FFFC00","fg":"#111","d":"M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"}};
  function logo(network) {
    var b = BRANDS[network];
    var wrap = document.createElement('span');
    wrap.className = 'logo';
    wrap.title = network || '';
    if (!b) { wrap.textContent = letter(network); return wrap; }
    wrap.style.background = b.bg;
    wrap.style.color = b.fg;
    if (!b.d) {
      wrap.textContent = 'W';
      wrap.style.font = '700 15px/1 "Barlow Condensed",sans-serif';
      return wrap;
    }
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'currentColor');
    path.setAttribute('d', b.d);
    svg.appendChild(path);
    wrap.appendChild(svg);
    return wrap;
  }


  var LOGIN = {
    Facebook: 'https://www.facebook.com/',
    Instagram: 'https://www.instagram.com/',
    TikTok: 'https://www.tiktok.com/',
    YouTube: 'https://www.youtube.com/',
    X: 'https://x.com/',
    LinkedIn: 'https://www.linkedin.com/',
    Threads: 'https://www.threads.net/',
    Pinterest: 'https://www.pinterest.com/',
    Bluesky: 'https://bsky.app/',
    'Google Business': 'https://business.google.com/',
    Snapchat: 'https://www.snapchat.com/',
    Telegram: 'https://web.telegram.org/',
    Discord: 'https://discord.com/channels/@me',
    WhatsApp: 'https://web.whatsapp.com/',
    Reddit: 'https://www.reddit.com/',
    Whop: 'https://whop.com/',
    'Meta Ads': 'https://adsmanager.facebook.com/',
    'YouTube Ads': 'https://ads.google.com/',
    'TikTok Ads': 'https://ads.tiktok.com/',
    'X Ads': 'https://ads.x.com/',
    'LinkedIn Ads': 'https://www.linkedin.com/campaignmanager/',
    'Google Ads': 'https://ads.google.com/',
    'Pinterest Ads': 'https://ads.pinterest.com/',
    'Snapchat Ads': 'https://ads.snapchat.com/'
  };

  var FORMATS = {
    Facebook: ['Post', 'Reel', 'Story'],
    Instagram: ['Post', 'Reel', 'Story', 'Carousel'],
    TikTok: ['Video', 'Photo', 'Story'],
    YouTube: ['Video', 'Short'],
    X: ['Post', 'Thread'],
    LinkedIn: ['Post', 'Article'],
    Threads: ['Post'],
    Pinterest: ['Pin', 'Idea Pin'],
    Bluesky: ['Post'],
    'Google Business': ['Update', 'Offer', 'Event'],
    Snapchat: ['Story', 'Spotlight'],
    Telegram: ['Post'],
    Discord: ['Message'],
    WhatsApp: ['Status', 'Broadcast'],
    Reddit: ['Post'],
    Whop: ['Forum post']
  };
  var INBOX = {
    Facebook: 'https://business.facebook.com/latest/inbox',
    Instagram: 'https://www.instagram.com/',
    TikTok: 'https://www.tiktok.com/',
    YouTube: 'https://studio.youtube.com/',
    X: 'https://x.com/notifications',
    LinkedIn: 'https://www.linkedin.com/messaging/',
    Threads: 'https://www.threads.net/',
    Pinterest: 'https://www.pinterest.com/',
    Bluesky: 'https://bsky.app/',
    'Google Business': 'https://business.google.com/',
    Snapchat: 'https://www.snapchat.com/',
    Telegram: 'https://web.telegram.org/',
    Discord: 'https://discord.com/channels/@me',
    WhatsApp: 'https://web.whatsapp.com/',
    Reddit: 'https://www.reddit.com/message/inbox/',
    Whop: 'https://whop.com/hub/'
  };
  function formatsFor(networks) {
    var out = [];
    (networks || []).forEach(function (n) {
      (FORMATS[n] || ['Post']).forEach(function (f) { if (out.indexOf(f) < 0) out.push(f); });
    });
    return out.length ? out : ['Post'];
  }
  function formatFor(network, picked) {
    var list = FORMATS[network] || ['Post'];
    return list.indexOf(picked) >= 0 ? picked : list[0];
  }
  function suggestedTags(bizId, networks, format) {
    var base = { trading: ['#MaxMaserati', '#trading'], table: ['#TableFifty', '#LondonEats'], ayiti: ['#AyitiP2P'] }[bizId] || ['#' + String(bizId || 'post').replace(/[^A-Za-z0-9]/g, '')];
    var extra = [];
    (networks || []).forEach(function (n) {
      var t = '#' + String(n).replace(/[^A-Za-z0-9]/g, '');
      if (extra.indexOf(t) < 0) extra.push(t);
    });
    if (format) extra.push('#' + String(format).replace(/[^A-Za-z0-9]/g, ''));
    return base.concat(extra).filter(function (t, i, a) { return t.length > 1 && a.indexOf(t) === i; });
  }

  function load() {
    var s = { biz: 'trading', mode: 'organic', tone: 'same', text: '', custom: {}, when: 'now', at: '', link: '', selected: ['fb', 'x'], items: [], extra: { trading: { organic: [], ads: [] }, table: { organic: [], ads: [] }, ayiti: { organic: [], ads: [] } }, wallets: {}, linked: {}, objective: 'Traffic', budget: '20', currency: 'GBP', start: '', end: '', audience: '', goal: 5, format: 'Post', tags: [], tagsCustom: false, autoReply: false, replyText: '', board: 'queue', apis: [], websites: {}, more: [], names: {}, looks: {}, view: 'accounts', theme: 'light', account: '', apps: { facebook: '', google: '' }, sessions: {} };
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!raw) return s;
      ['biz', 'mode', 'tone', 'text', 'when', 'at', 'link', 'objective', 'budget', 'currency', 'start', 'end', 'audience', 'format', 'replyText', 'board'].forEach(function (k) { if (raw[k] != null) s[k] = raw[k]; });
      if (raw.goal != null) s.goal = raw.goal;
      if (raw.tagsCustom != null) s.tagsCustom = !!raw.tagsCustom;
      if (raw.autoReply != null) s.autoReply = !!raw.autoReply;
      if (Array.isArray(raw.tags)) s.tags = raw.tags;
      if (Array.isArray(raw.selected)) s.selected = raw.selected;
      if (raw.custom) s.custom = raw.custom;
      if (Array.isArray(raw.items)) s.items = raw.items;
      if (raw.extra) s.extra = raw.extra;
      if (raw.wallets) s.wallets = raw.wallets;
      if (raw.linked) s.linked = raw.linked;
      if (Array.isArray(raw.apis)) s.apis = raw.apis;
      if (raw.websites && typeof raw.websites === 'object') s.websites = raw.websites;
      if (Array.isArray(raw.more)) s.more = raw.more;
      if (raw.names && typeof raw.names === 'object') s.names = raw.names;
      if (raw.looks && typeof raw.looks === 'object') s.looks = raw.looks;
      if (raw.theme === 'dark' || raw.theme === 'light') s.theme = raw.theme;
      if (raw.account) s.account = raw.account;
      if (raw.apps && typeof raw.apps === 'object') s.apps = { facebook: raw.apps.facebook || '', google: raw.apps.google || '' };
      if (raw.sessions && typeof raw.sessions === 'object') s.sessions = raw.sessions;
      if (raw.view === 'queue' || raw.view === 'post' || raw.view === 'accounts' || raw.view === 'setup' || raw.view === 'account') s.view = raw.view;
      return s;
    } catch (e) { return s; }
  }

  function lookOf(state, id) {
    var fixed = {
      trading: { bg:'#07080a', panel:'#101318', panel2:'#0b0d10', line:'#2a3038', accent:'#e1b31a', on:'#14120a', live:'#e1b31a', spend:'#e25b2a', spendOn:'#ffffff', bill:'#b7c0cc', billOn:'#14181e', why:'Black and gold. Premium and precise. Only Max Maserati wears this.' },
      table: { bg:'#0b1220', panel:'#121a2b', panel2:'#0e1626', line:'#2a3a56', accent:'#10b981', on:'#04261c', live:'#34d399', spend:'#f59e0b', spendOn:'#2b1a01', bill:'#7dd3fc', billOn:'#082033', why:'Emerald is the deal. Amber is the meal. Navy is the room.' },
      ayiti: { bg:'#101412', panel:'#171c19', panel2:'#121714', line:'#2c3832', accent:'#3ddc97', on:'#06150e', live:'#3ddc97', spend:'#3b6fe0', spendOn:'#ffffff', bill:'#e7d7b1', billOn:'#241a08', why:'Green is trust with the money. Blue is a paid ad. Sand is the wallet.' }
    };
    if (fixed[id]) return fixed[id];
    var key = (state.looks && state.looks[id]) || 'clear';
    var sw = {
      deal: { bg:'#0b1220', panel:'#121a2b', panel2:'#0e1626', line:'#2a3a56', accent:'#10b981', on:'#04261c', live:'#34d399', spend:'#f59e0b', spendOn:'#2b1a01', bill:'#7dd3fc', billOn:'#082033', why:'Deals. Green to act, amber when it costs.' },
      trust: { bg:'#101412', panel:'#171c19', panel2:'#121714', line:'#2c3832', accent:'#3ddc97', on:'#06150e', live:'#3ddc97', spend:'#3b6fe0', spendOn:'#ffffff', bill:'#e7d7b1', billOn:'#241a08', why:'Trust. Calm green, and a different color when money moves.' },
      clear: { bg:'#0c1018', panel:'#141a26', panel2:'#10151f', line:'#2a3548', accent:'#4c8dff', on:'#06101f', live:'#7eb0ff', spend:'#ff8a3d', spendOn:'#2a1204', bill:'#c9d4e3', billOn:'#14181e', why:'Clarity. Blue to explain, orange when you pay.' },
      energy: { bg:'#140c0c', panel:'#1c1212', panel2:'#160e0e', line:'#3a2424', accent:'#ff4d4d', on:'#ffffff', live:'#ff8a80', spend:'#ffb020', spendOn:'#2b1a01', bill:'#d7c4a3', billOn:'#241a08', why:'Energy. Red to be seen, gold only when it is an ad.' },
      community: { bg:'#100e16', panel:'#181522', panel2:'#14111c', line:'#322a42', accent:'#a78bfa', on:'#160c28', live:'#c4b5fd', spend:'#f472b6', spendOn:'#2a0a18', bill:'#ddd6fe', billOn:'#160c28', why:'Community. Violet for the people, pink when you boost it.' },
      craft: { bg:'#14110c', panel:'#1c1812', panel2:'#16130e', line:'#3a3226', accent:'#d97706', on:'#241403', live:'#fbbf24', spend:'#65a30d', spendOn:'#0c1a04', bill:'#fcd34d', billOn:'#241a08', why:'Craft. Warm brown-orange for the work, green for the spend.' }
    };
    return sw[key] || sw.clear;
  }
  function siteUrlOf(state, id) {
    var defaults = { trading: 'https://www.maxmaserati.com', table: 'https://tablefifty.co.uk', ayiti: 'https://ayitip2p.com' };
    var raw = (state.websites && state.websites[id]) || defaults[id] || '';
    raw = String(raw || '').trim();
    if (!raw) return '';
    if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
    return raw;
  }
  function siteHostOf(state, id) {
    try { return new URL(siteUrlOf(state, id)).host.replace(/^www\./, ''); } catch (e) { return ''; }
  }
  function businesses(state) {
    function apply(list) {
      return (list || []).map(function (p) {
        var o = state.linked && state.linked[p.id];
        if (!o) return p;
        return { id: p.id, network: p.network, name: o.name || p.name, live: true, note: 'Connected' };
      });
    }
    return seed().concat((state.more || []).filter(function (m) {
      return m && m.id && !seed().some(function (b) { return b.id === m.id; });
    }).map(function (m) {
      var pack = freshPack(m.id + '-');
      return { id: m.id, name: m.name || 'Business', site: '', blurb: 'Any page, any network.', organic: pack.organic, ads: pack.ads };
    })).map(function (b) {
      var ex = (state.extra && state.extra[b.id]) || { organic: [], ads: [] };
      var fromApi = { organic: [], ads: [] };
      (state.apis || []).forEach(function (api) {
        (api.pages || []).forEach(function (pg) {
          if (pg.biz !== b.id) return;
          var row = { id: pg.id, network: api.site, name: pg.name, live: true, note: 'API connected' };
          fromApi[pg.kind === 'ads' ? 'ads' : 'organic'].push(row);
        });
      });
      return {
        id: b.id, name: (state.names && state.names[b.id]) || b.name, site: siteHostOf(state, b.id) || b.site, url: siteUrlOf(state, b.id), blurb: b.blurb,
        organic: apply(b.organic.concat(ex.organic || []).concat(fromApi.organic)),
        ads: apply(b.ads.concat(ex.ads || []).concat(fromApi.ads))
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
    if (!document.getElementById('mmm-social-font')) {
      var font = document.createElement('link');
      font.id = 'mmm-social-font';
      font.rel = 'stylesheet';
      font.href = 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap';
      document.head.appendChild(font);
    }
    var state = load();
    state.view = 'queue';
    var pending = null;

    function publishCrm() {
      var rows = [];
      (state.items || []).forEach(function (item) {
        (item.pages || []).forEach(function (p) {
          var stats = item.stats || {};
          rows.push({
            id: item.id + ':' + p.id, biz: p.biz, site: p.site, network: p.network, name: p.name,
            format: (item.formats && item.formats[p.network]) || item.format || 'Post',
            tags: item.tags || [], status: item.status, when: item.when, at: item.at || item.saved || '',
            url: (item.links && item.links[p.id]) || '', dest: item.dest || '', website: p.url || '',
            post: item.id, bizId: p.bizId || '',
            views: stats.views || '', likes: stats.likes || '', comments: stats.comments || '', text: String(p.text || '').slice(0, 280)
          });
        });
      });
      try { localStorage.setItem('mmm.social.crm.v1', JSON.stringify(rows)); } catch (e) {}
      try {
        var sites = businesses(state).map(function (b) { return { id: b.id, name: b.name, url: b.url }; });
        localStorage.setItem('mmm.crm.websites.v1', JSON.stringify(sites));
      } catch (e2) {}
      try { if (global.parent !== global) global.parent.postMessage({ mmmSocialCrm: rows.length }, location.origin); } catch (e) {}
    }
    function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} publishCrm(); }
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
    function applyLook() {
      var L = lookOf(state, state.biz);
      var go = state.mode === 'ads' ? L.spend : state.mode === 'billing' ? L.bill : L.accent;
      var onGo = state.mode === 'ads' ? L.spendOn : state.mode === 'billing' ? L.billOn : L.on;
      wrap.style.setProperty('--brand', L.accent);
      wrap.style.setProperty('--brand2', L.live);
      wrap.style.setProperty('--live', L.live);
      wrap.style.setProperty('--on', L.on);
      wrap.style.setProperty('--go', go);
      wrap.style.setProperty('--on-go', onGo);
      wrap.style.setProperty('--spend', L.spend);
      wrap.style.setProperty('--bill', L.bill);
      wrap.style.setProperty('--bill-on', L.billOn);
    }
    var top = el('div', 'top');
    var titles = el('div');
    var h = el('h1', 'mark');
    h.appendChild(document.createTextNode('MMM '));
    h.appendChild(el('span', '', 'Social+'));
    titles.appendChild(h);
    var sub = el('p', 'sub', 'What is waiting to go out.');
    titles.appendChild(sub);
    var modes = el('div', 'modes');
    var bOrg = el('button', 'org', 'Organic');
    var bAds = el('button', 'ads', 'Paid ads');
    var bBill = el('button', 'bill', 'Billing');
    bOrg.type = bAds.type = bBill.type = 'button';
    modes.appendChild(bOrg); modes.appendChild(bAds); modes.appendChild(bBill);
    top.appendChild(titles); top.appendChild(modes);
    wrap.appendChild(top);
    var nav = el('nav', 'nav');
    [['accounts', 'Accounts'], ['queue', 'Queue'], ['post', 'Post'], ['setup', 'Setup']].forEach(function (pair) {
      var b = el('button', '', pair[1]);
      b.type = 'button';
      b.dataset.view = pair[0];
      b.addEventListener('click', function () { goView(pair[0]); });
      nav.appendChild(b);
    });
    wrap.appendChild(nav);

    var shell = el('div', 'shell');
    var left = el('aside', 'col rail');
    var mid = el('section', 'col work');
    var right = el('aside', 'col stagecol');
    var main = el('div', 'main');
    shell.appendChild(left); shell.appendChild(main);
    main.appendChild(mid); main.appendChild(right);
    var queue = el('section', 'col boardpage');
    main.appendChild(queue);
    var setupHost = el('div', 'setuphost');
    var accountHost = el('div', 'account');
    var newBiz = el('div', 'newbiz');
    main.appendChild(setupHost);
    main.appendChild(accountHost);
    wrap.appendChild(shell);

    var bizBox = el('div', 'bizs');
    var listBox = el('div');
    var addBox = el('div', 'add');
    var apiBox = el('div', 'apis');
    var plus = el('button', 'plus', 'New post');
    plus.type = 'button';
    plus.title = 'New post';
    plus.addEventListener('click', function () { state.mode = 'organic'; goView('post'); paintSide(); paintButtons(); paintPreview(); });
    var gear = el('button', 'gear', 'New business');
    gear.type = 'button';
    gear.addEventListener('click', function () { goView(state.view === 'setup' ? 'queue' : 'setup'); });
    var themeBtn = el('button', 'gear', 'Dark');
    themeBtn.type = 'button';
    themeBtn.addEventListener('click', function () {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      save();
      applyTheme();
    });
    left.appendChild(el('div', 'railbrand', 'Social+'));
    left.appendChild(plus);
    left.appendChild(bizBox);
    left.appendChild(el('h2', 'h', 'Accounts'));
    left.appendChild(listBox);
    left.appendChild(gear);
    left.appendChild(themeBtn);

    var cap = document.createElement('textarea');
    cap.placeholder = 'Write the post.';
    cap.className = 'paper';
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
    var okBtn = el('button', 'btn go', 'Approve');
    saveBtn.type = okBtn.type = 'button';
    actions.appendChild(saveBtn); actions.appendChild(okBtn);

    function field(label, node) {
      var wrap = el('div');
      wrap.appendChild(el('label', 'lab', label));
      wrap.appendChild(node);
      return wrap;
    }

    var close = el('button', 'x', 'Close');
    close.type = 'button';
    close.addEventListener('click', function () { goView('queue'); });
    mid.appendChild(close);
    mid.appendChild(modes);
    var dest = el('div', 'dest');
    mid.appendChild(dest);
    var tone = el('div', 'seg');
    var sameBtn = el('button', '', 'Same text');
    var customBtn = el('button', '', 'Different per account');
    sameBtn.type = customBtn.type = 'button';
    tone.appendChild(sameBtn); tone.appendChild(customBtn);
    mid.appendChild(tone);
    var capLab = el('label', 'lab caplab', 'Caption');
    mid.appendChild(capLab); mid.appendChild(cap); mid.appendChild(customBox);
    var organicExtra = el('div', 'organic');
    organicExtra.appendChild(field('Link', link));
    var whenLab = el('label', 'lab', 'When');
    organicExtra.appendChild(whenLab); organicExtra.appendChild(whenBox); organicExtra.appendChild(at);
    var formatBox = el('div');
    var tagBox = el('div');
    var replyBox = el('div');
    organicExtra.appendChild(formatBox);
    organicExtra.appendChild(tagBox);
    organicExtra.appendChild(replyBox);
    mid.appendChild(organicExtra);
    var adExtra = el('div', 'adpane');
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
    var billBox = el('div', 'wallet');
    mid.appendChild(billBox);
    mid.appendChild(actions);
    mid.appendChild(msg);

    right.appendChild(el('h2', 'h', 'Preview'));
    var stage = el('div', 'stage');
    var preview = el('div', 'phone');
    stage.appendChild(preview);
    right.appendChild(stage);
    mid.appendChild(stage);

    function setPressed(btn, on) { btn.setAttribute('aria-pressed', on ? 'true' : 'false'); }
    function goView(name) {
      state.view = name;
      save();
      applyView();
    }
    function applyTheme() {
      wrap.dataset.theme = state.theme === 'dark' ? 'dark' : 'light';
      themeBtn.textContent = state.theme === 'dark' ? 'Light' : 'Dark';
    }
    function applyView() {
      var name = state.view || 'queue';
      wrap.dataset.view = name;
      nav.querySelectorAll('button').forEach(function (b) { setPressed(b, b.dataset.view === name); });
      sub.textContent = name === 'post' ? 'Write it once. The phone is what people will see.' : name === 'queue' ? 'What is waiting to go out.' : name === 'setup' ? 'The business, its website, and any other API.' : 'The pages for this business. The color follows the one you select.';
      var open = wrap.querySelector('.setup');
      if (open) open.open = name === 'setup';
    }
    function paintDest() {
      dest.replaceChildren();
      var picks = chosen();
      if (!picks.length) { dest.appendChild(el('p', 'msg', 'Pick a logo on the left.')); return; }
      picks.forEach(function (x) { dest.appendChild(logo(x.plat.network)); });
    }

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
      var saveCard = el('button', 'btn go', 'Save card');
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
        var tone = lookOf(state, b.id);
        btn.style.setProperty('--biz', tone.accent);
        btn.addEventListener('click', function () { state.biz = b.id; save(); applyLook(); paintBiz(); paintSide(); paintPreview(); paintBilling(); paintButtons(); });
        bizBox.appendChild(btn);
      });
      var add = el('div', 'card');
      add.appendChild(el('div', 'who', 'New business'));
      var nm = document.createElement('input');
      nm.placeholder = 'Business name';
      nm.style.marginTop = '8px';
      var site = document.createElement('input');
      site.type = 'url';
      site.placeholder = 'https://website';
      site.style.marginTop = '8px';
      var picked = 'clear';
      var swatches = el('div', 'swatches');
      ['deal', 'trust', 'clear', 'energy', 'community', 'craft'].forEach(function (key) {
        var sw = el('button', 'sw' + (key === picked ? ' on' : ''));
        sw.type = 'button';
        sw.title = lookOf({ looks: { x: key } }, 'x').why;
        sw.style.background = lookOf({ looks: { x: key } }, 'x').accent;
        sw.addEventListener('click', function () {
          picked = key;
          swatches.querySelectorAll('button').forEach(function (n) { n.classList.remove('on'); });
          sw.classList.add('on');
        });
        swatches.appendChild(sw);
      });
      add.appendChild(swatches);
      var go = el('button', 'btn go', 'Add business');
      go.type = 'button';
      go.style.marginTop = '8px';
      go.addEventListener('click', function () {
        var label = nm.value.trim();
        if (!label) { msg.className = 'msg bad'; msg.textContent = 'Name the business.'; return; }
        var id = (label.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16) || 'biz') + Date.now().toString(36).slice(-4);
        state.more = state.more || [];
        state.more.push({ id: id, name: label });
        state.extra[id] = { organic: [], ads: [] };
        state.looks = state.looks || {};
        state.looks[id] = picked;
        state.websites = state.websites || {};
        if (site.value.trim()) state.websites[id] = site.value.trim();
        state.biz = id;
        nm.value = '';
        site.value = '';
        save();
        msg.className = 'msg ok';
        msg.textContent = label + ' is on the desk. Connect any pages you want.';
        paintBiz(); paintSide(); paintPreview(); paintButtons();
      });
      add.appendChild(nm);
      add.appendChild(site);
      add.appendChild(go);
      newBiz.replaceChildren(add);
    }

    function paintSide() {
      var b = businesses(state).filter(function (x) { return x.id === state.biz; })[0];
      listBox.replaceChildren();
      listBox.className = 'side';
    var setup = document.createElement('details');
    setup.className = 'setup';
    var sum = document.createElement('summary');
    sum.textContent = 'Business';
    setup.appendChild(sum);
    setup.appendChild(el('p', 'msg', lookOf(state, b.id).why));
      var nameLab = el('label', 'lab', 'Name');
      var nameIn = document.createElement('input');
      nameIn.value = b.name;
      nameIn.addEventListener('change', function () {
        var label = nameIn.value.trim();
        if (!label) return;
        state.names = state.names || {};
        state.names[b.id] = label;
        (state.more || []).forEach(function (m) { if (m.id === b.id) m.name = label; });
        save();
        paintBiz();
      });
      setup.appendChild(nameLab);
      setup.appendChild(nameIn);
      var webLab = el('label', 'lab', 'Website');
      var web = document.createElement('input');
      web.type = 'url';
      web.placeholder = 'https://';
      web.value = b.url || '';
      web.addEventListener('change', function () {
        state.websites = state.websites || {};
        state.websites[b.id] = web.value.trim();
        save();
        paintBiz();
      });
      setup.appendChild(webLab);
      setup.appendChild(web);
      setup.appendChild(el('p', 'msg', 'The CRM ranks which post brought the visit.'));
      var walletBtn = el('button', 'btn', 'Wallet');
      walletBtn.type = 'button';
      walletBtn.addEventListener('click', function () { state.mode = 'billing'; goView('post'); paintBilling(); paintButtons(); });
      setup.appendChild(walletBtn);
      if ((state.more || []).some(function (m) { return m.id === b.id; })) {
        var colors = el('div', 'swatches');
        ['deal', 'trust', 'clear', 'energy', 'community', 'craft'].forEach(function (key) {
          var sw = el('button', 'sw' + (((state.looks && state.looks[b.id]) || 'clear') === key ? ' on' : ''));
          sw.type = 'button';
          sw.title = lookOf({ looks: { x: key } }, 'x').why;
          sw.style.background = lookOf({ looks: { x: key } }, 'x').accent;
          sw.addEventListener('click', function () {
            state.looks = state.looks || {};
            state.looks[b.id] = key;
            save();
            applyLook();
            paintBiz();
            paintSide();
          });
          colors.appendChild(sw);
        });
        setup.appendChild(colors);
        var snip = el('p', 'msg', '');
        snip.textContent = 'On this website, add: <script src="https://www.maxmaserati.com/admin/social/track.js" data-biz="' + b.id + '"></script>';
        setup.appendChild(snip);
        var drop = el('button', 'btn', 'Remove business');
        drop.type = 'button';
        drop.style.marginTop = '8px';
        drop.addEventListener('click', function () {
          state.more = state.more.filter(function (m) { return m.id !== b.id; });
          if (state.biz === b.id) state.biz = 'trading';
          save();
          paintBiz(); paintSide(); paintPreview(); paintButtons();
        });
        setup.appendChild(drop);
      }
      setupHost.replaceChildren();
      var shut = el('button', 'x', 'Close');
      shut.type = 'button';
      shut.addEventListener('click', function () { goView('queue'); });
      setupHost.appendChild(shut);
      setupHost.appendChild(setup);
      setupHost.appendChild(newBiz);
      setupHost.appendChild(addBox);
      setupHost.appendChild(apiBox);
      var feed = el('div', 'feed');
      var rows = state.mode === 'ads' ? b.ads : b.organic;
      if (pending && rows.some(function (r) { return r.id === pending.id; })) {
        var box = el('div', 'card');
        var url = LOGIN[pending.network];
        box.appendChild(el('div', 'who', 'Sign in · ' + pending.network));
        box.appendChild(el('p', 'msg', 'One login can hold several pages. Sign in, then assign each page to a business.'));
        if (url) {
          var a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.className = 'btn go';
          a.textContent = 'Open ' + pending.network + ' login';
          box.appendChild(a);
        }
        var pageName = document.createElement('input');
        pageName.placeholder = 'Page, channel, or @handle';
        pageName.value = pending.name || '';
        pageName.style.marginTop = '8px';
        var bizPick = document.createElement('select');
        businesses(state).forEach(function (bb) {
          var o = document.createElement('option');
          o.value = bb.id;
          o.textContent = bb.name;
          if (bb.id === state.biz) o.selected = true;
          bizPick.appendChild(o);
        });
        bizPick.style.marginTop = '8px';
        var done = el('button', 'btn', 'Add page to this business');
        done.type = 'button';
        done.style.marginTop = '8px';
        done.addEventListener('click', function () {
          var label = pageName.value.trim();
          if (!label || label === 'Connect a page') { msg.className = 'msg bad'; msg.textContent = 'Name the page on this login.'; return; }
          var bizId = bizPick.value;
          state.extra[bizId] = state.extra[bizId] || { organic: [], ads: [] };
          var id = uid(bizId);
          var kind = state.mode === 'ads' ? 'ads' : 'organic';
          state.extra[bizId][kind].push({ id: id, network: pending.network, name: label, live: true, note: 'Connected' });
          if (state.selected.indexOf(id) < 0) state.selected.push(id);
          pageName.value = '';
          pending.name = '';
          save();
          msg.className = 'msg ok';
          msg.textContent = label + ' is on ' + (businesses(state).filter(function (x) { return x.id === bizId; })[0] || {}).name + '. Add another page from the same login, or switch business.';
          paintBiz(); paintSide(); paintCustom(); paintPreview(); paintButtons();
        });
        box.appendChild(pageName);
        box.appendChild(bizPick);
        box.appendChild(done);
        setupHost.appendChild(box);
      }
      var real = rows.filter(function (p) { return p.name && p.name !== 'Connect a page'; });
      var shown = real.length ? real : rows;
      shown.forEach(function (p) {
        var on = state.selected.indexOf(p.id) >= 0;
        var open = state.view === 'account' && state.account === p.network;
        var btn = el('button', 'acc' + (on ? ' on' : '') + (open ? ' open' : ''));
        btn.type = 'button';
        var mark = logo(p.network);
        var dot = el('span', 'dot' + (p.live ? ' live' : ''));
        var g = el('span', 'grow');
        var pageLabel = (!p.name || p.name === 'Connect a page') ? 'Sign in' : p.name;
        g.appendChild(el('span', 'nm', p.network));
        g.appendChild(el('span', 'meta', pageLabel));
        btn.appendChild(mark); btn.appendChild(g); btn.appendChild(dot);
        btn.addEventListener('click', function () {
          state.account = p.network;
          goView('account');
          if (p.network === 'Facebook' || p.network === 'Instagram' || p.network === 'Threads' || p.network === 'Meta Ads') {
            var ses = state.sessions.Facebook;
            if (ses && ses.token) pullSession('Facebook');
            else paintAccount();
            return;
          }
          if (p.live && p.name && p.name !== 'Connect a page') {
            paintAccount();
            return;
          }
          var login = LOGIN[p.network];
          if (login) window.open(login, '_blank', 'noopener,noreferrer');
          paintAccount();
        });
        feed.appendChild(btn);
      });
      listBox.appendChild(feed);
      addBox.replaceChildren();
      var net = document.createElement('select');
      var catalog = state.mode === 'ads' ? ADS.map(function (a) { return a[1]; }) : ORGANIC.map(function (n) { return n[1]; }).concat(['Whop']);
      catalog.forEach(function (n) { var o = document.createElement('option'); o.textContent = n; net.appendChild(o); });
      var name = document.createElement('input');
      name.placeholder = state.mode === 'ads' ? 'Ad account name' : 'Page or @handle';
      var go = el('button', 'btn', state.mode === 'ads' ? 'Add ad account' : 'Add page');
      go.type = 'button';
      go.addEventListener('click', function () {
        var label = name.value.trim();
        if (!label) return;
        state.extra[b.id] = state.extra[b.id] || { organic: [], ads: [] };
        var id = uid(b.id);
        var row = { id: id, network: net.value, name: label, live: false, note: 'Saved. Tell me when the login is connected.' };
        state.extra[b.id][state.mode === 'ads' ? 'ads' : 'organic'].push(row);
        state.selected.push(id);
        name.value = '';
        save(); paintSide(); paintCustom(); paintPreview();
      });
      addBox.appendChild(net); addBox.appendChild(name); addBox.appendChild(go);
      paintApis(apiBox);
    }

    function connectFacebook(relogin) {
      sessionStorage.setItem('mmm.oauth.net', 'Facebook');
      sessionStorage.setItem('mmm.oauth.view', state.account || 'Facebook');
      var url = 'https://www.facebook.com/v21.0/dialog/oauth?client_id=1107484722267711&redirect_uri=' + encodeURIComponent(OAUTH_REDIRECT) + '&response_type=token&display=popup&scope=' + encodeURIComponent('public_profile,pages_show_list,pages_read_engagement,instagram_basic,business_management') + (relogin ? '&auth_type=reauthenticate' : '');
      var pop = window.open(url, 'mmm-facebook', 'width=520,height=720');
      if (!pop) location.href = url;
    }
    function paintAccount() {
      var network = state.account || 'Facebook';
      var meta = network === 'Facebook' || network === 'Instagram' || network === 'Threads' || network === 'Meta Ads';
      accountHost.replaceChildren();
      var shut = el('button', 'x', 'Back to the week');
      shut.type = 'button';
      shut.addEventListener('click', function () { goView('queue'); });
      accountHost.appendChild(shut);
      var top = el('div', 'acctop');
      top.appendChild(logo(network));
      top.appendChild(el('h2', '', network));
      accountHost.appendChild(top);
      if (meta) {
        var ses = state.sessions.Facebook || {};
        var found = network === 'Instagram' ? (ses.instagram || []) : (ses.pages || []);
        if (ses.user) accountHost.appendChild(el('p', 'msg', 'Signed in as ' + ses.user + '. Choose a page.'));
        else accountHost.appendChild(el('p', 'msg', 'Sign in with Facebook. Then choose the page for each business.'));
        if (ses.loading) accountHost.appendChild(el('p', 'msg', 'Reading your pages…'));
        if (ses.error) accountHost.appendChild(el('p', 'msg bad', ses.error));
        if (!ses.token) {
          var connect = el('button', 'btn go', 'Sign in with Facebook');
          connect.type = 'button';
          connect.addEventListener('click', function () { connectFacebook(false); });
          accountHost.appendChild(connect);
        }
        found.forEach(function (page) {
          var row = el('div', 'pagerow');
          var g = el('div', 'grow');
          g.appendChild(el('b', '', page.name));
          var where = '';
          businesses(state).forEach(function (biz) {
            var bag = (state.extra[biz.id] && state.extra[biz.id][state.mode === 'ads' ? 'ads' : 'organic']) || [];
            bag.forEach(function (p) { if (p.remoteId === page.id) where = biz.name; });
          });
          g.appendChild(el('span', '', where ? ('On ' + where) : 'Not on a business yet'));
          row.appendChild(g);
          var bizPick = document.createElement('select');
          businesses(state).forEach(function (bb) {
            var o = document.createElement('option');
            o.value = bb.id; o.textContent = bb.name;
            if (bb.id === state.biz) o.selected = true;
            bizPick.appendChild(o);
          });
          var use = el('button', 'btn go', where ? 'Move' : 'Use');
          use.type = 'button';
          use.addEventListener('click', function () {
            var bizId = bizPick.value;
            var id = network.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + page.id;
            state.extra[bizId] = state.extra[bizId] || { organic: [], ads: [] };
            var kind = state.mode === 'ads' ? 'ads' : 'organic';
            var bag = state.extra[bizId][kind];
            if (!bag.some(function (p) { return p.id === id; })) bag.push({ id: id, network: network, name: page.name, live: true, note: 'From the login', remoteId: page.id });
            if (state.selected.indexOf(id) < 0) state.selected.push(id);
            save();
            paintBiz(); paintSide(); paintAccount(); paintPreview(); paintButtons();
          });
          row.appendChild(bizPick);
          row.appendChild(use);
          accountHost.appendChild(row);
        });
        if (ses.token && !found.length && !ses.loading && !ses.error) accountHost.appendChild(el('p', 'msg', 'This login has no ' + network + ' page.'));
        if (ses.token) {
          var other = el('button', 'btn', 'Use a different Facebook account');
          other.type = 'button';
          other.style.marginTop = '16px';
          other.addEventListener('click', function () { connectFacebook(true); });
          accountHost.appendChild(other);
        }
        return;
      }
      accountHost.appendChild(el('p', 'msg', 'One ' + network + ' login can hold several pages. Sign in, then send each page to the business it belongs to.'));
      var url = LOGIN[network];
      if (url) {
        var a = el('button', 'btn go', 'Open ' + network);
        a.type = 'button';
        a.addEventListener('click', function () { window.open(url, '_blank', 'noopener,noreferrer'); });
        accountHost.appendChild(a);
      }
      var pages = [];
      businesses(state).forEach(function (biz) {
        ['organic', 'ads'].forEach(function (kind) {
          (biz[kind] || []).forEach(function (p) {
            if (p.network === network && p.name && p.name !== 'Connect a page') pages.push({ biz: biz, page: p });
          });
        });
      });
      accountHost.appendChild(el('p', 'kicker', pages.length ? 'Pages on this login' : 'No page on this login yet'));
      pages.forEach(function (hit) {
        var row = el('div', 'pagerow');
        var g = el('div', 'grow');
        g.appendChild(el('b', '', hit.page.name));
        g.appendChild(el('span', '', hit.biz.name));
        row.appendChild(g);
        var use = el('button', 'btn' + (state.selected.indexOf(hit.page.id) >= 0 ? ' go' : ''), state.selected.indexOf(hit.page.id) >= 0 ? 'Using' : 'Use');
        use.type = 'button';
        use.addEventListener('click', function () {
          var i = state.selected.indexOf(hit.page.id);
          if (i >= 0) state.selected.splice(i, 1); else state.selected.push(hit.page.id);
          save();
          paintAccount();
          paintSide();
          paintPreview();
          paintButtons();
        });
        row.appendChild(use);
        accountHost.appendChild(row);
      });
      accountHost.appendChild(el('label', 'lab', 'Add a page from this login'));
      var pageName = document.createElement('input');
      pageName.placeholder = 'Page, channel, or @handle';
      var bizPick = document.createElement('select');
      businesses(state).forEach(function (bb) {
        var o = document.createElement('option');
        o.value = bb.id;
        o.textContent = bb.name;
        if (bb.id === state.biz) o.selected = true;
        bizPick.appendChild(o);
      });
      bizPick.style.marginTop = '8px';
      var done = el('button', 'btn go', 'Add page');
      done.type = 'button';
      done.style.marginTop = '8px';
      done.addEventListener('click', function () {
        var label = pageName.value.trim();
        if (!label) { msg.className = 'msg bad'; msg.textContent = 'Name the page.'; return; }
        var bizId = bizPick.value;
        state.extra[bizId] = state.extra[bizId] || { organic: [], ads: [] };
        var kind = state.mode === 'ads' ? 'ads' : 'organic';
        var id = uid(bizId);
        state.extra[bizId][kind].push({ id: id, network: network, name: label, live: true, note: 'Connected' });
        if (state.selected.indexOf(id) < 0) state.selected.push(id);
        pageName.value = '';
        save();
        msg.className = 'msg ok';
        msg.textContent = label + ' is on ' + (businesses(state).filter(function (x) { return x.id === bizId; })[0] || {}).name + '.';
        paintBiz();
        paintSide();
        paintAccount();
        paintPreview();
        paintButtons();
      });
      accountHost.appendChild(pageName);
      accountHost.appendChild(bizPick);
      accountHost.appendChild(done);
    }
    function pullSession(which) {
      var ses = state.sessions[which];
      if (!ses || !ses.token) return;
      ses.loading = true;
      ses.error = '';
      paintAccount();
      if (which === 'Facebook') {
        var token = ses.token;
        Promise.all([
          fetch('https://graph.facebook.com/v21.0/me?fields=id,name&access_token=' + encodeURIComponent(token)).then(function (r) { return r.json(); }),
          fetch('https://graph.facebook.com/v21.0/me/accounts?fields=id,name,instagram_business_account{id,username,name}&limit=100&access_token=' + encodeURIComponent(token)).then(function (r) { return r.json(); })
        ]).then(function (pair) {
          var me = pair[0] || {}, acc = pair[1] || {};
          if (me.error || acc.error) {
            ses.loading = false;
            ses.error = (acc.error && acc.error.message) || (me.error && me.error.message) || 'Facebook refused the login.';
            if (/expired|validating|session/i.test(ses.error)) ses.token = '';
            save(); paintAccount(); return;
          }
          ses.user = me.name || ses.user || '';
          ses.pages = (acc.data || []).map(function (p) { return { id: p.id, name: p.name }; });
          ses.instagram = [];
          (acc.data || []).forEach(function (p) {
            var ig = p.instagram_business_account;
            if (ig) ses.instagram.push({ id: ig.id, name: ig.username ? ('@' + ig.username) : (ig.name || 'Instagram'), via: p.name });
          });
          ses.loading = false;
          save(); paintAccount(); paintSide();
        }).catch(function () { ses.loading = false; ses.error = 'Could not reach Facebook.'; save(); paintAccount(); });
        return;
      }
      var gtoken = ses.token;
      fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&access_token=' + encodeURIComponent(gtoken)).then(function (r) { return r.json(); }).then(function (data) {
        if (data.error) {
          ses.loading = false;
          ses.error = data.error.message || 'Google refused the login.';
          if (/invalid|expired/i.test(ses.error)) ses.token = '';
          save(); paintAccount(); return null;
        }
        ses.channels = (data.items || []).map(function (c) { return { id: c.id, name: (c.snippet && c.snippet.title) || 'YouTube' }; });
        return fetch('https://www.googleapis.com/oauth2/v2/userinfo?access_token=' + encodeURIComponent(gtoken)).then(function (r) { return r.json(); }).catch(function () { return {}; });
      }).then(function (info) {
        if (!info) return;
        if (info.email) ses.user = info.email;
        ses.loading = false;
        save(); paintAccount(); paintSide();
      }).catch(function () { ses.loading = false; ses.error = 'Could not reach Google.'; save(); paintAccount(); });
    }

    function takeToken(which, token, view) {
      if (!which || (which !== 'Facebook' && which !== 'Google')) which = 'Facebook';
      state.sessions[which] = state.sessions[which] || {};
      state.sessions[which].token = token;
      state.sessions[which].error = '';
      if (view) state.account = view;
      save();
      goView('account');
      pullSession(which);
    }

    function paintApis(host) {
      var card = el('div', 'card');
      card.appendChild(el('div', 'who', 'Any site API'));
      card.appendChild(el('p', 'msg', 'Connect a site that is not in the list. The key stays in this browser. It is not saved on the website.'));
      var site = document.createElement('input');
      site.placeholder = 'Site name';
      var login = document.createElement('input');
      login.type = 'url';
      login.placeholder = 'Login URL';
      var api = document.createElement('input');
      api.type = 'url';
      api.placeholder = 'API URL';
      var key = document.createElement('input');
      key.type = 'password';
      key.placeholder = 'API key';
      key.autocomplete = 'off';
      [site, login, api, key].forEach(function (n) { n.style.marginTop = '8px'; card.appendChild(n); });
      var saveApi = el('button', 'btn go', 'Save API');
      saveApi.type = 'button';
      saveApi.style.marginTop = '8px';
      saveApi.addEventListener('click', function () {
        var label = site.value.trim();
        if (!label) { msg.className = 'msg bad'; msg.textContent = 'Name the site.'; return; }
        var row = { id: uid('api'), site: label, login: login.value.trim(), api: api.value.trim(), token: key.value, ok: '', pages: [] };
        state.apis.push(row);
        site.value = login.value = api.value = key.value = '';
        save();
        msg.className = 'msg ok';
        msg.textContent = label + ' API saved on this browser. Add a page and pick the business.';
        paintSide();
      });
      card.appendChild(saveApi);
      (state.apis || []).forEach(function (row) {
        var block = el('div', 'qitem');
        block.appendChild(el('div', 'nm', row.site));
        block.appendChild(el('p', 'msg', row.ok || (row.token ? 'Key saved on this browser.' : 'No key yet.') + (row.api ? ' · ' + row.api : '')));
        if (row.login) {
          var open = document.createElement('a');
          open.href = row.login;
          open.target = '_blank';
          open.rel = 'noopener noreferrer';
          open.className = 'btn';
          open.textContent = 'Open login';
          block.appendChild(open);
        }
        var test = el('button', 'btn', 'Test API');
        test.type = 'button';
        test.style.marginTop = '8px';
        test.addEventListener('click', function () {
          if (!row.api) { row.ok = 'Add an API URL first.'; save(); paintSide(); return; }
          var headers = {};
          if (row.token) headers.Authorization = 'Bearer ' + row.token;
          fetch(row.api, { headers: headers }).then(function (res) {
            row.ok = res.ok ? ('Connected · HTTP ' + res.status) : ('HTTP ' + res.status);
            save(); paintSide();
          }).catch(function () {
            row.ok = 'Saved. This browser could not call that API (often blocked by the site). The key is still stored here.';
            save(); paintSide();
          });
        });
        block.appendChild(test);
        var page = document.createElement('input');
        page.placeholder = 'Page or account on this API';
        page.style.marginTop = '8px';
        var bizPick = document.createElement('select');
        businesses(state).forEach(function (bb) {
          var o = document.createElement('option');
          o.value = bb.id;
          o.textContent = bb.name;
          if (bb.id === state.biz) o.selected = true;
          bizPick.appendChild(o);
        });
        bizPick.style.marginTop = '8px';
        var kind = document.createElement('select');
        [['organic', 'Organic page'], ['ads', 'Ad account']].forEach(function (pair) {
          var o = document.createElement('option');
          o.value = pair[0];
          o.textContent = pair[1];
          kind.appendChild(o);
        });
        kind.style.marginTop = '8px';
        var add = el('button', 'btn', 'Add page to business');
        add.type = 'button';
        add.style.marginTop = '8px';
        add.addEventListener('click', function () {
          var label = page.value.trim();
          if (!label) return;
          row.pages = row.pages || [];
          var id = uid('pg');
          row.pages.push({ id: id, name: label, biz: bizPick.value, kind: kind.value });
          if (state.selected.indexOf(id) < 0) state.selected.push(id);
          page.value = '';
          save();
          msg.className = 'msg ok';
          msg.textContent = label + ' added. Switch business if you assigned it somewhere else.';
          paintBiz(); paintSide(); paintPreview(); paintButtons();
        });
        block.appendChild(page);
        block.appendChild(bizPick);
        block.appendChild(kind);
        block.appendChild(add);
        (row.pages || []).forEach(function (pg) {
          var bizName = (businesses(state).filter(function (x) { return x.id === pg.biz; })[0] || {}).name || pg.biz;
          var line = el('div', 'msg', pg.name + ' · ' + bizName + ' · ' + (pg.kind === 'ads' ? 'Ad' : 'Organic'));
          var rm = el('button', 'btn', 'Remove');
          rm.type = 'button';
          rm.addEventListener('click', function () {
            row.pages = row.pages.filter(function (x) { return x.id !== pg.id; });
            state.selected = state.selected.filter(function (x) { return x !== pg.id; });
            save(); paintBiz(); paintSide(); paintPreview();
          });
          block.appendChild(line);
          block.appendChild(rm);
        });
        var drop = el('button', 'btn', 'Remove API');
        drop.type = 'button';
        drop.style.marginTop = '8px';
        drop.addEventListener('click', function () {
          var ids = (row.pages || []).map(function (pg) { return pg.id; });
          state.apis = state.apis.filter(function (x) { return x.id !== row.id; });
          state.selected = state.selected.filter(function (x) { return ids.indexOf(x) < 0; });
          save(); paintBiz(); paintSide(); paintPreview();
        });
        block.appendChild(drop);
        card.appendChild(block);
      });
      host.appendChild(card);
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
        var who = el('div', 'who');
        who.appendChild(logo(hit.plat.network));
        var whoText = el('div');
        whoText.appendChild(el('b', '', hit.plat.network));
        whoText.appendChild(el('span', '', hit.plat.name + (state.mode === 'organic' ? (' · ' + formatFor(hit.plat.network, state.format)) : '')));
        who.appendChild(whoText);
        card.appendChild(who);
        card.appendChild(el('p', '', text || 'Caption will show here.'));
        if (state.mode === 'organic' && state.tags && state.tags.length) card.appendChild(el('p', 'msg', state.tags.join(' ')));
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
      applyLook();
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
      paintFormat();
      paintTags();
      paintReply();
      paintDest();
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

    function chosenNetworks() {
      return chosen().map(function (h) { return h.plat.network; });
    }
    function paintFormat() {
      formatBox.replaceChildren();
      if (state.mode !== 'organic') return;
      formatBox.appendChild(el('label', 'lab', 'Post type'));
      var list = formatsFor(chosenNetworks());
      if (list.indexOf(state.format) < 0) state.format = list[0];
      var row = el('div', 'chips');
      list.forEach(function (f) {
        var b = el('button', 'chip' + (state.format === f ? ' on' : ''), f);
        b.type = 'button';
        b.addEventListener('click', function () {
          state.format = f;
          if (!state.tagsCustom) state.tags = suggestedTags(state.biz, chosenNetworks(), f);
          save(); paintFormat(); paintTags(); paintPreview();
        });
        row.appendChild(b);
      });
      formatBox.appendChild(row);
    }
    function paintTags() {
      tagBox.replaceChildren();
      if (state.mode !== 'organic') return;
      if (!state.tagsCustom) state.tags = suggestedTags(state.biz, chosenNetworks(), state.format);
      tagBox.appendChild(el('label', 'lab', 'Tags'));
      var row = el('div', 'chips');
      (state.tags || []).forEach(function (t) {
        var b = el('button', 'chip', t + '  ×');
        b.type = 'button';
        b.addEventListener('click', function () {
          state.tagsCustom = true;
          state.tags = state.tags.filter(function (x) { return x !== t; });
          save(); paintTags(); paintPreview();
        });
        row.appendChild(b);
      });
      tagBox.appendChild(row);
      var add = document.createElement('input');
      add.placeholder = 'Add a tag and press enter';
      add.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        var v = add.value.trim();
        if (!v) return;
        if (v.charAt(0) !== '#') v = '#' + v.replace(/\s+/g, '');
        state.tagsCustom = true;
        if (state.tags.indexOf(v) < 0) state.tags.push(v);
        save(); paintTags(); paintPreview();
      });
      tagBox.appendChild(add);
      var reset = el('button', 'btn', 'Automatic tags');
      reset.type = 'button';
      reset.addEventListener('click', function () {
        state.tagsCustom = false;
        state.tags = suggestedTags(state.biz, chosenNetworks(), state.format);
        save(); paintTags(); paintPreview();
      });
      tagBox.appendChild(reset);
    }
    function paintReply() {
      replyBox.replaceChildren();
      if (state.mode !== 'organic') return;
      replyBox.appendChild(el('label', 'lab', 'Comments'));
      var row = el('div', 'chips');
      var off = el('button', 'chip' + (!state.autoReply ? ' on' : ''), 'Reply myself');
      var on = el('button', 'chip' + (state.autoReply ? ' on' : ''), 'Auto-reply');
      off.type = on.type = 'button';
      off.addEventListener('click', function () { state.autoReply = false; save(); paintReply(); });
      on.addEventListener('click', function () { state.autoReply = true; save(); paintReply(); });
      row.appendChild(off); row.appendChild(on);
      replyBox.appendChild(row);
      var ta = document.createElement('textarea');
      ta.placeholder = 'Reply text. Auto-reply copies this and opens the comments.';
      ta.style.minHeight = '72px';
      ta.value = state.replyText || '';
      ta.addEventListener('input', function () { state.replyText = ta.value; save(); });
      replyBox.appendChild(ta);
      replyBox.appendChild(el('p', 'msg', 'Respond opens the live post, or the inbox if it is not live yet. Auto-reply copies this text for you.'));
    }

    function paintQueue() {
      queue.replaceChildren();
      var biz = businesses(state).filter(function (x) { return x.id === state.biz; })[0];
      var bar = el('div', 'calhead');
      var title = el('div');
      title.appendChild(el('h2', 'caltitle', biz ? biz.name : 'Queue'));
      title.appendChild(el('p', 'sub', 'This week'));
      bar.appendChild(title);
      var neu = el('button', 'btn go', 'New post');
      neu.type = 'button';
      neu.addEventListener('click', function () { goView('post'); paintButtons(); });
      bar.appendChild(neu);
      queue.appendChild(bar);
      var week = el('div', 'week');
      var days = [];
      for (var d = 0; d < 7; d++) {
        var day = new Date();
        day.setDate(day.getDate() + d);
        var key = day.toISOString().slice(0, 10);
        var cell = el('div', 'day' + (d === 0 ? ' today' : ''));
        cell.appendChild(el('b', '', day.toLocaleDateString('en-GB', { weekday: 'short' })));
        cell.appendChild(el('span', 'num', String(day.getDate())));
        var slot = el('div', 'slot');
        cell.appendChild(slot);
        days.push({ key: key, slot: slot });
        week.appendChild(cell);
      }
      queue.appendChild(week);
      var loose = el('div', 'loose');
      if (!state.items.length) loose.appendChild(el('p', 'msg', 'Nothing waiting.'));
      state.items.forEach(function (item) {
        var card = el('article', 'postc');
        var text = '';
        (item.pages || []).some(function (p) { if (p.text) { text = p.text; return true; } return false; });
        if (!text) text = item.kind === 'ads' ? (item.objective + ' · ' + item.currency + ' ' + item.budget) : 'Post';
        card.appendChild(el('p', '', text.replace(/\s+/g, ' ').slice(0, 90)));
        var minis = el('div', 'minis');
        (item.pages || []).forEach(function (p) { minis.appendChild(logo(p.network)); });
        card.appendChild(minis);
        card.appendChild(el('span', 'tag ' + (item.kind === 'ads' ? 'pay' : item.status === 'approved' ? 'ok' : 'wait'), item.kind === 'ads' ? 'Paid' : (item.status === 'approved' ? 'Approved' : 'Draft')));
        if (item.status !== 'approved') {
          var ap = el('button', 'mini', 'Approve');
          ap.type = 'button';
          ap.addEventListener('click', function () {
            if (item.kind === 'ads' && !(item.payer && item.payer.detail)) { msg.className = 'msg bad'; msg.textContent = 'Connect a wallet in Setup before approving this ad.'; goView('post'); state.mode = 'billing'; paintBilling(); paintButtons(); return; }
            item.status = 'approved'; save(); paintQueue();
          });
          card.appendChild(ap);
        }
        var del = el('button', 'mini', 'Remove');
        del.type = 'button';
        del.addEventListener('click', function () { state.items = state.items.filter(function (x) { return x.id !== item.id; }); save(); paintQueue(); });
        card.appendChild(del);
        var key = item.when === 'later' && item.at ? String(item.at).slice(0, 10) : '';
        var home = null;
        days.forEach(function (day) { if (day.key === key) home = day; });
        (home ? home.slot : loose).appendChild(card);
      });
      if (loose.childNodes.length) {
        loose.insertBefore(el('p', 'kicker', 'Waiting'), loose.firstChild);
        queue.appendChild(loose);
      }
      report();
    }

    function take(status) {
      var list = chosen();
      if (!list.length) { msg.className = 'msg bad'; msg.textContent = 'Select at least one account.'; return; }
      var pages = list.map(function (hit) {
        return { id: hit.plat.id, biz: hit.biz.name, bizId: hit.biz.id, site: hit.biz.site, url: hit.biz.url, network: hit.plat.network, name: hit.plat.name, live: !!hit.plat.live, text: caption(hit.plat.id) };
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
      var postId = uid('post');
      var links = {};
      var dest = (state.link || '').trim();
      pages.forEach(function (p) {
        var target = dest || p.url || '';
        var tracked = 'https://www.maxmaserati.com/go.html?b=' + encodeURIComponent(p.bizId || '') + '&p=' + encodeURIComponent(postId) + '&n=' + encodeURIComponent(p.network) + '&to=' + encodeURIComponent(target);
        links[p.id] = tracked;
        if (dest && p.text.indexOf(dest) >= 0) p.text = p.text.split(dest).join(tracked);
        else if (tracked && p.text.indexOf(tracked) < 0) p.text = (p.text ? p.text + '\n\n' : '') + tracked;
      });
      state.items.unshift({
        id: postId, status: status, kind: state.mode, when: state.when, at: state.at, pages: pages, links: links, dest: dest,
        objective: state.objective, budget: state.budget, currency: state.currency, start: state.start, end: state.end, audience: state.audience, payer: payer
      });
      save();
      msg.className = 'msg ok';
      msg.textContent = status === 'approved'
        ? (state.mode === 'ads' ? ('Ad approved. Payer: ' + payer.detail + '. Nothing was charged. Say go in chat and I will place it. The ad account charges that wallet.') : 'Approved. Say post it in chat. I will send only the accounts that are connected.')
        : 'Draft saved.';
      paintQueue();
      goView('queue');
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

    save();
    applyLook();
    applyTheme();
    window.addEventListener('message', function (e) {
      if (e.origin !== location.origin || !e.data || e.data.source !== 'mmm-oauth' || !e.data.token) return;
      takeToken(e.data.network, e.data.token, sessionStorage.getItem('mmm.oauth.view') || '');
    });
    if (PENDING_OAUTH && PENDING_OAUTH.token) takeToken(PENDING_OAUTH.network, PENDING_OAUTH.token, PENDING_OAUTH.view);
    paintBiz(); paintSide(); paintWhen(); paintCustom(); paintBilling(); paintButtons(); paintPreview(); paintQueue();
    applyView();
  }

  global.MMMSocialDesk = { mount: mount };
})(window);
