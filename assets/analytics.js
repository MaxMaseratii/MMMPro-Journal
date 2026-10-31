/* MMM Trading - site analytics.
 * Uses the Whop Pixel (free, part of the existing Whop account, no extra signup).
 * Page views show in the Whop dashboard under Websites, and visitors are linked to their Whop purchases.
 * Also tags every whop.com link with utm_source=website so Whop shows which site page sent each visit.
 * Loaded on every page by /assets/nav.js (and directly on /live/, /replay/ and /mmm-journal.html).
 * Skipped on /admin/.
 */
(function () {
  if (window.__mmmAnalytics) return;
  window.__mmmAnalytics = true;
  if (location.pathname.indexOf('/admin') === 0) return;

  // Whop Pixel (official snippet, https://docs.whop.com/developer/guides/pixel)
  !function(w,d,s,u,n,a,b){if(w[n])return;a=w[n]={q:[],t:+new Date,s:[],o:u,track:function(){a.q.push([+new Date].concat([].slice.call(arguments)))},setScope:function(){a.s=[].slice.call(arguments).filter(function(x){return typeof x==="string"});a.q.push([+new Date,"setScope"].concat(a.s))},scope:function(){var c=[].slice.call(arguments);return{track:function(){a.q.push([+new Date].concat([].slice.call(arguments)).concat([{__scope:c}]))}}}};b=d.createElement(s);b.async=1;b.src=u+"/s.js";d.getElementsByTagName(s)[0].parentNode.insertBefore(b,d.getElementsByTagName(s)[0])}(window,document,"script","https://t.whop.tw","whop");
  whop.setScope("biz_OTKPglmes94RKy");
  whop.track("page");

  // Tag whop.com links: utm_source=website, utm_medium=site, utm_campaign=<page>
  var page = location.pathname.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '_').toLowerCase() || 'home';
  function tag(a) {
    try {
      if (!a || !a.href) return;
      var url = new URL(a.href, location.href);
      if (url.hostname !== 'whop.com' && url.hostname !== 'www.whop.com') return;
      if (url.searchParams.has('utm_source')) return;
      url.searchParams.set('utm_source', 'website');
      url.searchParams.set('utm_medium', 'site');
      url.searchParams.set('utm_campaign', 'site_' + page);
      a.href = url.toString();
    } catch (e) {}
  }
  function tagAll() {
    var links = document.querySelectorAll('a[href*="whop.com"]');
    for (var i = 0; i < links.length; i++) tag(links[i]);
  }
  // Links added later by page scripts are tagged at the moment they are clicked.
  function onPress(e) {
    var el = e.target;
    while (el && el.tagName !== 'A') el = el.parentElement;
    if (el) tag(el);
  }
  document.addEventListener('mousedown', onPress, true);
  document.addEventListener('touchstart', onPress, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Enter') onPress(e); }, true);
  document.addEventListener('click', onPress, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tagAll);
  else tagAll();
})();
