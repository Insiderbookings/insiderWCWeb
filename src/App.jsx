import * as React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createTheme, ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material'
import { apiGetPublicConfig } from './api/client'
import { applyBranding } from './utils/applyBranding'
import Routes from './routes'
import { HotelProvider } from './HotelContext'

const CONFIG_CACHE_KEY = 'wc.siteConfig'

const buildThemeFromConfig = (data) =>
  createTheme({
    palette: { mode: 'light', primary: { main: data?.primaryColor || '#2563eb' } },
    typography: { fontFamily: `var(--wc-font, ${data?.fontFamily || 'Inter, system-ui, sans-serif'})` },
    shape: { borderRadius: 14 },
  })

const readCachedConfig = () => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CONFIG_CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (err) {
    console.warn('Failed to parse cached site config', err)
    return null
  }
}

const deriveTitleFromConfig = (cfg) =>
  cfg?.extra?.siteTitle ||
  cfg?.template_settings?.siteTitle ||
  cfg?.templateSettings?.siteTitle ||
  cfg?.template_settings?.mailer?.brandName ||
  cfg?.templateSettings?.mailer?.brandName ||
  cfg?.propertyName ||
  cfg?.name ||
  'Site'

export default function App() {
  const initialCfgRef = React.useRef(readCachedConfig())
  const [cfg, setCfg] = React.useState(initialCfgRef.current)
  const [error, setError] = React.useState('')

  const theme = React.useMemo(() => (cfg ? buildThemeFromConfig(cfg) : null), [cfg])

  React.useEffect(() => {
    if (!cfg) return
    applyBranding({
      fontFamily: cfg.fontFamily,
      faviconUrl: cfg.faviconUrl,
      title: deriveTitleFromConfig(cfg),
    })
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(cfg))
      } catch (err) {
        console.warn('Failed to cache site config', err)
      }
    }
  }, [cfg])

  React.useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await apiGetPublicConfig()
        if (!alive) return
        setCfg((prev) => {
          const prevSerialized = prev ? JSON.stringify(prev) : null
          const nextSerialized = JSON.stringify(data)
          if (prevSerialized === nextSerialized) return prev
          return data
        })
        setError('')
      } catch (e) {
        if (alive) setError(String(e.message || 'Could not load configuration'))
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  if (!theme || !cfg) {
    if (error) {
      return (
        <Box p={3} color="error.main">
          {error}
        </Box>
      )
    }
    return (
      <Box height="100vh" display="grid" sx={{ placeItems: "center" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <HotelProvider>
          <Routes cfg={cfg} />
        </HotelProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
