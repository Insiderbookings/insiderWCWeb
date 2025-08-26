import * as React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createTheme, ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material'
import { apiGetPublicConfig } from './api/client'
import { applyBranding } from './utils/applyBranding'
import Routes from './routes'

export default function App() {
  const [cfg, setCfg] = React.useState(null)
  const [theme, setTheme] = React.useState(null)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await apiGetPublicConfig()
        if (!alive) return
        setCfg(data)
        applyBranding({
          fontFamily: data.fontFamily,
          faviconUrl: data.faviconUrl,
          title: data?.extra?.siteTitle || 'Sitio'
        })
        const th = createTheme({
          palette: { mode: 'light', primary: { main: data.primaryColor || '#2563eb' } },
          typography: { fontFamily: `var(--wc-font, ${data.fontFamily || 'Inter, system-ui, sans-serif'})` },
          shape: { borderRadius: 14 }
        })
        setTheme(th)
      } catch (e) {
        setError(String(e.message || 'No se pudo cargar la configuración'))
      }
    })()
    return () => { alive = false }
  }, [])

  if (!theme || !cfg) {
    if (error) {
      return <Box p={3} color="error.main">{error}</Box>
    }
    return <Box height="100vh" display="grid" placeItems="center"><CircularProgress /></Box>
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes cfg={cfg} />
      </BrowserRouter>
    </ThemeProvider>
  )
}
