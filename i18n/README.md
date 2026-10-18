# Site translations

- `/i18n.js` translates every page (including content drawn later, like the backtests tabs).
- Dictionaries: `i18n/<lang>/common.json` (menu, footer, account box) + `i18n/<lang>/<page>.json`.
  Languages: fr, es, ht, ja, zh, de. English is the page itself.
- Keys are the English text of each sentence-sized element, with spaces collapsed and every number
  replaced by `{0}`, `{1}`… (so "Max 2 open" and "Max 1 open" share one key).
- Anything that must stay in English: add `translate="no"` (e.g. news event names, grid data rows).
- New or changed English text shows in English until its key is added to these files.
