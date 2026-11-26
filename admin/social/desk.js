/* MMM SOCIAL+ — three businesses, as many platforms as Max connects.
   Whop is only for the trading business (maxmaserati.com). */
(function (global) {
  'use strict';
  var KEY = 'mmm.social.plus.v3';
  var NETS = ['Facebook', 'Instagram', 'TikTok', 'YouTube', 'X', 'Whop'];
  var CSS = [
    '.mmm-social{max-width:1100px;margin:0 auto;padding:8px 16px 40px;color:#d9dde3;font:15px/1.5 Barlow,system-ui,sans-serif}',
    '.mmm-social h1{font:700 clamp(32px,4vw,48px)/1 "Barlow Condensed","Arial Narrow",sans-serif;letter-spacing:.03em;text-transform:uppercase;color:#e1b31a;margin:0 0 8px}',
    '.mmm-social h2{font:700 18px/1 "Barlow Condensed",sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#e1b31a;margin:0 0 8px}',
    '.lede{color:#c9d0d6;max-width:70ch;margin:0 0 14px}',
    '.bizs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:0 0 14px}',
    '.biz{text-align:left;padding:12px;border:1px solid #323942;background:#0f1114;color:#d9dde3;cursor:pointer}',
    '.biz.on{border-color:#e1b31a;background:rgba(225,179,26,.08)}',
    '.biz b{display:block;font:700 18px/1.1 "Barlow Condensed",sans-serif;letter-spacing:.04em;text-transform:uppercase;color:#f2cf5b}',
    '.biz small{color:#8f97a1}',
    '.box{border:1px solid #252a31;background:#0f1114;padding:16px;margin:0 0 14px}',
    '.pages{display:flex;flex-wrap:wrap;gap:8px}',
    '.page{text-align:left;min-width:150px;max-width:240px;padding:10px 12px;border:1px solid #323942;background:#0b0d10;color:#d9dde3;cursor:pointer;font:600 14px/1.3 Barlow,sans-serif}',
    '.page small{display:block;font-weight:500;color:#8f97a1}',
    '.page.on{border-color:#e1b31a;color:#f2cf5b}',
    '.page.off{opacity:.72}',
    '.row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px}',
    '.seg button,.btn{font:700 14px/1 "Barlow Condensed",sans-serif;letter-spacing:.06em;text-transform:uppercase;padding:10px 12px;border:1px solid #323942;background:transparent;color:#d9dde3;cursor:pointer}',
    '.seg button[aria-pressed=true],.btn.gold{background:#e1b31a;border-color:#e1b31a;color:#111}',
    '.mmm-social label{display:block;font:600 12px/1 "Barlow Condensed",sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#8f97a1;margin:10px 0 4px}',
    '.mmm-social textarea,.mmm-social input,.mmm-social select{width:100%;box-sizing:border-box;background:#0b0d10;color:#d9dde3;border:1px solid #323942;padding:10px;font:14px/1.45 "IBM Plex Mono",ui-monospace,Menlo,monospace}',
    '.mmm-social textarea{min-height:110px;resize:vertical}',
    '.add{display:grid;grid-template-columns:140px 1fr auto;gap:8px;align-items:end;margin-top:12px}',
    '.item{border-top:1px solid #252a31;padding:12px 0}',
    '.tag{display:inline-block;font:600 11px/1 "Barlow Condensed",sans-serif;letter-spacing:.06em;text-transform:uppercase;padding:3px 6px;border:1px solid #323942;margin-right:6px}',
    '.tag.ok{color:#3ddc97;border-color:rgba(61,220,151,.45)}.tag.wait{color:#f2cf5b;border-color:rgba(225,179,26,.5)}',
    '.msg{color:#8f97a1;font-size:14px}.msg.bad{color:#ff5c6c}.msg.ok{color:#3ddc97}',
    '.cap{white-space:pre-wrap;font:13.5px/1.45 "IBM Plex Mono",monospace;color:#cfd5da;margin:6px 0}',
    '@media (max-width:760px){.bizs,.add{grid-template-columns:1fr}}'
  ].join('');

  function base() {
    return [
      {
        id: 'trading', name: 'Trading', site: 'maxmaserati.com',
        blurb: 'Several pages. Whop is only for this business.',
        platforms: [
          { id: 'fb', network: 'Facebook', name: 'Max Maserati Trading University', live: true, note: 'Connected. I can post.' },
          { id: 'yt', network: 'YouTube', name: 'Max Maserati', live: true, note: 'Connected. A video is required.' },
          { id: 'x', network: 'X', name: '@Emaxmaserati', live: true, note: 'Connected. I can post.' },
          { id: 'ig', network: 'Instagram', name: 'Add the account', live: false, note: 'Not connected yet.' },
          { id: 'tt', network: 'TikTok', name: 'Add the account', live: false, note: 'Not connected yet.' },
          { id: 'whop-public', network: 'Whop', name: 'Public forum', live: true, note: 'Trading only. I can post after you approve.' },
          { id: 'whop-weekly', network: 'Whop', name: 'Weekly Analysis', live: true, note: 'Trading only. Members.' }
        ]
      },
      {
        id: 'table', name: 'Table Fifty', site: 'tablefifty.co.uk',
        blurb: 'Half-price restaurant and takeaway deals, UK-wide. No Whop.',
        platforms: [
          { id: 'tf-fb', network: 'Facebook', name: 'Add the account', live: false, note: 'Not connected yet.' },
          { id: 'tf-ig', network: 'Instagram', name: 'Add the account', live: false, note: 'Not connected yet.' },
          { id: 'tf-tt', network: 'TikTok', name: 'Add the account', live: false, note: 'Not connected yet.' },
          { id: 'tf-yt', network: 'YouTube', name: 'Add the account', live: false, note: 'Not connected yet.' },
          { id: 'tf-x', network: 'X', name: 'Add the account', live: false, note: 'Not connected yet.' }
        ]
      },
      {
        id: 'ayiti', name: 'Ayiti P2P', site: 'ayitip2p.com',
        blurb: 'Its own business. No Whop.',
        platforms: [
          { id: 'ap-fb', network: 'Facebook', name: 'Add the account', live: false, note: 'Not connected yet.' },
          { id: 'ap-ig', network: 'Instagram', name: 'Add the account', live: false, note: 'Not connected yet.' },
          { id: 'ap-tt', network: 'TikTok', name: 'Add the account', live: false, note: 'Not connected yet.' },
          { id: 'ap-yt', network: 'YouTube', name: 'Add the account', live: false, note: 'Not connected yet.' },
          { id: 'ap-x', network: 'X', name: 'Add the account', live: false, note: 'Not connected yet.' }
        ]
      }
    ];
  }

  function load() {
    var state = { biz: 'trading', selected: ['fb', 'x'], mode: 'same', text: '', custom: {}, when: 'now', at: '', link: '', items: [], extra: {} };
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!raw) return state;
      if (raw.biz) state.biz = raw.biz;
      if (Array.isArray(raw.selected)) state.selected = raw.selected;
      if (raw.mode === 'custom') state.mode = 'custom';
      state.text = raw.text || '';
      state.custom = raw.custom || {};
      state.when = raw.when === 'later' ? 'later' : 'now';
      state.at = raw.at || '';
      state.link = raw.link || '';
      state.items = Array.isArray(raw.items) ? raw.items : [];
      state.extra = raw.extra && typeof raw.extra === 'object' ? raw.extra : {};
      return state;
    } catch (e) { return state; }
  }

  function businesses(state) {
    return base().map(function (b) {
      var extra = (state.extra && state.extra[b.id]) || [];
      return { id: b.id, name: b.name, site: b.site, blurb: b.blurb, platforms: b.platforms.concat(extra) };
    });
  }
  function findPlat(state, id) {
    var hit = null;
    businesses(state).forEach(function (b) {
      b.platforms.forEach(function (p) { if (p.id === id) hit = { biz: b, plat: p }; });
    });
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

    function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
    function el(tag, cls, text) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      return n;
    }
    function report() {
      if (global.parent === global) return;
      try { global.parent.postMessage({ mmmSocial: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) }, global.location.origin); } catch (e) {}
    }

    var wrap = el('div', 'mmm-social');
    root.appendChild(wrap);
    var bizRow = el('div', 'bizs');
    var box = el('div', 'box');
    var comp = el('div', 'box');
    var queue = el('div', 'box');
    wrap.appendChild(el('h1', '', 'MMM SOCIAL+'));
    wrap.appendChild(el('p', 'lede', 'Three businesses. Each one can have as many social accounts as you connect. I write the post, you approve it, then I publish only to the accounts you picked. Whop is only for Trading.'));
    wrap.appendChild(bizRow);
    wrap.appendChild(box);
    wrap.appendChild(comp);
    wrap.appendChild(queue);

    function current() { return businesses(state).filter(function (b) { return b.id === state.biz; })[0]; }
    function chosen() { return state.selected.map(function (id) { return findPlat(state, id); }).filter(Boolean); }
    function bodyFor(id) {
      var t = state.mode === 'custom' ? (state.custom[id] || '') : state.text;
      if (state.link && t.indexOf(state.link) < 0) t = (t ? t + '\n\n' : '') + state.link;
      return t.trim();
    }

    function paintBiz() {
      bizRow.replaceChildren();
      businesses(state).forEach(function (b) {
        var live = b.platforms.filter(function (p) { return p.live; }).length;
        var btn = el('button', 'biz' + (state.biz === b.id ? ' on' : ''));
        btn.type = 'button';
        btn.appendChild(el('b', '', b.name));
        btn.appendChild(el('small', '', b.site + ' · ' + live + ' ready'));
        btn.addEventListener('click', function () { state.biz = b.id; save(); paint(); });
        bizRow.appendChild(btn);
      });
    }

    function paintPlatforms() {
      var b = current();
      box.replaceChildren();
      box.appendChild(el('h2', '', b.name + ' accounts'));
      box.appendChild(el('p', 'lede', b.blurb + ' Tap every account this post should use. Add another any time.'));
      var rail = el('div', 'pages');
      b.platforms.forEach(function (p) {
        var on = state.selected.indexOf(p.id) >= 0;
        var btn = el('button', 'page' + (on ? ' on' : '') + (p.live ? '' : ' off'));
        btn.type = 'button';
        btn.appendChild(document.createTextNode(p.network + ' · ' + p.name));
        btn.appendChild(el('small', '', p.note || (p.live ? 'Ready' : 'Not connected yet')));
        btn.addEventListener('click', function () {
          var i = state.selected.indexOf(p.id);
          if (i >= 0) state.selected.splice(i, 1); else state.selected.push(p.id);
          save(); paint();
        });
        rail.appendChild(btn);
      });
      box.appendChild(rail);
      var add = el('div', 'add');
      var net = document.createElement('select');
      (b.id === 'trading' ? NETS : NETS.filter(function (n) { return n !== 'Whop'; })).forEach(function (n) {
        var o = document.createElement('option'); o.textContent = n; net.appendChild(o);
      });
      var name = document.createElement('input');
      name.placeholder = 'Account or page name';
      var go = el('button', 'btn', 'Add account');
      go.type = 'button';
      go.addEventListener('click', function () {
        var label = name.value.trim();
        if (!label) return;
        if (net.value === 'Whop' && b.id !== 'trading') return;
        state.extra[b.id] = state.extra[b.id] || [];
        var id = uid(b.id);
        state.extra[b.id].push({ id: id, network: net.value, name: label, live: false, note: 'Saved here. Tell me when this login is connected and I will post to it.' });
        state.selected.push(id);
        name.value = '';
        save(); paint();
      });
      add.appendChild(net); add.appendChild(name); add.appendChild(go);
      box.appendChild(add);
    }

    function paintComposer() {
      comp.replaceChildren();
      comp.appendChild(el('h2', '', 'Composer'));
      var seg = el('div', 'seg row');
      [['same', 'Same text on every account'], ['custom', 'Different text per account']].forEach(function (pair) {
        var b = el('button', '', pair[1]);
        b.type = 'button';
        b.setAttribute('aria-pressed', state.mode === pair[0] ? 'true' : 'false');
        b.addEventListener('click', function () { state.mode = pair[0]; save(); paint(); });
        seg.appendChild(b);
      });
      comp.appendChild(seg);
      function area(label, value, write) {
        comp.appendChild(el('label', '', label));
        var ta = document.createElement('textarea');
        ta.value = value || '';
        ta.addEventListener('input', function () { write(ta.value); save(); });
        comp.appendChild(ta);
      }
      if (state.mode === 'same') area('Caption', state.text, function (v) { state.text = v; });
      else {
        var list = chosen();
        if (!list.length) comp.appendChild(el('p', 'msg', 'Pick at least one account.'));
        list.forEach(function (hit) {
          area(hit.biz.name + ' · ' + hit.plat.network + ' · ' + hit.plat.name, state.custom[hit.plat.id] || '', function (v) { state.custom[hit.plat.id] = v; });
        });
      }
      comp.appendChild(el('label', '', 'Link (optional)'));
      var link = document.createElement('input');
      link.type = 'url'; link.placeholder = 'https://'; link.value = state.link || '';
      link.addEventListener('input', function () { state.link = link.value; save(); });
      comp.appendChild(link);
      var when = el('div', 'seg row');
      [['now', 'Post when I say go'], ['later', 'Schedule']].forEach(function (pair) {
        var b = el('button', '', pair[1]);
        b.type = 'button';
        b.setAttribute('aria-pressed', state.when === pair[0] ? 'true' : 'false');
        b.addEventListener('click', function () { state.when = pair[0]; save(); paint(); });
        when.appendChild(b);
      });
      comp.appendChild(el('label', '', 'When'));
      comp.appendChild(when);
      if (state.when === 'later') {
        var at = document.createElement('input');
        at.type = 'datetime-local'; at.value = state.at || '';
        at.addEventListener('input', function () { state.at = at.value; save(); });
        comp.appendChild(at);
      }
      var msg = el('p', 'msg');
      function take(status) {
        var list = chosen();
        if (!list.length) { msg.className = 'msg bad'; msg.textContent = 'Pick at least one account.'; return; }
        var pages = list.map(function (hit) {
          return { id: hit.plat.id, biz: hit.biz.name, site: hit.biz.site, network: hit.plat.network, name: hit.plat.name, live: !!hit.plat.live, text: bodyFor(hit.plat.id) };
        });
        if (pages.every(function (p) { return !p.text; })) { msg.className = 'msg bad'; msg.textContent = 'Write the caption first.'; return; }
        if (state.when === 'later' && !state.at) { msg.className = 'msg bad'; msg.textContent = 'Set the time.'; return; }
        state.items.unshift({ id: uid('post'), status: status, when: state.when, at: state.at, pages: pages });
        save();
        msg.className = 'msg ok';
        msg.textContent = status === 'approved' ? 'Approved. In chat, say post it. I will send only the connected accounts, and skip the rest.' : 'Draft saved.';
        paintQueue();
      }
      var row = el('div', 'row');
      var d = el('button', 'btn', 'Save draft'); d.type = 'button'; d.addEventListener('click', function () { take('draft'); });
      var a = el('button', 'btn gold', 'I approve this'); a.type = 'button'; a.addEventListener('click', function () { take('approved'); });
      row.appendChild(d); row.appendChild(a);
      comp.appendChild(row); comp.appendChild(msg);
    }

    function paintQueue() {
      queue.replaceChildren();
      queue.appendChild(el('h2', '', 'Waiting for you'));
      if (!state.items.length) { queue.appendChild(el('p', 'msg', 'Nothing yet. Pick a business, pick the accounts, write it — or tell me the topic in chat and I will draft it.')); return; }
      state.items.forEach(function (item) {
        var card = el('div', 'item');
        card.appendChild(el('span', 'tag ' + (item.status === 'approved' ? 'ok' : 'wait'), item.status === 'approved' ? 'Approved' : 'Draft'));
        card.appendChild(el('span', 'msg', item.when === 'now' ? 'Post when you say go' : ('Schedule ' + (item.at || ''))));
        item.pages.forEach(function (p) {
          card.appendChild(el('div', '', p.biz + ' · ' + p.network + ' · ' + p.name + (p.live ? '' : ' · not connected')));
          card.appendChild(el('div', 'cap', p.text || '(empty)'));
        });
        var row = el('div', 'row');
        if (item.status !== 'approved') {
          var ap = el('button', 'btn gold', 'Approve'); ap.type = 'button';
          ap.addEventListener('click', function () { item.status = 'approved'; save(); paint(); });
          row.appendChild(ap);
        }
        var del = el('button', 'btn', 'Remove'); del.type = 'button';
        del.addEventListener('click', function () { state.items = state.items.filter(function (x) { return x.id !== item.id; }); save(); paint(); });
        row.appendChild(del);
        card.appendChild(row);
        queue.appendChild(card);
      });
    }

    function paint() { paintBiz(); paintPlatforms(); paintComposer(); paintQueue(); report(); }
    paint();
  }

  global.MMMSocialDesk = { mount: mount };
})(window);
