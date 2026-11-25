# MiniMax OS engine

The server behind **maxmaserati.com/admin** (Mail tab) and the **Claude email connector**.
This folder starts with `_`, so GitHub Pages does not publish it on the website.

## Host on Render
New → Web Service → this repo, then:
- **Root Directory:** `_engine`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Health Check Path:** `/healthz`
- Plan: Starter keeps it awake. The free plan sleeps after 15 minutes, so the first call then takes about a minute.

After the first deploy, put the service address in `/assets/mmm-config.js` → `window.MMM_ENGINE_URL`.

## Environment variables (Render → Environment; never in code, this repo is public)
| Name | What |
|---|---|
| `HUB_TOKEN` | 32+ random characters. Turns on the Claude connector at `/mcp/<HUB_TOKEN>`. |
| `PW_DR` | Google app password for dr.etienne.bm@gmail.com |
| `PW_INFOTRADE` | Google app password for infotrade@maxmaserati.com |
| `PW_BMB` | Google app password for bmbillionsinvestments@gmail.com |
| `PW_MISTERBME` | Google app password for misterbme02@gmail.com |
| `MS_CLIENT_ID`, `MS_CLIENT_SECRET` | Microsoft app for misterbme02@hotmail.com (optional, later) |
| `PERSONAL_KEY` | The MMM Personal Strategy page key (base64, 32 bytes). Given only to logged-in members with a paying Whop membership of "MMM Personal Strategy · Read Access" (5-day grace). |
| `ADMIN_EMAILS` | Optional. Logins allowed to use the Mail tab. Default `infotrade@maxmaserati.com` |

## What it serves
- `/api/*`: the Mail tab. Every call needs the admin's Firebase login (project `mmm-pro-journal`) and only answers maxmaserati.com.
- `/mcp/<HUB_TOKEN>`: Claude custom connector. Tools: list_accounts, list_folders, search_emails (Gmail search syntax), read_email (does not mark read), mark_read, archive_emails, trash_emails (recoverable), mark_spam, unsubscribe, send_email (only after approval; signature general / itl / none).
- `/oauth/ms/callback`: Hotmail sign-in return.
- `/healthz`. Everything else is 404. Logs never contain the token, logins or email text.
