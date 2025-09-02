import test from 'node:test'
import assert from 'node:assert/strict'

// Setup environment expected by booking.js
process.env.VITE_API_URL = 'https://api.test'
process.env.VITE_TENANT_DOMAIN = 'tenant.test'
// window may be referenced when TENANT fallback is used
global.window = { location: { host: 'tenant.test' } }

// Mock fetch to capture request bodies
let lastFetch
global.fetch = async (url, opts) => {
  lastFetch = { url, opts }
  return {
    ok: true,
    headers: { get: () => 'application/json' },
    json: async () => ({})
  }
}

const { tgxCreatePaymentIntent, tgxBookWithCard } = await import('./booking.js')

test('tgxCreatePaymentIntent forwards optionRefId', async () => {
  const optionRefId = 'opt-123'
  await tgxCreatePaymentIntent({ optionRefId, bookingData: {} })
  const body = JSON.parse(lastFetch.opts.body)
  assert.equal(body.optionRefId, optionRefId)
})

test('tgxBookWithCard forwards optionRefId', async () => {
  const optionRefId = 'opt-456'
  await tgxBookWithCard({ optionRefId, bookingData: {} })
  const body = JSON.parse(lastFetch.opts.body)
  assert.equal(body.optionRefId, optionRefId)
})
