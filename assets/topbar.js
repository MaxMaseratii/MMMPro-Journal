/* MMM Trading - hover-reveal top menu for the full-screen app pages
 * (journal, course, discipline test, backtests).
 * Desktop: move the mouse to the top edge of the window and the site menu slides down.
 * Touch: tap the small gold "MMM" tab at the top centre.
 * Keyboard: Tab from the top of the page focuses the menu.
 * Self-contained: no Tailwind, no Firebase, nothing that can clash with the app underneath.
 * Load /assets/nav.js first (the menu list lives there).
 */
(function () {
  'use strict';
  if (window.__mmmTopbar) return;
  window.__mmmTopbar = true;

  var NAV = window.MMM_NAV || [
    ['Indicators', '/indicators/'], ['Backtests', '/backtests/'], ['Course', '/journal/?course=1'],
    ['Journal', '/journal/'], ['Gamma', '/gamma/'], ['News', '/news/'], ['Free Test', '/diagnostic/'], ['Pricing', '/whop/']
  ];

  function active(href) {
    var p = location.pathname.replace(/index\.html$/, '');
    var q = location.search;
    var h = href.split('?')[0];
    if (href.indexOf('course=1') >= 0) return p.indexOf('/journal/course') === 0 || (p === '/journal/' && /course=1/.test(q));
    if (h === '/journal/') return p === '/journal/' && !/course=1/.test(q);
    return p.indexOf(h) === 0;
  }

  var css = document.createElement('style');
  css.textContent = [
    '#mmm-tb-zone{position:fixed;left:0;right:0;top:0;height:10px;z-index:2147483000}',
    '#mmm-tb{position:fixed;left:0;right:0;top:0;z-index:2147483001;transform:translateY(-110%);transition:transform .22s ease;',
    ' background:linear-gradient(90deg,hsl(45,100%,55%),hsl(45,100%,65%),hsl(45,100%,55%));box-shadow:0 8px 24px rgba(0,0,0,.45);',
    ' font:600 14px/1.2 Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#000;padding-top:env(safe-area-inset-top,0px)}',
    '#mmm-tb.open{transform:translateY(0)}',
    '#mmm-tb .in{max-width:1280px;margin:0 auto;display:flex;align-items:center;gap:18px;padding:0 max(16px,env(safe-area-inset-right,0px)) 0 max(16px,env(safe-area-inset-left,0px));min-height:52px;flex-wrap:wrap}',
    '#mmm-tb a{color:rgba(0,0,0,.8);text-decoration:none;white-space:nowrap}',
    '#mmm-tb a:hover,#mmm-tb a:focus-visible{color:#000;text-decoration:underline;text-underline-offset:5px}',
    '#mmm-tb a.on{color:#000;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:5px}',
    '#mmm-tb .home{display:flex;align-items:center;gap:9px;font-weight:800;font-size:16px;color:#000;margin-right:6px}',
    '#mmm-tb .crown{height:32px;width:32px;border-radius:8px;background:#0a0a0a;border:2px solid hsl(180,70%,55%);display:flex;align-items:center;justify-content:center}',
    '#mmm-tb nav{display:flex;flex-wrap:wrap;gap:6px 18px;align-items:center;padding:8px 0}',
    '#mmm-tb .x{margin-left:auto;background:rgba(0,0,0,.1);border:1px solid rgba(0,0,0,.25);border-radius:8px;height:32px;min-width:32px;cursor:pointer;font:700 16px/1 system-ui;color:#000}',
    '#mmm-tb-tab{position:fixed;top:0;left:50%;transform:translateX(-50%);z-index:2147483000;display:none;border:0;cursor:pointer;',
    ' background:linear-gradient(90deg,hsl(45,100%,55%),hsl(45,100%,65%));color:#000;font:800 11px/1 Inter,system-ui,sans-serif;letter-spacing:.06em;',
    ' padding:calc(4px + env(safe-area-inset-top,0px)) 12px 5px;border-radius:0 0 10px 10px;box-shadow:0 3px 10px rgba(0,0,0,.4);opacity:.92}',
    '@media (hover:none),(pointer:coarse){#mmm-tb-tab{display:block}#mmm-tb-zone{display:none}}',
    '@media (max-width:640px){#mmm-tb .in{gap:8px}#mmm-tb nav{gap:4px 14px;font-size:13px}}',
    '@media (prefers-reduced-motion:reduce){#mmm-tb{transition:none}}',
    '@media print{#mmm-tb,#mmm-tb-zone,#mmm-tb-tab{display:none!important}}'
  ].join('\n');
  document.head.appendChild(css);

  var CROWN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="hsl(45,100%,55%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Zm3 15h14"/></svg>';

  function mount() {
    var zone = document.createElement('div'); zone.id = 'mmm-tb-zone'; zone.setAttribute('aria-hidden', 'true');
    var bar = document.createElement('div'); bar.id = 'mmm-tb'; bar.setAttribute('role', 'banner');
    bar.innerHTML = '<div class="in"><a class="home" href="/" aria-label="MMM Trading home"><span class="crown">' + CROWN + '</span>MMM Trading</a>' +
      '<nav aria-label="Site menu">' + NAV.map(function (n) {
        return '<a href="' + n[1] + '"' + (active(n[1]) ? ' class="on" aria-current="page"' : '') + '>' + n[0] + '</a>';
      }).join('') + '</nav><button type="button" class="x" aria-label="Close menu">&times;</button></div>';
    var tab = document.createElement('button'); tab.id = 'mmm-tb-tab'; tab.type = 'button';
    tab.setAttribute('aria-label', 'Open the site menu'); tab.setAttribute('aria-expanded', 'false'); tab.textContent = 'MMM ▾';
    document.body.insertBefore(bar, document.body.firstChild); document.body.appendChild(zone); document.body.appendChild(tab);

    var t = 0;
    function open() { clearTimeout(t); bar.classList.add('open'); tab.setAttribute('aria-expanded', 'true'); }
    function close(now) {
      clearTimeout(t);
      t = setTimeout(function () { if (!bar.contains(document.activeElement)) { bar.classList.remove('open'); tab.setAttribute('aria-expanded', 'false'); } }, now ? 0 : 350);
    }
    zone.addEventListener('mouseenter', open);
    bar.addEventListener('mouseenter', open);
    bar.addEventListener('mouseleave', function () { close(false); });
    bar.addEventListener('focusin', open);
    bar.addEventListener('focusout', function () { setTimeout(function () { if (!bar.contains(document.activeElement)) close(true); }, 0); });
    // also open when the pointer touches the very top edge (some apps cover the hot zone)
    document.addEventListener('mousemove', function (e) { if (e.clientY <= 4) open(); }, { passive: true });
    tab.addEventListener('click', function () { if (bar.classList.contains('open')) close(true); else open(); });
    bar.querySelector('.x').addEventListener('click', function () { document.activeElement && document.activeElement.blur(); close(true); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && bar.classList.contains('open')) close(true); });
    document.addEventListener('touchstart', function (e) { if (bar.classList.contains('open') && !bar.contains(e.target) && e.target !== tab) close(true); }, { passive: true });
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
