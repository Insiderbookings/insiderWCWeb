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
