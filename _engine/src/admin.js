// Small page shown after the Microsoft (Hotmail) sign-in.
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function messagePage(title, text, backUrl) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${esc(title)}</title><style>body{margin:0;background:#0b0f12;color:#e8eef1;font:15px/1.5 Inter,system-ui,sans-serif}
main{max-width:560px;margin:15vh auto;padding:0 16px}h1{font-size:22px}a{color:hsl(45,100%,55%)}</style></head>
<body><main><h1>${esc(title)}</h1><p>${esc(text)}</p>${backUrl ? `<p><a href="${esc(backUrl)}">Back to the admin page</a></p>` : ''}</main></body></html>`;
}
