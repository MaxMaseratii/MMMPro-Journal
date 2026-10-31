/* MMM Trading - the ONE menu of the whole site.
 * Loaded before /assets/site.js (marketing pages) and /assets/topbar.js (app pages:
 * journal, course, discipline test, backtests). Change a menu title here and every page follows.
 */
window.MMM_NAV = [
  ['Indicators', '/indicators/'],
  ['Strategies', '/strategies/'],
  ['Backtests', '/backtests/'],
  ['Free MMM Mastery Course', '/journal/?course=1'],
  ['Gamma & News', '/gamma/'],
  ['Trading Test', '/diagnostic/']
];

/* Site analytics (Whop Pixel + tagged Whop links). See /assets/analytics.js. */
(function () {
  if (window.__mmmAnalytics || location.pathname.indexOf('/admin') === 0) return;
  var s = document.createElement('script');
  s.src = '/assets/analytics.js';
  s.async = true;
  (document.head || document.documentElement).appendChild(s);
})();
