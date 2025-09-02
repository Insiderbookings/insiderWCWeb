// src/api/booking.js
// Allow running in non-Vite environments (e.g. Node tests)
const API_URL =
  (import.meta.env && import.meta.env.VITE_API_URL) ||
  (typeof process !== 'undefined' && process.env.VITE_API_URL) ||
  ''
const TENANT =
  (import.meta.env && import.meta.env.VITE_TENANT_DOMAIN) ||
  (typeof process !== 'undefined' && process.env.VITE_TENANT_DOMAIN) ||
  (typeof window !== 'undefined' ? window.location.host : '')

function buildHeaders(extra = {}) {
  return {
    'Content-Type': 'application/json',
    'X-Tenant-Domain': TENANT,
    ...extra,
  }
}

function withVaultMeta(bookingData = {}, vaultExtra = {}) {
  const meta0 = (bookingData.meta && typeof bookingData.meta === 'object') ? bookingData.meta : {}
  const vm0 = (meta0.vaultMeta && typeof meta0.vaultMeta === 'object') ? meta0.vaultMeta : {}
  const meta = {
    ...meta0,
    channel: meta0.channel || 'vaults',
    vaultMeta: {
      publicDomain: TENANT,
      ...vm0,
      ...vaultExtra,
    },
  }
  return { ...bookingData, meta }
}

export async function tgxQuote(body = {}) {
  const res = await fetch(`${API_URL}/tgx/quote`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  })
  const ok = res.ok
  const ct = res.headers.get('content-type') || ''
  const data = ct.includes('application/json') ? await res.json() : await res.text()
  if (!ok) throw new Error(data?.error || data || `HTTP ${res.status}`)
  return data
}

export async function tgxCreatePaymentIntent(payload = {}, { vaultExtra = {} } = {}) {
  const body = { ...payload, bookingData: withVaultMeta(payload.bookingData, vaultExtra) }
  const res = await fetch(`${API_URL}/tgx-payment/create-payment-intent`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  })
  const ok = res.ok
  const ct = res.headers.get('content-type') || ''
  const data = ct.includes('application/json') ? await res.json() : await res.text()
  if (!ok) throw new Error(data?.error || data || `HTTP ${res.status}`)
  return data
}

export async function tgxConfirmAndBook(payload = {}, { vaultExtra = {} } = {}) {
  const body = { ...payload, bookingData: withVaultMeta(payload.bookingData, vaultExtra) }
  const res = await fetch(`${API_URL}/tgx-payment/confirm-and-book`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  })
  const ok = res.ok
  const ct = res.headers.get('content-type') || ''
  const data = ct.includes('application/json') ? await res.json() : await res.text()
  if (!ok) throw new Error(data?.error || data || `HTTP ${res.status}`)
  return data
}

export async function tgxBookWithCard(payload = {}, { vaultExtra = {} } = {}) {
  const body = { ...payload, bookingData: withVaultMeta(payload.bookingData, vaultExtra) }
  const res = await fetch(`${API_URL}/tgx-payment/book-with-card`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  })
  const ok = res.ok
  const ct = res.headers.get('content-type') || ''
  const data = ct.includes('application/json') ? await res.json() : await res.text()
  if (!ok) throw new Error(data?.error || data || `HTTP ${res.status}`)
  return data
}

export { withVaultMeta }

