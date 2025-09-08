// src/templates/modern/Availability.jsx
import * as React from "react"
import {
  Box, Typography, Grid, TextField, Button, CircularProgress, Alert,
  MenuItem, Paper, Stack, Chip, Divider
} from "@mui/material"
import { alpha } from "@mui/material/styles"
import AvailabilityBase from "../../components/AvailabilityBase"

export default function Availability({ hotel }) {
  const defaultImg =
    hotel?.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1400&auto=format&fit=crop"

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
        <Box id="availability">
          <Paper
            variant="outlined"
            component="form"
            onSubmit={runSearch}
            sx={{
              p: 2, mb: 3, borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(14,165,233,.06), rgba(14,165,233,.02))',
              backdropFilter: 'blur(6px)'
            }}
          >
            <Grid container spacing={1.5} alignItems="center">
              <Grid item xs={12} md={2.4}><TextField type="date" label="Check-in" InputLabelProps={{ shrink: true }} value={form.checkIn} onChange={onChange('checkIn')} fullWidth /></Grid>
              <Grid item xs={12} md={2.4}><TextField type="date" label="Check-out" InputLabelProps={{ shrink: true }} value={form.checkOut} onChange={onChange('checkOut')} fullWidth /></Grid>
              <Grid item xs={6} md={1.6}><TextField type="number" label="Adults" value={form.adults} onChange={onChange('adults')} fullWidth inputProps={{ min: 1 }} /></Grid>
              <Grid item xs={6} md={1.6}><TextField type="number" label="Children" value={form.children} onChange={onChange('children')} fullWidth inputProps={{ min: 0 }} /></Grid>
              <Grid item xs={12} md={2.4}>
                <TextField select label="Currency" value={form.currency} onChange={onChange('currency')} fullWidth>
                  {['EUR','USD','GBP'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} md={1.6}>
                <Button fullWidth type="submit" variant="contained">Search</Button>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip size="small" label="Seasonal" variant="outlined" />
                  <Chip size="small" label="Breakfast" variant="outlined" />
                  <Chip size="small" label="Late checkout" variant="outlined" />
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {loading && (
            <Box display="flex" gap={2} alignItems="center" sx={{ mb: 2 }}>
              <CircularProgress size={20} /> Searching…
            </Box>
          )}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Grid container spacing={3}>
            {options.map((opt) => {
              const img = pickImage(opt)
              const title = titleFromOpt(opt)
              return (
                <Grid item xs={12} sm={6} md={4} key={opt.rateKey}>
                  <Paper
                    variant="outlined"
                    sx={{
                      borderRadius: 4,
                      overflow: 'hidden',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 16px 40px rgba(2,6,23,.06)'
                    }}
                  >
                    <Box sx={{ position: 'relative', pt: '66%', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    <Box sx={{ p: 2.2, flex: 1 }}>
                      <Typography sx={{ fontWeight: 900 }}>{title}</Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1.25, flexWrap: 'wrap' }}>
                        {opt.board && <Chip size="small" label={opt.board} variant="outlined" />}
                        {opt.refundable != null && (
                          <Chip size="small" variant="outlined" color={opt.refundable ? 'success' : 'default'} label={opt.refundable ? 'Refundable' : 'Non-refundable'} />
                        )}
                      </Stack>
                      {Array.isArray(opt.rooms) && opt.rooms.length > 0 && (
                        <Box sx={{ mt: 1, color: 'text.secondary', fontSize: 14 }}>
                          {opt.rooms.slice(0, 2).map((r, idx) => (
                            <div key={idx}>
                              {r.description || r.code} — {r.priceUser ?? r.price ? `${opt.currency || 'EUR'} ${Number(r.priceUser ?? r.price).toFixed(2)}` : '—'}
                            </div>
                          ))}
                          {opt.rooms.length > 2 && <div>+{opt.rooms.length - 2} more…</div>}
                        </Box>
                      )}
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
                        <Typography sx={{ fontWeight: 900, fontSize: 20 }}>{priceLabel(opt)}</Typography>
                        <Stack direction="row" spacing={1}>
                          <Button variant="text" onClick={() => goBook(opt)}>Details</Button>
                          <Button variant="contained" onClick={() => goBook(opt)}>Book</Button>
                        </Stack>
                      </Stack>
                    </Box>
                  </Paper>
                </Grid>
              )
            })}
            {!loading && !error && options.length === 0 && (
              <Grid item xs={12}><Typography color="text.secondary">No options found for selected dates.</Typography></Grid>
            )}
          </Grid>
        </Box>
      )}
    </AvailabilityBase>
  )
}
