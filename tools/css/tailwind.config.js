// Builds /assets/tw.css (replaces the Tailwind CDN script). Run from the repo root after changing classes in any page:
//   npx tailwindcss@3.4.17 -c tools/css/tailwind.config.js -i tools/css/tw.in.css -o assets/tw.css --minify
module.exports = { content: ['./**/*.html', './assets/**/*.js', './vip/*.js', './*.js', '!./node_modules/**'], theme: { extend: {} }, plugins: [] };
