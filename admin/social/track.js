/* MMM SOCIAL+ visit tracker. Paste on a business site:
   <script src="https://www.maxmaserati.com/admin/social/track.js" data-biz="trading"></script>
   data-biz is trading, table, or ayiti. */
(function () {
  var s = document.currentScript;
  var biz = ((s && s.getAttribute('data-biz')) || '').replace(/[^a-z0-9]/gi, '').slice(0, 24);
  if (!biz) return;
  var q = new URLSearchParams(location.search);
  var post = (q.get('utm_campaign') || '').replace(/[^a-z0-9]/gi, '').slice(0, 40);
  var net = (q.get('utm_source') || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 24);
  function hit(key) {
    if (!key) return;
    try { fetch('https://abacus.jasoncameron.dev/hit/mmm-maserati-crm/' + key, { mode: 'cors', cache: 'no-store' }); } catch (e) {}
  }
  hit('v-' + biz);
  if (post && net) hit('v-' + post + '-' + net);
})();
