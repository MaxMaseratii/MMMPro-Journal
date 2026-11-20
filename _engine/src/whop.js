// Whop control for the admin page: products, prices, promo codes and payments, live from the Whop API.
// Needs WHOP_API_KEY (an account API key from whop.com/dashboard/developer) in the engine's environment.
const BASE = process.env.WHOP_API_BASE || 'https://api.whop.com/api/v1';
const ACCOUNT = process.env.WHOP_ACCOUNT_ID || 'biz_OTKPglmes94RKy';
const DAY = 864e5;

export const whopReady = () => Boolean(process.env.WHOP_API_KEY);
export const whopAccount = () => ACCOUNT;

async function call(path, { method = 'GET', query, body } = {}) {
  if (!whopReady()) throw new Error('Whop is not connected yet: add WHOP_API_KEY on the engine (Render → Environment).');
  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(query || {})) {
    if (v == null || v === '') continue;
    if (Array.isArray(v)) v.forEach((x) => url.searchParams.append(k, x));
    else url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${process.env.WHOP_API_KEY}`, Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(20000),
  });
  const text = await res.text();
  let json = {};
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text.slice(0, 200) }; }
  if (!res.ok) {
    const msg = json?.error?.message || json?.message || json?.error || `Whop answered ${res.status}`;
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
  return json;
}

const money = (m) => (m && m.amount != null ? Number(m.amount) : 0);

function slimPayment(p) {
  const li = (p.line_items || [])[0] || {};
  return {
    id: p.id,
    status: p.status,
    substatus: p.substatus,
    reason: p.billing_reason,
    created_at: p.created_at,
    paid_at: p.paid_at,
    usd: money(p.usd_total),
    refunded: money(p.refunded_amount),
    product: li.product_title || li.label || '',
    product_id: p.product_id,
    customer: p.user?.name || p.user?.username || '',
    username: p.user?.username || '',
    email: p.customer_email || '',
    method: p.payment_instrument?.display_name || p.payment_method_type || '',
    failure: p.failure_message || null,
    failed_tries: p.payments_failed || 0,
    next_retry: p.next_payment_attempt_at || null,
  };
}

function slimProduct(p) {
  const v = p.default_variant || null;
  return {
    id: p.id,
    title: p.title,
    headline: p.headline || '',
    description: p.description || '',
    visibility: p.visibility,
    route: p.route,
    members: p.member_count || 0,
    reviews: p.published_reviews_count || 0,
    rating: p.average_review_rating || 0,
    updated_at: p.updated_at,
    price: v
      ? {
          billing: v.billing_type,
          period_days: v.billing_period,
          initial: money(v.initial_price),
          renewal: money(v.renewal_price),
          currency: (v.renewal_price || v.initial_price || {}).currency || 'usd',
          trial_days: v.trial_period_days || null,
        }
      : null,
  };
}

function slimPromo(c) {
  return {
    id: c.id,
    code: c.code,
    type: c.promo_type,
    amount_off: c.amount_off,
    currency: c.currency,
    duration: c.duration,
    months: c.promo_duration_months,
    uses: c.uses,
    stock: c.unlimited_stock ? null : c.stock,
    status: c.status,
    new_users_only: c.new_users_only,
    one_per_customer: c.one_per_customer,
    product: c.product ? c.product.title || c.product.id : null,
    expires_at: c.expires_at,
    created_at: c.created_at,
  };
}

async function allPages(path, query, maxPages = 5) {
  const out = [];
  let after;
  for (let i = 0; i < maxPages; i++) {
    const j = await call(path, { query: { ...query, after } });
    out.push(...(j.data || []));
    if (!j.page_info?.has_next_page || !j.page_info?.end_cursor) break;
    after = j.page_info.end_cursor;
  }
  return out;
}

let cache = { at: 0, data: null, job: null };

export function bust() { cache = { at: 0, data: null, job: null }; }

export async function overview(force = false) {
  if (!force && cache.data && Date.now() - cache.at < 60000) return cache.data;
  if (cache.job) return cache.job;
  cache.job = (async () => {
    const since = new Date(Date.now() - 30 * DAY).toISOString();
    const [products, payments, promos] = await Promise.all([
      allPages('/products', { account_id: ACCOUNT, first: 100 }, 2),
      allPages('/payments', { account_id: ACCOUNT, first: 100, created_after: since }, 5),
      allPages('/promo_codes', { account_id: ACCOUNT, first: 100 }, 2),
    ]);
    const pay = payments.map(slimPayment);
    const paid = pay.filter((p) => p.status === 'paid');
    const atRisk = pay.filter((p) => p.status === 'open' && /past_due|failed|uncollectible/.test(p.substatus || ''));
    const rank = { visible: 0, hidden: 1, archived: 2 };
    const prods = products.map(slimProduct).sort((a, b) => (rank[a.visibility] ?? 3) - (rank[b.visibility] ?? 3) || b.members - a.members);
    const data = {
      account: ACCOUNT,
      fetched_at: new Date().toISOString(),
      kpis: {
        revenue_30d: Math.round(paid.reduce((s, p) => s + p.usd - p.refunded, 0) * 100) / 100,
        paid_30d: paid.filter((p) => p.usd > 0).length,
        free_joins_30d: paid.filter((p) => p.usd === 0).length,
        at_risk_count: atRisk.length,
        at_risk_usd: Math.round(atRisk.reduce((s, p) => s + p.usd, 0) * 100) / 100,
        refunds_30d: pay.filter((p) => p.refunded > 0).length,
        visible_products: prods.filter((p) => p.visibility === 'visible').length,
        members: prods.reduce((s, p) => s + p.members, 0),
        active_promos: promos.filter((c) => c.status === 'active').length,
      },
      products: prods,
      at_risk: atRisk,
      payments: pay.slice(0, 40),
      promos: promos.map(slimPromo),
    };
    cache = { at: Date.now(), data, job: null };
    return data;
  })().catch((e) => {
    cache.job = null;
    throw e;
  });
  return cache.job;
}

const VIS = ['visible', 'hidden', 'archived'];

export async function updateProduct(id, fields = {}) {
  if (!/^prod_[A-Za-z0-9]+$/.test(String(id))) throw new Error('Bad product id');
  const body = {};
  if (fields.title != null) {
    const t = String(fields.title).trim();
    if (!t || t.length > 80) throw new Error('Title must be 1 to 80 characters');
    body.title = t;
  }
  if (fields.headline !== undefined) {
    const h = fields.headline == null ? null : String(fields.headline).trim();
    if (h && h.length > 80) throw new Error('Headline must be 80 characters or less');
    body.headline = h || null;
  }
  if (fields.description !== undefined) {
    const d = fields.description == null ? null : String(fields.description);
    if (d && d.length > 1500) throw new Error('Description must be 1,500 characters or less');
    body.description = d || null;
  }
  if (fields.visibility != null) {
    if (!VIS.includes(fields.visibility)) throw new Error('Visibility must be visible, hidden or archived');
    body.visibility = fields.visibility;
  }
  if (!Object.keys(body).length) throw new Error('Nothing to change');
  const j = await call(`/products/${id}`, { method: 'PATCH', body });
  bust();
  return slimProduct(j);
}

export async function createPromo(f = {}) {
  const code = String(f.code || '').trim();
  if (!/^[A-Za-z0-9_-]{3,40}$/.test(code)) throw new Error('Code: 3 to 40 letters, numbers, - or _');
  const type = f.type === 'flat_amount' ? 'flat_amount' : 'percentage';
  const amt = Number(f.amount);
  if (!(amt > 0)) throw new Error('Discount must be more than 0');
  if (type === 'percentage' && amt > 100) throw new Error('Percent discount must be 100 or less');
  const months = Math.max(1, Math.min(36, parseInt(f.months, 10) || 1));
  const body = {
    account_id: ACCOUNT,
    code,
    promo_type: type,
    amount_off: type === 'percentage' ? amt / 100 : amt, // Whop stores percent as a fraction
    base_currency: 'usd',
    new_users_only: Boolean(f.new_users_only),
    one_per_customer: f.one_per_customer !== false,
    promo_duration_months: months,
    unlimited_stock: !(Number(f.stock) > 0),
    ...(Number(f.stock) > 0 ? { stock: parseInt(f.stock, 10) } : {}),
    ...(f.product_id && /^prod_/.test(f.product_id) ? { product_id: f.product_id } : {}),
    ...(f.expires_at ? { expires_at: new Date(f.expires_at).toISOString() } : {}),
  };
  const j = await call('/promo_codes', { method: 'POST', body });
  bust();
  return slimPromo(j);
}

export async function setPromo(id, on) {
  if (!/^promo_[A-Za-z0-9]+$/.test(String(id))) throw new Error('Bad promo code id');
  const j = await call(`/promo_codes/${id}/${on ? 'activate' : 'deactivate'}`, { method: 'POST' });
  bust();
  return slimPromo(j);
}
