/* MMM Trading - the ONE menu of the whole site.
 * Loaded before /assets/site.js (marketing pages) and /assets/topbar.js (app pages:
 * journal, course, discipline test, backtests). Change a menu title here and every page follows.
 */
window.MMM_NAV = [
  ['Indicators', '/indicators/'],
  ['Strategies', '/strategies/'],
  ['Backtests', '/backtests/'],
  // a group = [title, [[title, link, one-line description], ...]] -> a dropdown on desktop, a sub-list on mobile
  ['Free MMM Mastery & Tools', [
    ['Free MMM Mastery Course', '/journal/?course=1', 'The full MMM method, free'],
    ['Trading Test', '/diagnostic/', 'Check your trading discipline'],
    ['Gamma & News', '/gamma/', 'Daily gamma levels and news calendar'],
    ['Prop Scale Planner', '/prop-scale/', 'Plan your prop accounts, with proof']
  ]],
  ['V.I.P', '/vip/']
];

/* Site analytics (Whop Pixel + tagged Whop links). See /assets/analytics.js. */
(function () {
  if (window.__mmmAnalytics || location.pathname.indexOf('/admin') === 0) return;
  var s = document.createElement('script');
  s.src = '/assets/analytics.js';
  s.async = true;
  (document.head || document.documentElement).appendChild(s);
})();
