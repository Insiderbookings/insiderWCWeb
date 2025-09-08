// src/templates/Availability.jsx
import * as React from "react"
import {
  Box, Container, Typography, Grid, TextField, Button, CircularProgress,
  Alert, MenuItem, Paper, Stack, Chip, Divider,
} from "@mui/material"
import { alpha } from "@mui/material/styles"
import AvailabilityBase from "../../components/AvailabilityBase"

export default function Availability({ hotel }) {
  // Imagen por defecto para los cards (si la API no trae imágenes por opción)
  const defaultImg =
    hotel?.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop"

  const pickImage = (opt) =>
    opt?.images?.[0]?.url ||
    opt?.images?.[0] ||
    opt?.rooms?.[0]?.images?.[0]?.url ||
    opt?.rooms?.[0]?.image ||
    defaultImg

  const titleFromOpt = (opt) =>
    opt?.title ||
    opt?.roomName ||
    opt?.rooms?.[0]?.description ||
    opt?.rooms?.[0]?.code ||
    hotel?.hotelName ||
    "Accommodation"

  return (
    <AvailabilityBase>
      {({ form, onChange, runSearch, loading, error, options, priceLabel, goBook }) => (
        <Box id="availability" sx={{ bgcolor: "transparent" }}>
          <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
            <Grid container spacing={3}>
              {/* Sidebar lujosa */}
              <Grid item xs={12} md={4}>
                <Paper
                  variant="outlined"
                  component="form"
                  onSubmit={runSearch}
                  sx={{
                    p: 2,
                    position: 'sticky',
                    top: { xs: 0, md: 24 },
                    borderColor: 'rgba(212,175,55,.35)',
                    background: 'linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.03))',
                    boxShadow: '0 10px 30px rgba(0,0,0,.25) inset, 0 1px 0 rgba(255,255,255,.06) inset',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: .6, mb: 1 }}>Reserva tu estadía</Typography>
                  <Typography variant="body2" sx={{ opacity: .85, mb: 2 }}>Beneficios exclusivos reservando directo</Typography>
                  <Grid container spacing={1.5}>
                    <Grid item xs={12}>
                      <TextField type="date" label="Check-in" InputLabelProps={{ shrink: true }} value={form.checkIn} onChange={onChange('checkIn')} fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField type="date" label="Check-out" InputLabelProps={{ shrink: true }} value={form.checkOut} onChange={onChange('checkOut')} fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField type="number" label="Adults" value={form.adults} onChange={onChange('adults')} fullWidth inputProps={{ min: 1 }} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField type="number" label="Children" value={form.children} onChange={onChange('children')} fullWidth inputProps={{ min: 0 }} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField select label="Currency" value={form.currency} onChange={onChange('currency')} fullWidth>
                        {['EUR','USD','GBP'].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}><Divider sx={{ borderColor: 'rgba(255,255,255,.12)' }} /></Grid>
                    <Grid item xs={12}>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip size="small" label="Flexible rate" />
                        <Chip size="small" label="Breakfast" />
                        <Chip size="small" label="Late checkout" />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Button fullWidth type="submit" variant="contained" sx={{
                        bgcolor: '#d4af37', color: '#111', fontWeight: 900,
                        '&:hover': { bgcolor: '#d4af37' }
                      }}>Buscar</Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Resultados con cards con cinta de precio */}
              <Grid item xs={12} md={8}>
                <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mb: 2, gap: 2, flexWrap: 'wrap' }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: .5 }}>Disponibilidad</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,.7)' }}>Tarifa exclusiva en el sitio</Typography>
                </Stack>
                {loading && (
                  <Box display="flex" gap={2} alignItems="center" sx={{ mb: 2 }}>
                    <CircularProgress size={20} /> Buscando…
                  </Box>
                )}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Grid container spacing={3}>
                  {options.map((opt) => {
                    const img = pickImage(opt)
                    const title = titleFromOpt(opt)
                    return (
                      <Grid item xs={12} sm={6} key={opt.rateKey}>
                        <Box sx={{
                          position: 'relative',
                          borderRadius: 3,
                          overflow: 'hidden',
                          border: '1px solid rgba(212,175,55,.35)',
                          background: 'linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.04))'
                        }}>
                          <Box sx={{ position: 'relative', pt: '62%', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                          {/* Cinta de precio */}
                          <Box sx={{
                            position: 'absolute', top: 12, left: -40,
                            transform: 'rotate(-12deg)',
                            bgcolor: '#d4af37', color: '#111',
                            px: 4, py: .5, fontWeight: 900, letterSpacing: .6,
                            boxShadow: '0 8px 18px rgba(0,0,0,.35)'
                          }}>
                            {priceLabel(opt)}
                          </Box>
                          <Box sx={{ p: 2.2 }}>
                            <Typography sx={{ fontWeight: 900, letterSpacing: .3 }}>{title}</Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 1.25, flexWrap: 'wrap' }}>
                              {opt.board && <Chip size="small" label={opt.board} />}
                              {opt.refundable != null && (
                                <Chip size="small" color={opt.refundable ? 'success' : 'default'} label={opt.refundable ? 'Refundable' : 'Non-refundable'} />
                              )}
                            </Stack>
                            {Array.isArray(opt.rooms) && opt.rooms.length > 0 && (
                              <Box sx={{ mt: 1, color: 'rgba(255,255,255,.8)', fontSize: 14 }}>
                                {opt.rooms.slice(0, 2).map((r, idx) => (
                                  <div key={idx}>
                                    {r.description || r.code} — {r.priceUser ?? r.price ? `${opt.currency || 'EUR'} ${Number(r.priceUser ?? r.price).toFixed(2)}` : '—'}
                                  </div>
                                ))}
                                {opt.rooms.length > 2 && <div>+{opt.rooms.length - 2} más…</div>}
                              </Box>
                            )}
                            <Stack direction="row" spacing={1.2} sx={{ mt: 2 }}>
                              <Button variant="outlined" sx={{ borderColor: alpha('#fff', .25) }} onClick={() => goBook(opt)}>Detalles</Button>
                              <Button variant="contained" sx={{ bgcolor: '#d4af37', color: '#111', fontWeight: 900, '&:hover': { bgcolor: '#d4af37' } }} onClick={() => goBook(opt)}>Reservar</Button>
                            </Stack>
                          </Box>
                        </Box>
                      </Grid>
                    )
                  })}
                  {!loading && !error && options.length === 0 && (
                    <Grid item xs={12}><Typography color="text.secondary">No se encontraron opciones.</Typography></Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}
    </AvailabilityBase>
  )
}
