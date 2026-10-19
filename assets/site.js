/* MMM Trading - shared header, footer and account (log in / register).
 * Every marketing page loads Tailwind (CDN), puts <div id="mmm-header"></div> at the top and
 * <div id="mmm-footer"></div> at the bottom, then loads this file BEFORE i18n.js.
 * Accounts use the same Firebase project as the MMM Pro Journal, so a log-in here is a log-in there.
 */
(function () {
  'use strict';

  var CFG = {
    apiKey: 'AIzaSyDcrEEhcY6kHLQxZ7RQ37KmAcCDPgol0gg',
    authDomain: 'mmm-pro-journal.firebaseapp.com',
    projectId: 'mmm-pro-journal',
    storageBucket: 'mmm-pro-journal.firebasestorage.app',
    messagingSenderId: '46182009652',
    appId: '1:46182009652:web:14574d6cfee75fe483f361'
  };
  var FB_APP = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js';
  var FB_AUTH = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js';

  // The menu lives in /assets/nav.js (shared with the app pages). Fallback copy below.
  var NAV = window.MMM_NAV || [
    ['Indicators', '/indicators/'],
    ['Backtests', '/backtests/'],
    ['Course', '/journal/?course=1'],
    ['Journal', '/journal/'],
    ['Gamma', '/gamma/'],
    ['News', '/news/'],
    ['Free Test', '/diagnostic/'],
    ['Pricing', '/whop/']
  ];
  // Max's channels (handle @MaxMaserati)
  var SOCIAL = [
    ['Twitch', 'https://www.twitch.tv/maxmaserati'],
    ['YouTube', 'https://www.youtube.com/@MaxMaserati'],
    ['TikTok', 'https://www.tiktok.com/@maxmaserati'],
    ['X', 'https://x.com/MaxMaserati'],
    ['Facebook', 'https://www.facebook.com/MaxMaserati']
  ];
  var CROWN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--mmm-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Zm3 15h14"/></svg>';

  /* ---------- shared style (brand tokens + the few things Tailwind does not cover) ---------- */
  var css = document.createElement('style');
  css.textContent = [
    ':root{--mmm-black:hsl(0,0%,4%);--mmm-dark:hsl(0,0%,9%);--mmm-surface:hsl(0,0%,12%);--mmm-gold:hsl(45,100%,55%);--mmm-gold-light:hsl(45,100%,65%);--mmm-tiffany:hsl(180,70%,55%);--mmm-tiffany-light:hsl(180,80%,65%);--mmm-green:hsl(142,76%,36%);--mmm-red:hsl(0,72%,60%)}',
    '.gold-text{background-image:linear-gradient(90deg,var(--mmm-gold),var(--mmm-gold-light));-webkit-background-clip:text;background-clip:text;color:transparent}',
    '.teal-text{background-image:linear-gradient(90deg,var(--mmm-tiffany),var(--mmm-tiffany-light));-webkit-background-clip:text;background-clip:text;color:transparent}',
    '.crown-badge{background:var(--mmm-black);border:2px solid var(--mmm-tiffany)}',
    '.mmm-nav a.active{color:#000;text-decoration:underline;text-underline-offset:6px;text-decoration-thickness:2px}',
    '#mmm-auth input{background:#0b0b0b;border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:11px 12px;width:100%;color:#fff;outline:none}',
    '#mmm-auth input:focus{border-color:var(--mmm-tiffany)}',
    '#mmm-auth .tab[aria-selected=true]{background:linear-gradient(90deg,var(--mmm-gold),var(--mmm-gold-light));color:#000}',
    'body.mmm-lock{overflow:hidden}',
    '.grid>*{min-width:0}'
  ].join('\n');
  document.head.appendChild(css);

  function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function here(href) {
    var p = location.pathname.replace(/index\.html$/, '');
    var h = href.split('?')[0];
    return h !== '/' && h !== '/journal/' && p.indexOf(h) === 0;
  }

  /* ---------- header ---------- */
  function headerHTML() {
    var links = NAV.map(function (n) {
      return '<a href="' + n[1] + '" class="hover:text-black transition' + (here(n[1]) ? ' active' : '') + '">' + n[0] + '</a>';
    }).join('');
    var mlinks = NAV.map(function (n) {
      return '<a href="' + n[1] + '" class="block px-2 py-2.5 rounded-lg hover:bg-white/5">' + n[0] + '</a>';
    }).join('');
    return '' +
      '<header class="sticky top-0 z-40 shadow-xl" style="background:linear-gradient(90deg,var(--mmm-gold),var(--mmm-gold-light),var(--mmm-gold));">' +
      '<div class="max-w-7xl mx-auto px-4 sm:px-8"><div class="h-[68px] flex items-center justify-between gap-3">' +
      '<a href="/" class="flex items-center gap-3 shrink-0" aria-label="MMM Trading home">' +
      '<div class="crown-badge h-10 w-10 rounded-lg flex items-center justify-center shadow-lg">' + CROWN + '</div>' +
      '<div class="flex flex-col leading-tight"><span class="text-lg font-extrabold tracking-tight"><span class="text-black">MMM</span><span class="text-black/70"> Trading</span></span>' +
      '<span class="text-[11px] font-semibold text-black/70">Max Maserati Model</span></div></a>' +
      '<nav class="mmm-nav hidden xl:flex items-center gap-6 text-sm font-semibold text-black/80">' + links + '</nav>' +
      '<div class="flex items-center gap-2">' +
      '<select id="lang-switch" aria-label="Language" class="hidden sm:block bg-black/10 border border-black/25 text-black text-xs font-semibold rounded-lg px-2 py-2 outline-none cursor-pointer hover:bg-black/15 transition"></select>' +
      '<div id="mmm-acct" class="flex items-center gap-2">' + acctHTML(null) + '</div>' +
      '<button id="mmm-burger" class="xl:hidden h-10 w-10 rounded-lg bg-black/10 border border-black/25 flex items-center justify-center" aria-label="Menu" aria-expanded="false">' +
      '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="#000" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
      '</div></div></div>' +
      '<div id="mmm-mobile" class="xl:hidden hidden border-t border-black/20 bg-black text-white">' +
      '<div class="max-w-7xl mx-auto px-4 py-3 text-[15px] font-semibold">' + mlinks +
      '<div id="mmm-acct-m" class="flex gap-2 pt-3 mt-2 border-t border-white/10"></div></div></div>' +
      '</header>';
  }

  function acctHTML(user) {
    if (user) {
      var name = esc(user.displayName || (user.email || '').split('@')[0] || 'Account');
      return '<a href="/journal/" class="hidden sm:inline-block text-sm font-bold bg-black text-[color:var(--mmm-gold)] border-2 border-[color:var(--mmm-tiffany)] px-4 py-2 rounded-lg hover:bg-gray-900 transition">Open Journal</a>' +
        '<button data-mmm="logout" class="hidden sm:inline-block text-sm font-semibold text-black/80 hover:text-black px-2 py-2" title="Log out ' + name + '">Log out</button>';
    }
    return '<button data-mmm="login" class="hidden sm:inline-block text-sm font-bold text-black/80 hover:text-black px-2.5 py-2">Log in</button>' +
      '<button data-mmm="register" class="text-sm font-bold bg-black text-[color:var(--mmm-gold)] border-2 border-[color:var(--mmm-tiffany)] px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-900 transition">Register</button>';
  }

  function acctMobileHTML(user) {
    if (user) {
      return '<a href="/journal/" class="flex-1 text-center font-bold bg-[color:var(--mmm-gold)] text-black rounded-lg py-2.5">Open Journal</a>' +
        '<button data-mmm="logout" class="flex-1 font-bold border border-white/20 rounded-lg py-2.5">Log out</button>';
    }
    return '<button data-mmm="login" class="flex-1 font-bold border border-white/20 rounded-lg py-2.5">Log in</button>' +
      '<button data-mmm="register" class="flex-1 font-bold bg-[color:var(--mmm-gold)] text-black rounded-lg py-2.5">Register</button>';
  }

  /* ---------- footer ---------- */
  function footerHTML() {
    var year = new Date().getFullYear();
    function col(title, items) {
      return '<div><h3 class="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">' + title + '</h3><ul class="space-y-2">' +
        items.map(function (i) { return '<li><a href="' + i[1] + '"' + (/^https?:/.test(i[1]) ? ' target="_blank" rel="noopener"' : '') + ' class="hover:text-white transition">' + i[0] + '</a></li>'; }).join('') +
        '</ul></div>';
    }
    return '' +
      '<footer class="border-t border-white/10 bg-black/40 text-sm text-gray-500">' +
      '<div class="max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">' +
      '<div class="lg:col-span-2"><div class="flex items-center gap-2.5 mb-3"><div class="crown-badge h-8 w-8 rounded-lg flex items-center justify-center">' + CROWN.replace('h-6 w-6', 'h-4 w-4') + '</div>' +
      '<span class="font-bold text-gray-200">Max Maserati Trading University</span></div>' +
      '<p class="leading-relaxed max-w-sm">Order-flow education, the MMM Pro indicators and a prop-firm journal for ES and NQ futures traders.</p>' +
      '<p class="mt-4"><a href="mailto:infotrade@maxmaserati.com" class="hover:text-white transition">infotrade@maxmaserati.com</a></p></div>' +
      col('MMM', [['MMM Pro Indicators', '/indicators/'], ['Backtests & Strategies', '/backtests/'], ['Free Course', '/journal/?course=1'], ['MMM Pro Journal', '/journal/'], ['Pricing', '/whop/']]) +
      col('Free tools', [['Gamma Levels', '/gamma/'], ['News Calendar', '/news/'], ['Trading Discipline Test', '/diagnostic/']]) +
      col('Watch live', SOCIAL) +
      '</div>' +
      '<div class="max-w-6xl mx-auto px-5 sm:px-8 pb-10">' +
      '<div class="border-t border-white/10 pt-6 text-xs leading-relaxed text-gray-500 space-y-3">' +
      '<p><b class="text-gray-400">Risk disclosure.</b> Futures and options trading involves substantial risk of loss and is not suitable for every investor. You can lose more than your initial deposit. Only risk capital should be used. Everything on this website, in the course, the indicators and the journal is for education only. It is not financial, investment or trading advice and not a recommendation to buy or sell anything.</p>' +
      '<p><b class="text-gray-400">Hypothetical results.</b> Hypothetical or simulated performance results have inherent limits. They are prepared with hindsight, do not represent actual trading and do not account for slippage, fees or liquidity. Past performance, real or simulated, is not a guarantee of future results.</p>' +
      '<div class="flex flex-wrap items-center justify-between gap-3 pt-2"><span>&copy; ' + year + ' Max Maserati Trading University. All rights reserved.</span>' +
      '<span class="flex flex-wrap gap-4"><a href="/legal/#terms" class="hover:text-white transition">Terms of Use</a><a href="/legal/#risk" class="hover:text-white transition">Risk Disclosure</a><a href="/legal/#privacy" class="hover:text-white transition">Privacy</a></span></div>' +
      '</div></div></footer>';
  }

  /* ---------- account modal ---------- */
  function modalHTML() {
    return '' +
      '<div id="mmm-auth" class="fixed inset-0 z-50 hidden items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="mmm-auth-title">' +
      '<div data-mmm="close" class="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>' +
      '<div class="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111] shadow-2xl p-6 sm:p-7 text-white">' +
      '<button data-mmm="close" class="absolute top-3 right-3 h-9 w-9 rounded-lg hover:bg-white/10 text-gray-400" aria-label="Close">&times;</button>' +
      '<div class="flex items-center gap-3 mb-5"><div class="crown-badge h-10 w-10 rounded-lg flex items-center justify-center">' + CROWN + '</div>' +
      '<div><h2 id="mmm-auth-title" class="text-lg font-extrabold">Your MMM account</h2><p class="text-xs text-gray-400">One account for the course, the journal and the free tools.</p></div></div>' +
      '<div class="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/5 mb-5" role="tablist">' +
      '<button class="tab rounded-lg py-2 text-sm font-bold" role="tab" data-tab="login" aria-selected="true">Log in</button>' +
      '<button class="tab rounded-lg py-2 text-sm font-bold" role="tab" data-tab="register" aria-selected="false">Register</button></div>' +
      '<form id="mmm-auth-form" class="space-y-3" novalidate>' +
      '<div data-only="register"><label class="block text-xs font-semibold text-gray-400 mb-1" for="mmm-name">Name</label><input id="mmm-name" autocomplete="name" placeholder="Your name"></div>' +
      '<div><label class="block text-xs font-semibold text-gray-400 mb-1" for="mmm-email">Email</label><input id="mmm-email" type="email" autocomplete="email" placeholder="you@email.com" required></div>' +
      '<div data-hide="reset"><label class="block text-xs font-semibold text-gray-400 mb-1" for="mmm-pass">Password</label><input id="mmm-pass" type="password" autocomplete="current-password" placeholder="At least 6 characters" required></div>' +
      '<label data-only="register" class="flex items-start gap-2 text-xs text-gray-400"><input id="mmm-terms" type="checkbox" style="width:auto;margin-top:2px"> <span>I accept the <a href="/legal/#terms" class="underline hover:text-white" target="_blank">Terms</a>, the <a href="/legal/#risk" class="underline hover:text-white" target="_blank">Risk Disclosure</a> and the <a href="/legal/#privacy" class="underline hover:text-white" target="_blank">Privacy Policy</a>.</span></label>' +
      '<p id="mmm-auth-msg" class="text-sm min-h-[1.25rem]" aria-live="polite"></p>' +
      '<button id="mmm-auth-go" type="submit" class="w-full font-bold text-black py-3 rounded-xl transition hover:brightness-110" style="background:linear-gradient(90deg,var(--mmm-gold),var(--mmm-gold-light));">Log in</button>' +
      '<div class="flex justify-between text-xs text-gray-400 pt-1"><button type="button" data-mmm="reset" class="hover:text-white" data-only="login">Forgot password?</button><button type="button" data-mmm="back" class="hover:text-white hidden">&larr; Back to log in</button><a href="/journal/" class="hover:text-white">Go to the journal &rarr;</a></div>' +
      '</form></div></div>';
  }

  var mode = 'login';
  function setMode(m) {
    mode = m;
    var root = document.getElementById('mmm-auth');
    root.querySelectorAll('.tab').forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.tab === (m === 'reset' ? 'login' : m))); });
    root.querySelectorAll('[data-only]').forEach(function (el) { el.style.display = el.dataset.only === m ? '' : 'none'; });
    root.querySelectorAll('[data-hide]').forEach(function (el) { el.style.display = el.dataset.hide === m ? 'none' : ''; });
    root.querySelector('[data-mmm="back"]').classList.toggle('hidden', m !== 'reset');
    document.getElementById('mmm-pass').setAttribute('autocomplete', m === 'register' ? 'new-password' : 'current-password');
    document.getElementById('mmm-auth-go').textContent = m === 'register' ? 'Create my free account' : m === 'reset' ? 'Send reset link' : 'Log in';
    msg('');
  }
  function msg(t, ok) {
    var el = document.getElementById('mmm-auth-msg');
    el.textContent = t;
    el.style.color = ok ? 'var(--mmm-tiffany-light)' : 'var(--mmm-red)';
  }
  function openAuth(m) {
    var root = document.getElementById('mmm-auth');
    setMode(m || 'login');
    root.classList.remove('hidden'); root.classList.add('flex');
    document.body.classList.add('mmm-lock');
    setTimeout(function () { (document.getElementById(m === 'register' ? 'mmm-name' : 'mmm-email')).focus(); }, 30);
    fbReady();
  }
  function closeAuth() {
    var root = document.getElementById('mmm-auth');
    root.classList.add('hidden'); root.classList.remove('flex');
    document.body.classList.remove('mmm-lock');
    if (/^#(login|register)$/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
  }
  function niceError(e) {
    var c = (e && e.code) || '';
    if (c.indexOf('invalid-credential') >= 0 || c.indexOf('wrong-password') >= 0 || c.indexOf('user-not-found') >= 0) return 'Email or password is not right.';
    if (c.indexOf('email-already-in-use') >= 0) return 'This email already has an account. Log in instead.';
    if (c.indexOf('weak-password') >= 0) return 'Use a password of at least 6 characters.';
    if (c.indexOf('invalid-email') >= 0) return 'This email address is not valid.';
    if (c.indexOf('too-many-requests') >= 0) return 'Too many tries. Wait a minute and try again.';
    if (c.indexOf('network') >= 0) return 'No connection. Check your internet and try again.';
    return (e && e.message ? e.message : 'Something went wrong.').replace('Firebase: ', '');
  }

  /* ---------- Firebase (loaded once, in the background) ---------- */
  var fbPromise = null;
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = src; s.async = true; s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
  }
  function fbReady() {
    if (fbPromise) return fbPromise;
    fbPromise = (window.firebase && window.firebase.auth ? Promise.resolve() : loadScript(FB_APP).then(function () { return loadScript(FB_AUTH); }))
      .then(function () {
        if (!firebase.apps.length) firebase.initializeApp(CFG);
        var a = firebase.auth();
        return a.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function () { return a; });
      });
    fbPromise.catch(function () { fbPromise = null; });
    return fbPromise;
  }

  function renderAcct(user) {
    var a = document.getElementById('mmm-acct'), m = document.getElementById('mmm-acct-m');
    if (a) a.innerHTML = acctHTML(user);
    if (m) m.innerHTML = acctMobileHTML(user);
  }

  function submit(ev) {
    ev.preventDefault();
    var email = document.getElementById('mmm-email').value.trim();
    var pass = document.getElementById('mmm-pass').value;
    var name = document.getElementById('mmm-name').value.trim();
    var btn = document.getElementById('mmm-auth-go');
    if (!email) { msg('Enter your email.'); return; }
    if (mode !== 'reset' && !pass) { msg('Enter your password.'); return; }
    if (mode === 'register' && !document.getElementById('mmm-terms').checked) { msg('Please accept the Terms to create an account.'); return; }
    btn.disabled = true; btn.style.opacity = '.6';
    fbReady().then(function (auth) {
      if (mode === 'reset') {
        return auth.sendPasswordResetEmail(email).then(function () { msg('Check your inbox: we sent you a reset link.', true); });
      }
      if (mode === 'register') {
        return auth.createUserWithEmailAndPassword(email, pass).then(function (cred) {
          return (name ? cred.user.updateProfile({ displayName: name }) : Promise.resolve()).then(function () {
            msg('Account created. Opening your journal...', true);
            setTimeout(function () { location.href = '/journal/'; }, 700);
          });
        });
      }
      return auth.signInWithEmailAndPassword(email, pass).then(function () {
        msg('Welcome back.', true);
        setTimeout(closeAuth, 500);
      });
    }).catch(function (e) { msg(niceError(e)); })
      .then(function () { btn.disabled = false; btn.style.opacity = ''; });
  }

  /* ---------- mount ---------- */
  var h = document.getElementById('mmm-header');
  if (h) h.outerHTML = headerHTML();
  var f = document.getElementById('mmm-footer');
  if (f) f.outerHTML = footerHTML();
  document.body.insertAdjacentHTML('beforeend', modalHTML());
  renderAcct(null);

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-mmm],[data-tab],#mmm-burger');
    if (!t) return;
    if (t.id === 'mmm-burger') {
      var mm = document.getElementById('mmm-mobile');
      var open = mm.classList.toggle('hidden') === false;
      t.setAttribute('aria-expanded', String(open));
      return;
    }
    if (t.dataset.tab) { setMode(t.dataset.tab); return; }
    var act = t.dataset.mmm;
    if (act === 'login' || act === 'register') { e.preventDefault(); openAuth(act); }
    else if (act === 'close') closeAuth();
    else if (act === 'reset') setMode('reset');
    else if (act === 'back') setMode('login');
    else if (act === 'logout') fbReady().then(function (a) { return a.signOut(); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAuth(); });
  document.getElementById('mmm-auth-form').addEventListener('submit', submit);

  // links like /#register or <a href="#login"> open the account box
  function hashOpen() { if (location.hash === '#login' || location.hash === '#register') openAuth(location.hash.slice(1)); }
  window.addEventListener('hashchange', hashOpen);
  hashOpen();

  window.MMM = { openAuth: openAuth };

  // show the right buttons as soon as Firebase knows who is here
  fbReady().then(function (auth) { auth.onAuthStateChanged(renderAcct); }).catch(function () { });
})();
