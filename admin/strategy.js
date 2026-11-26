/* Admin · MMM Personal Strategy tab (Nov 25 2026).
   The page moved to maxmaserati.com/mmm-personal/: its content and pictures are stored ENCRYPTED and open only for the
   admin login or a paying Whop member ("MMM Personal Strategy · Read Access": $10 first month then $4.99 / 30 days, or $100 lifetime).
   This tab shows that page inside the admin. */
(function () {
  'use strict';
  var done = false;
  window.MMMStrategy = function () {
    if (done) return; done = true;
    var box = document.getElementById('stx'); if (!box) return;
    box.innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:12px">' +
      '<a class="btn" href="/mmm-personal/" target="_blank" rel="noopener">Open full screen</a>' +
      '<span style="color:var(--mute);font-size:13.5px">Your own strategy page (MMM ONE · MMCB Edge 1 · MMM Orderflow). It opens with your admin login, no payment. Members see the same page after paying on Whop: <a href="https://whop.com/checkout/plan_FmSImcTSTpHtj" target="_blank" rel="noopener">monthly $10 → $4.99</a> · ' +
      '<a href="https://whop.com/checkout/ch_gEVsCTqdcJjBXO6/" target="_blank" rel="noopener">lifetime $100</a> · package for members: <a href="https://whop.com/checkout/plan_IJvX1RJ0sQUQv" target="_blank" rel="noopener">$95 / month</a></span></div>' +
      '<iframe src="/mmm-personal/" title="MMM Personal Strategy" style="width:100%;height:85vh;border:1px solid var(--rule2);background:#0b0f12" loading="lazy"></iframe>';
  };
})();
