// MMM Personal Strategy page (maxmaserati.com/mmm-personal/): who may open it.
// The page content is stored ENCRYPTED in the public repo (AES-256-GCM). This route hands the key only to a
// logged-in maxmaserati.com user whose email has a paying Whop membership of "MMM Personal Strategy · Read Access":
//   - Monthly ($10 first month, then $4.99 / 30 days): active or trialing, or past due for at most GRACE_DAYS after
//     the renewal date (5 days to pay). Canceled / expired = locked; joining again costs the $10 again (Whop).
//   - Lifetime ($100 once): always open.
// Needs on the engine (Render → Environment): WHOP_API_KEY (already there) and PERSONAL_KEY (the page key, base64).
const BASE = process.env.WHOP_API_BASE || 'https://api.whop.com/api/v1';
const ACCOUNT = process.env.WHOP_ACCOUNT_ID || 'biz_OTKPglmes94RKy';
export const PRODUCT = process.env.PERSONAL_PRODUCT_ID || 'prod_UbCnTuFHcSqmu';
const GRACE_DAYS = Number(process.env.PERSONAL_GRACE_DAYS || 5);
const DAY = 864e5;
let cache = { at: 0, list: null };

export const personalReady = () => Boolean(process.env.WHOP_API_KEY && process.env.PERSONAL_KEY);
export const personalKey = () => process.env.PERSONAL_KEY;

async function page(after) {
  const url = new URL(BASE + '/memberships');
  url.searchParams.set('account_id', ACCOUNT);
  url.searchParams.set('product_id', PRODUCT);
  url.searchParams.set('first', '100');
  if (after) url.searchParams.set('after', after);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${process.env.WHOP_API_KEY}`, Accept: 'application/json' }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`Whop answered ${res.status}`);
  return res.json();
}

async function memberships() {
  if (cache.list && Date.now() - cache.at < 60e3) return cache.list;
  const out = [];
  let after = null;
  for (let i = 0; i < 50; i++) {
    const j = await page(after);
    out.push(...(j.data || []));
    if (!j.page_info?.has_next_page) break;
    after = j.page_info.end_cursor;
  }
  cache = { at: Date.now(), list: out };
  return out;
}

const emailOf = (m) => String(m.user?.email || m.email || m.member?.email || '').toLowerCase();
const ts = (v) => (v == null ? NaN : typeof v === 'number' ? (v < 1e12 ? v * 1000 : v) : Date.parse(v));

// One membership → { open, why, until }
export function judge(m, now = Date.now()) {
  const st = String(m.status || '');
  const end = ts(m.renewal_period_end ?? m.current_period_end);
  const oneTime = !m.renewal_period_end && !m.current_period_end;
  if (st === 'completed' || (oneTime && (st === 'active' || st === 'completed'))) return { open: true, why: 'lifetime', until: null };
  if (st === 'active' || st === 'trialing') return { open: true, why: m.cancel_at_period_end ? 'canceling' : 'monthly', until: Number.isFinite(end) ? end : null };
  if (st === 'past_due' && Number.isFinite(end) && now < end + GRACE_DAYS * DAY) return { open: true, why: 'grace', until: end + GRACE_DAYS * DAY };
  return { open: false, why: st || 'none', until: null };
}

export async function access(email, admins = []) {
  email = String(email || '').toLowerCase();
  if (admins.includes(email)) return { open: true, why: 'admin', until: null };
  const mine = (await memberships()).filter((m) => emailOf(m) === email);
  const best = mine.map((m) => judge(m)).sort((a, b) => Number(b.open) - Number(a.open) || (b.why === 'lifetime') - (a.why === 'lifetime'))[0];
  return best || { open: false, why: 'none', until: null };
}

export function bust() { cache = { at: 0, list: null }; }
