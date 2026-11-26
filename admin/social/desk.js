/* MMM SOCIAL+ — approval composer.
   Grok writes the post. Max approves it. Then Grok publishes through Buffer
   to the pages Max picked. This file does not hold tokens and does not post. */
(function (global) {
  'use strict';
  var KEY = 'mmm.social.plus.v2';
  var CSS = [
    '.mmm-social{max-width:1100px;margin:0 auto;padding:8px 16px 40px;color:#d9dde3;font:15px/1.5 Barlow,system-ui,sans-serif}',
    '.mmm-social h1{font:700 clamp(32px,4vw,48px)/1 "Barlow Condensed","Arial Narrow",sans-serif;letter-spacing:.03em;text-transform:uppercase;color:#e1b31a;margin:0 0 8px}',
    '.mmm-social h2{font:700 18px/1 "Barlow Condensed",sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#e1b31a;margin:0 0 10px}',
    '.mmm-social p{margin:0 0 12px}',
    '.lede{color:#c9d0d6;max-width:68ch}',
    '.kpis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:#252a31;border:1px solid #252a31;margin:0 0 14px}',
    '.kpis div{background:#0f1114;padding:12px 14px}',
    '.kpis b{display:block;font:700 22px/1 "Barlow Condensed",sans-serif;color:#f2cf5b}',
    '.kpis span{color:#8f97a1;font-size:13px}',
    '.box{border:1px solid #252a31;background:#0f1114;padding:16px;margin:0 0 14px}',
    '.pages{display:flex;flex-wrap:wrap;gap:8px}',
    '.page{display:flex;flex-direction:column;gap:2px;text-align:left;min-width:160px;max-width:240px;padding:10px 12px;border:1px solid #323942;background:#0b0d10;color:#d9dde3;cursor:pointer;font:600 14px/1.3 Barlow,sans-serif}',
    '.page small{font-weight:500;color:#8f97a1}',
    '.page.on{border-color:#e1b31a;background:rgba(225,179,26,.08);color:#f2cf5b}',
    '.page.off{opacity:.55}',
    '.row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}',
    '.seg button,.btn{font:700 14px/1 "Barlow Condensed",sans-serif;letter-spacing:.06em;text-transform:uppercase;padding:10px 12px;border:1px solid #323942;background:transparent;color:#d9dde3;cursor:pointer}',
    '.seg button[aria-pressed=true],.btn.gold{background:#e1b31a;border-color:#e1b31a;color:#111}',
    '.mmm-social label{display:block;font:600 12px/1 "Barlow Condensed",sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#8f97a1;margin:10px 0 4px}',
    '.mmm-social textarea,.mmm-social input[type=datetime-local],.mmm-social input[type=url]{width:100%;box-sizing:border-box;background:#0b0d10;color:#d9dde3;border:1px solid #323942;padding:10px;font:14px/1.45 "IBM Plex Mono",ui-monospace,Menlo,monospace}',
    '.mmm-social textarea{min-height:120px;resize:vertical}',
    '.count{float:right;color:#5f6873;letter-spacing:0;text-transform:none;font:12px "IBM Plex Mono",monospace}',
    '.item{border-top:1px solid #252a31;padding:12px 0}',
    '.item:first-child{border-top:0}',
    '.tag{display:inline-block;font:600 11px/1 "Barlow Condensed",sans-serif;letter-spacing:.06em;text-transform:uppercase;padding:3px 6px;border:1px solid #323942;margin-right:6px}',
    '.tag.ok{color:#3ddc97;border-color:rgba(61,220,151,.45)}',
    '.tag.wait{color:#f2cf5b;border-color:rgba(225,179,26,.5)}',
    '.tag.no{color:#8f97a1}',
    '.msg{color:#8f97a1;font-size:14px}.msg.ok{color:#3ddc97}.msg.bad{color:#ff5c6c}',
    '.cap{white-space:pre-wrap;font:13.5px/1.45 "IBM Plex Mono",monospace;color:#cfd5da;margin:8px 0}',
    '@media (max-width:760px){.kpis{grid-template-columns:1fr}}'
  ].join('');

  var PAGES = [
    { id: 'fb', name: 'Max Maserati Trading University', network: 'Facebook', live: true, note: 'Connected. I can post here.' },
    { id: 'yt', name: 'Max Maserati', network: 'YouTube', live: true, note: 'Connected. A video is required. Text alone will not publish.' },
    { id: 'x', name: '@Emaxmaserati', network: 'X', live: true, note: 'Connected. I can post here.' },
    { id: 'ig', name: 'Instagram', network: 'Instagram', live: false, note: 'Not connected. Buffer’s free plan already holds 3 accounts.' },
    { id: 'tt', name: 'TikTok', network: 'TikTok', live: false, note: 'Not connected. Buffer’s free plan already holds 3 accounts.' },
    { id: 'whop', name: 'Whop', network: 'Whop', live: false, note: 'Not a Buffer account. Name the forum and I can post there after you approve.' },
    { id: 'journal', name: 'MMM Journal', network: 'Page', live: false, note: 'A page, not its own network. Choose which account it should go out on.' },
    { id: 'ayiti', name: 'Ayiti P2P', network: 'Page', live: false, note: 'A page, not its own network. Choose which account it should go out on.' },
    { id: 'prop', name: 'Prop firms', network: 'Page', live: false, note: 'A page, not its own network. Choose which account it should go out on.' }
  ];

  function page(id) { return PAGES.filter(function (p) { return p.id === id; })[0]; }
  function load() {
    var blank = { selected: ['fb', 'x'], mode: 'same', text: '', custom: {}, when: 'now', at: '', link: '', items: [] };
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!raw || typeof raw !== 'object') return blank;
      blank.selected = Array.isArray(raw.selected) && raw.selected.length ? raw.selected : blank.selected;
      blank.mode = raw.mode === 'custom' ? 'custom' : 'same';
      blank.text = raw.text || '';
      blank.custom = raw.custom || {};
      blank.when = raw.when === 'later' ? 'later' : 'now';
      blank.at = raw.at || '';
      blank.link = raw.link || '';
      blank.items = Array.isArray(raw.items) ? raw.items : [];
      return blank;
    } catch (e) { return blank; }
  }
  function uid() { return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function limits(id) {
    if (id === 'x') return 280;
    if (id === 'ig') return 2200;
    if (id === 'tt') return 2200;
    return 5000;
  }

  function mount(root) {
    if (!root || root.dataset.mmmSocial) return;
    root.dataset.mmmSocial = '1';
    root.replaceChildren();
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    var state = load();
    var els = {};

    function saveLocal() {
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    }
    function el(tag, cls, text) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      return n;
    }
    function report() {
      if (global.parent === global) return;
      var h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      try { global.parent.postMessage({ mmmSocial: h }, global.location.origin); } catch (e) {}
    }

    var wrap = el('div', 'mmm-social');
    root.appendChild(wrap);
    wrap.appendChild(el('h1', '', 'MMM SOCIAL+'));
    wrap.appendChild(el('p', 'lede', 'I write the post. You approve it. Then I publish it to the pages you pick — the same caption, or a different one per page, now or at a time you set. Nothing goes out until you say so.'));

    var kpis = el('div', 'kpis');
    wrap.appendChild(kpis);
    var pagesBox = el('div', 'box');
    wrap.appendChild(pagesBox);
    var comp = el('div', 'box');
    wrap.appendChild(comp);
    var queue = el('div', 'box');
    wrap.appendChild(queue);

    function selectedPages() { return state.selected.map(page).filter(Boolean); }
    function bodyFor(p) {
      var t = state.mode === 'custom' ? (state.custom[p.id] || '') : state.text;
      if (state.link && t.indexOf(state.link) < 0) t = (t ? t + '\n\n' : '') + state.link;
      return t.trim();
    }
    function handoff(item) {
      var lines = ['Approved MMM SOCIAL+ post. Publish it.', 'When: ' + (item.when === 'now' ? 'now' : item.at || 'scheduled')];
      item.pages.forEach(function (p) {
        lines.push('', p.network + ' · ' + p.name + (p.live ? '' : ' (not connected yet — skip unless I say otherwise)'), p.text);
      });
      return lines.join('\n');
    }

    function paintKpis() {
      kpis.replaceChildren();
      var waiting = state.items.filter(function (i) { return i.status === 'draft'; }).length;
      var approved = state.items.filter(function (i) { return i.status === 'approved'; }).length;
      [['3', 'Accounts I can post to now'], [String(waiting), 'Waiting for your approval'], [String(approved), 'Approved, not sent yet']].forEach(function (pair) {
        var d = el('div');
        d.appendChild(el('b', '', pair[0]));
        d.appendChild(el('span', '', pair[1]));
        kpis.appendChild(d);
      });
    }

    function paintPages() {
      pagesBox.replaceChildren();
      pagesBox.appendChild(el('h2', '', 'Pages'));
      pagesBox.appendChild(el('p', 'lede', 'These are pages, not five businesses. Facebook, YouTube and X are connected. Instagram, TikTok and Whop are not, because the free Buffer plan stops at 3.'));
      var rail = el('div', 'pages');
      PAGES.forEach(function (p) {
        var b = el('button', 'page' + (state.selected.indexOf(p.id) >= 0 ? ' on' : '') + (p.live ? '' : ' off'), p.network + ' · ' + p.name);
        b.type = 'button';
        b.appendChild(document.createElement('br'));
        var s = el('small', '', p.note);
        b.appendChild(s);
        b.addEventListener('click', function () {
          var i = state.selected.indexOf(p.id);
          if (i >= 0) state.selected.splice(i, 1); else state.selected.push(p.id);
          saveLocal();
          paint();
        });
        rail.appendChild(b);
      });
      pagesBox.appendChild(rail);
    }

    function paintComposer() {
      comp.replaceChildren();
      comp.appendChild(el('h2', '', 'Composer'));
      var seg = el('div', 'seg row');
      [['same', 'Same text everywhere'], ['custom', 'Different text per page']].forEach(function (pair) {
        var b = el('button', '', pair[1]);
        b.type = 'button';
        b.setAttribute('aria-pressed', state.mode === pair[0] ? 'true' : 'false');
        b.addEventListener('click', function () { state.mode = pair[0]; saveLocal(); paint(); });
        seg.appendChild(b);
      });
      comp.appendChild(seg);

      function field(label, value, oninput, max) {
        var lab = el('label');
        lab.appendChild(document.createTextNode(label));
        if (max) {
          var c = el('span', 'count', (value || '').length + ' / ' + max);
          lab.appendChild(c);
        }
        var ta = document.createElement('textarea');
        ta.value = value || '';
        ta.addEventListener('input', function () { oninput(ta.value); if (max) lab.querySelector('.count').textContent = ta.value.length + ' / ' + max; saveLocal(); });
        comp.appendChild(lab);
        comp.appendChild(ta);
        return ta;
      }

      if (state.mode === 'same') {
        field('Caption for every selected page', state.text, function (v) { state.text = v; }, 5000);
      } else {
        var chosen = selectedPages();
        if (!chosen.length) comp.appendChild(el('p', 'msg', 'Pick at least one page.'));
        chosen.forEach(function (p) {
          field(p.network + ' · ' + p.name, state.custom[p.id] || state.text || '', function (v) { state.custom[p.id] = v; }, limits(p.id));
        });
      }

      var linkLab = el('label', '', 'Link (optional, added if it is not already in the text)');
      var link = document.createElement('input');
      link.type = 'url';
      link.placeholder = 'https://';
      link.value = state.link || '';
      link.addEventListener('input', function () { state.link = link.value; saveLocal(); });
      comp.appendChild(linkLab);
      comp.appendChild(link);

      var whenLab = el('label', '', 'When');
      var whenRow = el('div', 'seg row');
      [['now', 'Post when I say go'], ['later', 'Schedule']].forEach(function (pair) {
        var b = el('button', '', pair[1]);
        b.type = 'button';
        b.setAttribute('aria-pressed', state.when === pair[0] ? 'true' : 'false');
        b.addEventListener('click', function () { state.when = pair[0]; saveLocal(); paint(); });
        whenRow.appendChild(b);
      });
      comp.appendChild(whenLab);
      comp.appendChild(whenRow);
      if (state.when === 'later') {
        var at = document.createElement('input');
        at.type = 'datetime-local';
        at.value = state.at || '';
        at.addEventListener('input', function () { state.at = at.value; saveLocal(); });
        comp.appendChild(at);
      }

      var msg = el('p', 'msg');
      var actions = el('div', 'row');
      actions.style.marginTop = '12px';
      function take(status) {
        var pages = selectedPages();
        if (!pages.length) { msg.className = 'msg bad'; msg.textContent = 'Pick at least one page.'; return; }
        var packed = pages.map(function (p) { return { id: p.id, name: p.name, network: p.network, live: p.live, text: bodyFor(p) }; });
        if (packed.every(function (p) { return !p.text; })) { msg.className = 'msg bad'; msg.textContent = 'Write the caption first.'; return; }
        if (state.when === 'later' && !state.at) { msg.className = 'msg bad'; msg.textContent = 'Set the time.'; return; }
        state.items.unshift({ id: uid(), status: status, when: state.when, at: state.at, created: new Date().toISOString(), pages: packed });
        saveLocal();
        msg.className = 'msg ok';
        msg.textContent = status === 'approved' ? 'Approved. Tell me in chat to post it, and name the pages if you want a smaller set.' : 'Saved. It waits until you approve it.';
        paintQueue();
        paintKpis();
      }
      var draft = el('button', 'btn', 'Save draft');
      draft.type = 'button';
      draft.addEventListener('click', function () { take('draft'); });
      var ok = el('button', 'btn gold', 'I approve this');
      ok.type = 'button';
      ok.addEventListener('click', function () { take('approved'); });
      actions.appendChild(draft);
      actions.appendChild(ok);
      comp.appendChild(actions);
      comp.appendChild(msg);
      if (els.focusId) {
        var node = comp.querySelector('textarea');
        if (node && document.activeElement && document.activeElement.tagName !== 'TEXTAREA') node.focus();
      }
    }

    function paintQueue() {
      queue.replaceChildren();
      queue.appendChild(el('h2', '', 'Waiting'));
      if (!state.items.length) {
        queue.appendChild(el('p', 'msg', 'Nothing yet. Write a caption, or tell me the topic in chat and I will draft it here for you to approve.'));
        return;
      }
      state.items.forEach(function (item) {
        var card = el('div', 'item');
        var top = el('div', 'row');
        var tag = el('span', 'tag ' + (item.status === 'approved' ? 'ok' : 'wait'), item.status === 'approved' ? 'Approved' : 'Draft');
        top.appendChild(tag);
        top.appendChild(el('span', 'msg', (item.when === 'now' ? 'Post when I say go' : 'Schedule ' + (item.at || ''))));
        card.appendChild(top);
        item.pages.forEach(function (p) {
          card.appendChild(el('div', '', p.network + ' · ' + p.name));
          card.appendChild(el('div', 'cap', p.text || '(empty)'));
        });
        var actions = el('div', 'row');
        if (item.status !== 'approved') {
          var ap = el('button', 'btn gold', 'Approve');
          ap.type = 'button';
          ap.addEventListener('click', function () { item.status = 'approved'; saveLocal(); paint(); });
          actions.appendChild(ap);
        }
        var copy = el('button', 'btn', 'Copy for me');
        copy.type = 'button';
        copy.addEventListener('click', function () {
          var t = handoff(item);
          (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { copy.textContent = 'Copied'; }, function () { copy.textContent = 'Copy failed'; });
        });
        var del = el('button', 'btn', 'Remove');
        del.type = 'button';
        del.addEventListener('click', function () { state.items = state.items.filter(function (x) { return x.id !== item.id; }); saveLocal(); paint(); });
        actions.appendChild(copy);
        actions.appendChild(del);
        card.appendChild(actions);
        queue.appendChild(card);
      });
    }

    function paint() { paintKpis(); paintPages(); paintComposer(); paintQueue(); report(); }
    paint();
    global.addEventListener('resize', report);
  }

  global.MMMSocialDesk = { mount: mount, pages: PAGES };
})(window);
