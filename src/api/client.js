const API_URL = import.meta.env.VITE_API_URL
const TENANT = import.meta.env.VITE_TENANT_DOMAIN || window.location.host

export async function apiGetPublicConfig() {
  const res = await fetch(`${API_URL}/tenants/webconstructor/site/config`, {
    headers: { 'X-Tenant-Domain': TENANT }
  })
  const ok = res.ok
  const ct = res.headers.get('content-type') || ''
  const body = ct.includes('application/json') ? await res.json() : await res.text()
  if (!ok) throw new Error(body?.error || body || `HTTP ${res.status}`)
  return body
}

export async function apiSearchAvailability({ checkIn, checkOut, adults = 2, children = 0, currency = 'EUR', language = 'en' } = {}) {
  const url = new URL(`${API_URL}/tenants/webconstructor/search`)
  if (checkIn) url.searchParams.set('checkIn', checkIn)
  if (checkOut) url.searchParams.set('checkOut', checkOut)
  url.searchParams.set('adults', String(adults))
  url.searchParams.set('children', String(children))
  url.searchParams.set('currency', String(currency))
  url.searchParams.set('language', String(language))
  const res = await fetch(url.toString(), { headers: { 'X-Tenant-Domain': TENANT } })
  const ok = res.ok
  const ct = res.headers.get('content-type') || ''
  const body = ct.includes('application/json') ? await res.json() : await res.text()
  if (!ok) throw new Error(body?.error || body || `HTTP ${res.status}`)
  return body
}
