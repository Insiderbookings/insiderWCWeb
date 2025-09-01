// src/pages/Home.jsx
import * as React from 'react'
import Classic from '../templates/Classic'
import { Box, CircularProgress, Alert } from '@mui/material'
import Modern from '../templates/Modern'

const API_URL = import.meta.env.VITE_API_URL
const TENANT = import.meta.env.VITE_TENANT_DOMAIN || window.location.host

console.log(API_URL, "api url")

export default function Home({ cfg }) {
  const key = (cfg.templateKey || 'classic').toLowerCase()

  const [hotel, setHotel] = React.useState(null)
  const [loading, setLoad] = React.useState(true)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    let isMounted = true
    const ac = new AbortController()

    async function run() {
      setLoad(true); setError(null)
      try {
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
      } finally {
        if (isMounted) setLoad(false)
      }
    }

    run()
    return () => { isMounted = false; ac.abort() }
  }, [])

  if (loading) {
    return (
      <Box p={3} display="flex" alignItems="center" gap={2}>
        <CircularProgress size={22} /> Loading hotel…
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">Failed to load hotel: {error}</Alert>
      </Box>
    )
  }

  if (key === 'classic') return <Classic cfg={cfg} hotel={hotel} />
  if (key === 'modern') return <Modern cfg={cfg} hotel={hotel} />
  return <Box p={3}>Template not available: {key}</Box>
}
