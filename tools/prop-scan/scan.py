"""Daily prop firm promo scan (runs in GitHub Actions, see .github/workflows/prop-offers-scan.yml).

For every firm in prop-firms/plans.json it opens the firm's own home page and plan pages in a real
browser, then saves what a promo checker needs:
  - promo lines (text with "% off", "discount", "code", "sale", "black friday"...)
  - possible codes written on the page
  - buy / checkout links with their text (to find the direct link of each account size)
  - the firm's YouTube and Discord links; the latest YouTube videos (from the channel's RSS feed)
    with any promo lines in their title or description.
Output: prop-firms/scan/latest.json. Nothing here is published on the page directly: the daily
offers check reads it, confirms, and writes prop-firms/offers.json and prop-firms/links.json.
"""
import json, re, sys, time, datetime, urllib.request, html
from urllib.parse import urljoin, urlparse
from xml.etree import ElementTree as ET

from playwright.sync_api import sync_playwright

ROOT = sys.argv[1] if len(sys.argv) > 1 else "."
PLANS = json.load(open(f"{ROOT}/prop-firms/plans.json", encoding="utf-8"))
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/124.0 Safari/537.36")
PROMO = re.compile(r"(\d{1,2}\s?%\s?off|% discount|discount|promo|coupon|use code|code[:\s]|sale\b|black friday|"
                   r"cyber monday|limited time|ends (in|on|soon)|save \$?\d|\boff (all|every|any)\b|special offer|flash)", re.I)
CODE = re.compile(r"(?:code|coupon|promo)\s*[:\-]?\s*[\"'“”]?([A-Z0-9][A-Z0-9_\-]{2,19})\b", re.I)
BUY = re.compile(r"(checkout|purchase|buy|cart|order|signup|sign-up|register|get-started|evaluation|challenge|plan|account|pricing)", re.I)
SIZE = re.compile(r"(\b\d{1,3}\s?k\b|\$\s?\d{2,3},?000|\b\d{2,3},000\b)", re.I)
STOP = {"CODE", "COUPON", "PROMO", "OFF", "THE", "AND", "FOR", "YOUR", "WITH", "HERE", "BELOW", "APPLY", "APPLIED", "CHECKOUT"}
NOW = datetime.datetime.now(datetime.timezone.utc)


def clean(s, n=240):
    s = re.sub(r"\s+", " ", s or "").strip()
    return s[:n]


def get(url, timeout=20):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


def promo_lines(text):
    out, seen = [], set()
    for ln in re.split(r"[\n\r]+", text or ""):
        ln = clean(ln)
        if 6 <= len(ln) and PROMO.search(ln) and ln.lower() not in seen:
            seen.add(ln.lower()); out.append(ln)
    return out[:25]


def codes(text):
    out = []
    for m in CODE.finditer(text or ""):
        c = m.group(1)
        if c.upper() == c and c.upper() not in STOP and not c.isdigit() and c not in out:
            out.append(c)
    return out[:10]


def scan_page(page, url):
    r = {"url": url, "ok": False}
    try:
        resp = page.goto(url, wait_until="domcontentloaded", timeout=35000)
        try:
            page.wait_for_load_state("networkidle", timeout=12000)
        except Exception:
            pass
        page.wait_for_timeout(2500)
        r["status"] = resp.status if resp else None
        r["final"] = page.url
        r["title"] = clean(page.title(), 160)
        text = page.inner_text("body", timeout=10000)
        links = page.eval_on_selector_all(
            "a[href]", "els => els.map(a => [a.href, (a.innerText || a.getAttribute('aria-label') || '').trim()])")
        host = urlparse(page.url).netloc.replace("www.", "")
        r["promo"] = promo_lines(text)
        r["codes"] = codes(text)
        buy, social = [], {"youtube": [], "discord": [], "x": []}
        for href, t in links:
            if not href.startswith("http"):
                continue
            h = urlparse(href).netloc.lower()
            if "youtube.com" in h or "youtu.be" in h:
                social["youtube"].append(href)
            elif "discord.gg" in h or "discord.com" in h:
                social["discord"].append(href)
            elif h.endswith("x.com") or h.endswith("twitter.com"):
                social["x"].append(href)
            elif (BUY.search(href) or BUY.search(t)) and (SIZE.search(t) or SIZE.search(href) or host not in h):
                item = [href, clean(t, 80)]
                if item not in buy:
                    buy.append(item)
        r["buy_links"] = buy[:60]
        r["social"] = {k: sorted(set(v))[:5] for k, v in social.items()}
        r["ok"] = True
    except Exception as e:
        r["error"] = clean(str(e), 200)
    return r


def youtube(channel_links):
    """Latest videos of the firm's channel, from its public RSS feed."""
    for link in channel_links:
        try:
            m = re.search(r"/channel/(UC[\w-]{20,})", link)
            cid = m.group(1) if m else None
            if not cid:
                page = get(link)
                m = re.search(r'"(?:channelId|externalId)":"(UC[\w-]{20,})"', page) or \
                    re.search(r'youtube\.com/channel/(UC[\w-]{20,})', page)
                cid = m.group(1) if m else None
            if not cid:
                continue
            feed = ET.fromstring(get(f"https://www.youtube.com/feeds/videos.xml?channel_id={cid}"))
            ns = {"a": "http://www.w3.org/2005/Atom", "m": "http://search.yahoo.com/mrss/"}
            vids = []
            for e in feed.findall("a:entry", ns)[:8]:
                pub = e.findtext("a:published", "", ns)
                try:
                    age = (NOW - datetime.datetime.fromisoformat(pub.replace("Z", "+00:00"))).days
                except Exception:
                    age = None
                if age is not None and age > 21:
                    continue
                title = e.findtext("a:title", "", ns)
                desc = e.findtext("m:group/m:description", "", ns)
                link = (e.find("a:link", ns).get("href") if e.find("a:link", ns) is not None else "")
                vids.append({"title": clean(title, 160), "url": link, "published": pub[:10],
                             "promo": promo_lines(title + "\n" + desc)[:8], "codes": codes(title + "\n" + desc)})
            return {"channel": f"https://www.youtube.com/channel/{cid}", "videos": vids}
        except Exception as e:
            last = clean(str(e), 160)
            continue
    return None


def main():
    out = {"scanned": NOW.strftime("%Y-%m-%dT%H:%M:%SZ"), "firms": {}}
    with sync_playwright() as p:
        br = p.chromium.launch()
        ctx = br.new_context(user_agent=UA, viewport={"width": 1366, "height": 900}, locale="en-US")
        for name, firm in PLANS["firms"].items():
            urls = []
            site = (firm.get("logo") or {}).get("site")
            if site:
                urls.append(site.rstrip("/") + "/")
            for pl in PLANS["plans"]:
                if pl["firm"] == name and pl.get("src") and pl["src"] not in urls:
                    urls.append(pl["src"])
            page = ctx.new_page()
            pages = [scan_page(page, u) for u in urls[:4]]
            page.close()
            yt = sorted({l for pg in pages for l in pg.get("social", {}).get("youtube", [])})
            yt = [l for l in yt if re.search(r"/(@|c/|channel/|user/)", l)] or yt
            dc = sorted({l for pg in pages for l in pg.get("social", {}).get("discord", [])})
            xx = sorted({l for pg in pages for l in pg.get("social", {}).get("x", [])})
            out["firms"][name] = {"pages": pages, "youtube": youtube(yt[:3]) if yt else None,
                                  "discord": dc[:3], "x": xx[:3]}
            print(name, [pg.get("ok") for pg in pages], "yt" if yt else "", flush=True)
            time.sleep(1)
        br.close()
    import os
    os.makedirs(f"{ROOT}/prop-firms/scan", exist_ok=True)
    with open(f"{ROOT}/prop-firms/scan/latest.json", "w", encoding="utf-8") as f:
        json.dump(out, f, indent=1, ensure_ascii=False)
        f.write("\n")


if __name__ == "__main__":
    main()
