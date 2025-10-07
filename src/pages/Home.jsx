// src/pages/Home.jsx
import * as React from 'react'
import Classic from '../templates/classic/Classic'
import { Box, Alert } from '@mui/material'
import Modern from '../templates/modern/Modern'
import { useHotel } from '../HotelContext'
import GoldenDunesLandingPage from '../templates/GoldenDunesResorts/Goldendunes'
import MiniownLandingPage from '../templates/MiniOwn/Miniown'
import { applyBranding } from '../utils/applyBranding'

const API_URL = import.meta.env.VITE_API_URL
const TENANT = import.meta.env.VITE_TENANT_DOMAIN || window.location.host

console.log(API_URL, 'api url')

const deriveTitleFromState = (hotel, cfg) =>
  hotel?.name ||
  hotel?.hotelName ||
  cfg?.propertyName ||
  cfg?.extra?.siteTitle ||
  cfg?.template_settings?.mailer?.brandName ||
  cfg?.templateSettings?.mailer?.brandName ||
  'Site'

export default function Home({ cfg }) {
  const key = (cfg.templateKey || 'classic').toLowerCase()

  const { hotel, setHotel } = useHotel()
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    let isMounted = true
    const ac = new AbortController()

    async function run() {
      try {
        setError(null)
        const resp = await fetch(`${API_URL}/tenants/webconstructor/hotel`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-tenant-domain': TENANT,
          },
          signal: ac.signal,
        })
        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}))
          throw new Error(data?.error || `HTTP ${resp.status}`)
        }
        const data = await resp.json()
        if (isMounted) setHotel(data)
      } catch (e) {
        if (isMounted && e.name !== 'AbortError') setError(e.message || 'Fetch error')
      }
    }

    run()
    return () => { isMounted = false; ac.abort() }
  }, [setHotel])

  React.useEffect(() => {
    const title = deriveTitleFromState(hotel, cfg)
    if (title) applyBranding({ title: "MiniOwn", faviconUrl: "/miniown.png" })
  }, [hotel, cfg])

  let content = <Box p={3}>Template not available: {key}</Box>
  if (key === 'classic') content = <Classic cfg={cfg} hotel={hotel} />
  else if (key === 'modern') content = <Modern cfg={cfg} hotel={hotel} />
  else if (key === 'goldendunes') content = <GoldenDunesLandingPage cfg={cfg} hotel={hotel} />
  else if (key === 'miniown') content = <MiniownLandingPage cfg={cfg} hotel={hotel} />

  return (
    <React.Fragment>
      {error && (
        <Box p={3}>
          <Alert severity="error" onClose={() => setError(null)}>
            Failed to refresh hotel details: {error}
          </Alert>
        </Box>
      )}
      {content}
    </React.Fragment>
  )
}
