import * as React from 'react'
import { Container, Box, Typography, Grid, TextField, Button, Alert, MenuItem, Paper, Stack, CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { tgxBookWithCard, tgxCreatePaymentIntent, tgxConfirmAndBook } from '../../api/booking'

const todayISO = () => new Date().toISOString().slice(0, 10)
const addDaysISO = (d) => new Date(Date.now() + d*86400000).toISOString().slice(0, 10)

export default function ModernBook({ cfg = {} }) {
  const primary = cfg.primaryColor || '#0EA5E9'
  const surface = '#ffffff'
  const background = cfg.secondaryColor || '#F6F7FB'
  const font = cfg.fontFamily || 'Inter, system-ui, sans-serif'

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: { main: primary },
      background: { default: background, paper: surface },
      text: { primary: '#0F172A', secondary: '#475569' },
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: font,
      h2: { fontWeight: 900, letterSpacing: 0.2 },
      h4: { fontWeight: 800 },
      button: { textTransform: 'none', fontWeight: 800 },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            border: '1px solid rgba(2,6,23,0.06)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: { backgroundColor: surface, color: '#0F172A', boxShadow: 'none' },
        },
      },
    },
  })
  const [form, setForm] = React.useState({
    optionRefId: '',
    checkIn: todayISO(),
    checkOut: addDaysISO(2),
    tgxHotelCode: '',
    adults: 2,
    children: 0,
    currency: 'EUR',
    // guest
    fullName: '',
    email: '',
    phone: '',
    specialRequests: '',
    // card (test)
    type: 'VI',
    number: '4111111111111111',
    cvc: '123',
    expMonth: 9,
    expYear: new Date().getFullYear() + 3,
  })
  const [paymentMode, setPaymentMode] = React.useState('stripe') // 'stripe' | 'direct'
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [result, setResult] = React.useState(null)
  
  // Prefill from query params if present
  React.useEffect(() => {
    try {
      const usp = new URLSearchParams(window.location.search)
      const optionRefId = usp.get('optionRefId') || usp.get('rateKey') || ''
      const ci = usp.get('ci') || usp.get('checkIn')
      const co = usp.get('co') || usp.get('checkOut')
      const hotel = usp.get('hotel') || ''
      setForm((s) => ({
        ...s,
        optionRefId: optionRefId || s.optionRefId,
        tgxHotelCode: hotel || s.tgxHotelCode,
        checkIn: ci || s.checkIn,
        checkOut: co || s.checkOut,
      }))
    } catch {}
  }, [])

  // Stripe.js setup (no react wrapper)
  const stripeRef = React.useRef(null)
  const cardRef = React.useRef(null)
  const elementsRef = React.useRef(null)
  const STRIPE_PK = import.meta.env.VITE_STRIPE_PK || ''

  React.useEffect(() => {
    if (paymentMode !== 'stripe') return
    if (!STRIPE_PK) return
    let cancelled = false
    ;(async () => {
      // load Stripe.js if not present
      if (!window.Stripe) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://js.stripe.com/v3'
          s.async = true
          s.onload = resolve
          s.onerror = () => reject(new Error('Stripe.js failed to load'))
          document.head.appendChild(s)
        })
      }
      if (cancelled) return
      if (!stripeRef.current) {
        stripeRef.current = window.Stripe(STRIPE_PK)
        elementsRef.current = stripeRef.current.elements()
      }
      if (cardRef.current) return
      const card = elementsRef.current.create('card', { hidePostalCode: true })
      card.mount('#card-element')
      cardRef.current = card
    })().catch((e) => {
      console.error(e)
    })
    return () => { cancelled = true }
  }, [paymentMode, STRIPE_PK])

  const onChange = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    setError(''); setResult(null); setLoading(true)
    try {
      if (!form.optionRefId) throw new Error('optionRefId is required')
      if (!form.fullName || !form.email) throw new Error('Full name and email are required')

      if (paymentMode === 'stripe') {
        if (!STRIPE_PK) throw new Error('Set VITE_STRIPE_PK in your environment')
        const createOut = await tgxCreatePaymentIntent({
          // amount omitido: el backend lo calcula y valida
          currency: form.currency,
          guestInfo: {
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            specialRequests: form.specialRequests,
          },
          bookingData: {
            checkIn: form.checkIn,
            checkOut: form.checkOut,
            tgxHotelCode: String(form.tgxHotelCode || '').trim(),
            adults: Number(form.adults || 1),
            children: Number(form.children || 0),
            roomId: null,
          },
          searchOptionRefId: String(form.optionRefId || '').trim(),
          source: 'TGX',
        }, { vaultExtra: { vaultKey: 'demo', pageUrl: window.location.href } })

        const stripe = stripeRef.current
        const card = cardRef.current
        if (!stripe || !card) throw new Error('Stripe not initialized')
        const { clientSecret, paymentIntentId, bookingRef } = createOut
        const confirm = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card,
            billing_details: { name: form.fullName, email: form.email },
          },
        })
        if (confirm.error) throw new Error(confirm.error.message || 'Stripe payment failed')
        if (confirm.paymentIntent && ['succeeded', 'requires_capture'].includes(confirm.paymentIntent.status)) {
          const out2 = await tgxConfirmAndBook({ paymentIntentId, bookingRef })
          setResult(out2)
        } else {
          throw new Error(`Unexpected payment status: ${confirm.paymentIntent?.status}`)
        }
      } else {
        // Direct card to backend (legacy)
        const out = await tgxBookWithCard({
          optionRefId: String(form.optionRefId || '').trim(),
          guestInfo: {
            fullName: String(form.fullName || '').trim(),
            email: String(form.email || '').trim(),
            phone: String(form.phone || '').trim(),
            specialRequests: String(form.specialRequests || ''),
          },
          bookingData: {
            checkIn: form.checkIn,
            checkOut: form.checkOut,
            tgxHotelCode: String(form.tgxHotelCode || '').trim(),
            adults: Number(form.adults || 1),
            children: Number(form.children || 0),
            paymentType: 'CARD_BOOKING',
          },
          paymentCard: {
            type: form.type,
            number: String(form.number || ''),
            CVC: String(form.cvc || ''),
            expire: { month: Number(form.expMonth), year: Number(form.expYear) },
            holder: { name: form.fullName.split(' ')[0] || 'Guest', surname: form.fullName.split(' ').slice(1).join(' ') || 'Guest' }
          },
          currency: form.currency,
          source: 'TGX',
        }, { vaultExtra: { vaultKey: 'demo', pageUrl: window.location.href } })
        setResult(out)
      }
    } catch (e) {
      setError(e?.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md">
      <Box py={4}>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          Book (Demo) – TGX book-with-card
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Quick test of the direct TGX flow. Use a test card (e.g., 4111 1111 1111 1111).
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper variant="outlined" sx={{ p: 3 }} component="form" onSubmit={onSubmit}>
          <Stack spacing={3}>
            <Typography variant="subtitle1" fontWeight={700}>Modo de pago</Typography>
            <Stack direction="row" spacing={2}>
              <Button variant={paymentMode==='stripe'?'contained':'outlined'} onClick={() => setPaymentMode('stripe')}>Stripe (recomendado)</Button>
              <Button variant={paymentMode==='direct'?'contained':'outlined'} onClick={() => setPaymentMode('direct')}>Directo (legacy)</Button>
            </Stack>
            <Typography variant="subtitle1" fontWeight={700}>Datos de la opción</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="optionRefId" value={form.optionRefId} onChange={onChange('optionRefId')} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField type="date" label="Check-in" InputLabelProps={{ shrink: true }} value={form.checkIn} onChange={onChange('checkIn')} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField type="date" label="Check-out" InputLabelProps={{ shrink: true }} value={form.checkOut} onChange={onChange('checkOut')} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="TGX Hotel Code" value={form.tgxHotelCode} onChange={onChange('tgxHotelCode')} fullWidth />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField type="number" label="Adults" value={form.adults} onChange={onChange('adults')} fullWidth />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField type="number" label="Children" value={form.children} onChange={onChange('children')} fullWidth />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" fontWeight={700}>Huésped</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Full name" value={form.fullName} onChange={onChange('fullName')} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField type="email" label="Email" value={form.email} onChange={onChange('email')} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Phone" value={form.phone} onChange={onChange('phone')} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Special requests" value={form.specialRequests} onChange={onChange('specialRequests')} fullWidth multiline minRows={2} />
              </Grid>
            </Grid>

            {paymentMode === 'stripe' ? (
              <Box>
                {!STRIPE_PK && (
                  <Alert severity="warning" sx={{ mb: 2 }}>Set VITE_STRIPE_PK to use Stripe</Alert>
                )}
                <Box id="card-element" sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }} />
              </Box>
            ) : (
              <>
                <Typography variant="subtitle1" fontWeight={700}>Card (test)</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField select label="Type" value={form.type} onChange={onChange('type')} fullWidth>
                      <MenuItem value="VI">Visa (VI)</MenuItem>
                      <MenuItem value="MC">Mastercard (MC)</MenuItem>
                      <MenuItem value="AX">Amex (AX)</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField label="Number" value={form.number} onChange={onChange('number')} fullWidth />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField label="CVC" value={form.cvc} onChange={onChange('cvc')} fullWidth />
                  </Grid>
                  <Grid item xs={3} sm={1}>
                    <TextField type="number" label="MM" value={form.expMonth} onChange={onChange('expMonth')} fullWidth />
                  </Grid>
                  <Grid item xs={3} sm={1}>
                    <TextField type="number" label="YYYY" value={form.expYear} onChange={onChange('expYear')} fullWidth />
                  </Grid>
                </Grid>
              </>
            )}

            <Box>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Processing…' : 'Confirm and book'}
              </Button>
            </Box>

            {result && (
              <Box>
                <Alert severity="success" sx={{ mb: 2 }}>Booking realizada</Alert>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{JSON.stringify(result, null, 2)}</pre>
                </Paper>
              </Box>
            )}
          </Stack>
        </Paper>
      </Box>
        </Container>
      </ThemeProvider>
    )
  }
