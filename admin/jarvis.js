/* MiniMax OS · admin shell: HUD status line, number keys for tabs, Ctrl/Cmd+K command palette,
   and on-demand loading of the heavy tab scripts (each loads the first time its tab opens,
   and all of them load quietly in the background once you are logged in). */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var V = '20261120b';
  var LAZY = {
    crm: '/admin/crm.js?v=20261114b',
    haiti: '/admin/haiti.js?v=20261118b',
    mail: '/admin/mail.js?v=20261120a',
    strat: '/admin/strategy.js?v=20261116b',
    whop: '/admin/whop.js?v=' + V
  };
  var loading = {};

  /* Load a tab script once; resolves when its window.MMMxxx hook exists. */
  window.MMMNeed = function (name) {
    var src = LAZY[name];
    if (!src) return Promise.resolve();
    if (loading[name]) return loading[name];
    loading[name] = new Promise(function (ok, bad) {
      var s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = function () { ok(); };
      s.onerror = function () { delete loading[name]; bad(new Error('Could not load ' + name)); };
      document.body.appendChild(s);
    });
    return loading[name];
  };
  window.MMMPrefetchTabs = function () {
    var names = Object.keys(LAZY), i = 0;
    var next = function () { if (i >= names.length) return; window.MMMNeed(names[i++]).catch(function () {}).then(function () { idle(next); }); };
    idle(next);
  };
  function idle(fn) { (window.requestIdleCallback || function (f) { return setTimeout(f, 200); })(fn, { timeout: 2000 }); }

  /* Keep the sticky tab rail under the site header. */
  function headerOffset() {
    var h = $('mmm-header'), top = 0;
    if (h) {
      var bar = h.firstElementChild || h, cs = getComputedStyle(bar);
      if (cs.position === 'fixed' || cs.position === 'sticky') top = bar.getBoundingClientRect().height;
    }
    document.documentElement.style.setProperty('--jv-top', Math.round(top) + 'px');
  }
  window.addEventListener('resize', headerOffset);
  setTimeout(headerOffset, 300); setTimeout(headerOffset, 1500);

  /* HUD status line in the page header. */
  function hud() {
    var head = document.querySelector('.head > div');
    if (!head || $('jvHud')) return;
    var el = document.createElement('div');
    el.className = 'hudbar'; el.id = 'jvHud'; el.style.marginTop = '10px';
    head.appendChild(el);
    var t0 = performance.now();
    var paint = function () {
      var now = new Date();
      var lon = now.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', second: '2-digit' });
      var ny = now.toLocaleTimeString('en-GB', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' });
      el.innerHTML = '<span><span class="dot"></span>Systems <b class="ok">online</b></span>' +
        '<span>London <b>' + lon + '</b></span><span class="hide-sm">New York <b>' + ny + '</b></span>' +
        '<span class="hide-sm">Boot <b>' + Math.round(t0) + ' ms</b></span>' +
        '<span class="hide-sm"><kbd>Ctrl</kbd> <kbd>K</kbd> command · <kbd>1</kbd>–<kbd>9</kbd> tabs</span>';
    };
    paint(); setInterval(paint, 1000);
  }

  /* Number badges + keys 1–9 for tabs. */
  function tabKeys() {
    var tabs = $('atabs'); if (!tabs || tabs.dataset.jv) return;
    tabs.dataset.jv = '1';
    [].forEach.call(tabs.querySelectorAll('[data-tab]'), function (b, i) {
      if (i < 9) { var k = document.createElement('span'); k.className = 'k'; k.textContent = String(i + 1); b.insertBefore(k, b.firstChild); }
    });
  }

  /* Command palette. */
  var pal, input, list, items = [], sel = 0;
  function commands() {
    var out = [];
    var tabs = $('atabs');
    if (tabs && !tabs.hidden) [].forEach.call(tabs.querySelectorAll('[data-tab]'), function (b) {
      out.push({ label: 'Open ' + b.textContent.replace(/^\d/, '').trim(), hint: 'tab', run: function () { window.MMMPick && window.MMMPick(b.dataset.tab); } });
    });
    out.push({ label: 'Refresh members from Firebase', hint: 'members', run: function () { window.MMMPick && window.MMMPick('members'); var b = $('b-sync'); if (b) b.click(); } });
    out.push({ label: 'Mail: sync all inboxes', hint: 'mail', run: function () { window.MMMPick && window.MMMPick('mail'); setTimeout(function () { var b = $('mxSync'); if (b) b.click(); }, 400); } });
    out.push({ label: 'Mail: show unread', hint: 'mail', run: function () { window.MMMPick && window.MMMPick('mail'); setTimeout(function () { var b = document.querySelector('#mail [data-f=unread]'); if (b) b.click(); }, 400); } });
    out.push({ label: 'Whop: edit products', hint: 'whop', run: function () { window.MMMPick && window.MMMPick('whop'); setTimeout(function () { var el = $('wvProducts'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 500); } });
    out.push({ label: 'Whop: new promo code', hint: 'whop', run: function () { window.MMMPick && window.MMMPick('whop'); setTimeout(function () { var el = $('wvCode'); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); } }, 600); } });
    out.push({ label: 'Whop: money at risk (failed renewals)', hint: 'whop', run: function () { window.MMMPick && window.MMMPick('whop'); setTimeout(function () { var el = $('wvRisk'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 500); } });
    out.push({ label: 'V.I.P: make a fresh sign-up link', hint: 'vip', run: function () { window.MMMPick && window.MMMPick('vip'); setTimeout(function () { var b = $('vipMake'); if (b) b.focus(); }, 300); } });
    return out;
  }
  function openPal() {
    if (!pal) {
      pal = document.createElement('div'); pal.className = 'jv-pal'; pal.hidden = true;
      pal.innerHTML = '<div class="jv-box" role="dialog" aria-label="Command"><input placeholder="› type a command or a tab name" aria-label="Command"><ul></ul></div>';
      document.body.appendChild(pal);
      input = pal.querySelector('input'); list = pal.querySelector('ul');
      pal.addEventListener('click', function (e) { if (e.target === pal) closePal(); var li = e.target.closest('li'); if (li) run(+li.dataset.i); });
      input.addEventListener('input', draw);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(items.length - 1, sel + 1); paint(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); paint(); }
        else if (e.key === 'Enter') { e.preventDefault(); run(sel); }
        else if (e.key === 'Escape') closePal();
      });
    }
    pal.hidden = false; input.value = ''; draw(); input.focus();
  }
  function closePal() { if (pal) pal.hidden = true; }
  function draw() {
    var q = input.value.trim().toLowerCase();
    items = commands().filter(function (c) { return !q || (c.label + ' ' + c.hint).toLowerCase().indexOf(q) >= 0; });
    sel = 0; paint();
  }
  function paint() {
    list.innerHTML = items.map(function (c, i) { return '<li data-i="' + i + '" class="' + (i === sel ? 'on' : '') + '"><span>' + c.label.replace(/[<>&]/g, '') + '</span><small>' + c.hint + '</small></li>'; }).join('') || '<li><span>No match</span></li>';
  }
  function run(i) { var c = items[i]; closePal(); if (c) c.run(); }

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); if (pal && !pal.hidden) closePal(); else openPal(); return; }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '')) return;
    if (/^[1-9]$/.test(e.key)) {
      var tabs = $('atabs'); if (!tabs || tabs.hidden) return;
      var b = tabs.querySelectorAll('[data-tab]')[+e.key - 1];
      if (b) { e.preventDefault(); b.click(); }
    }
  });

  function boot() { hud(); tabKeys(); headerOffset(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
