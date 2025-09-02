import * as React from 'react'
import { Box, Container, Typography, Grid, TextField, Button, CircularProgress, Alert, MenuItem, Paper, Stack, Chip } from '@mui/material'
import AvailabilityBase from '../../components/AvailabilityBase'

export default function Availability({ hotel }) {
  return (
    <AvailabilityBase>
      {({ form, onChange, runSearch, loading, error, options, priceLabel, goBook }) => (
        <Box sx={{ bgcolor: 'background.default' }}>
          <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
            <Typography variant="h5" fontWeight={900} gutterBottom>
              Availability & Booking
            </Typography>

            <Paper variant="outlined" component="form" onSubmit={runSearch} sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField type="date" label="Check-in" InputLabelProps={{ shrink: true }} value={form.checkIn} onChange={onChange('checkIn')} fullWidth />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField type="date" label="Check-out" InputLabelProps={{ shrink: true }} value={form.checkOut} onChange={onChange('checkOut')} fullWidth />
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField type="number" label="Adults" value={form.adults} onChange={onChange('adults')} fullWidth />
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField type="number" label="Children" value={form.children} onChange={onChange('children')} fullWidth />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField select label="Currency" value={form.currency} onChange={onChange('currency')} fullWidth>
                    {['EUR','USD','GBP'].map(c => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained">Search</Button>
                </Grid>
              </Grid>
            </Paper>

            {loading && (
              <Box display="flex" gap={2} alignItems="center"><CircularProgress size={20}/> Searching…</Box>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}

            <Grid container spacing={2}>
              {options.map((opt) => (
                <Grid item xs={12} md={6} key={opt.rateKey}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography fontWeight={700}>{opt.hotelName || hotel?.hotelName || 'Hotel'}</Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                          {opt.board && <Chip size="small" label={opt.board} />}
                          {opt.refundable != null && <Chip size="small" color={opt.refundable ? 'success' : 'default'} label={opt.refundable ? 'Refundable' : 'Non-refundable'} />}
                        </Stack>
                      </Box>
                      <Typography variant="h6" fontWeight={900}>{priceLabel(opt)}</Typography>
                    </Stack>

                    {Array.isArray(opt.rooms) && opt.rooms.length > 0 && (
                      <Box sx={{ mt: 1, color: 'text.secondary', fontSize: 14 }}>
                        {opt.rooms.slice(0, 2).map((r, idx) => (
                          <div key={idx}>{r.description || r.code} — {(r.priceUser ?? r.price) ? `${(opt.currency||'EUR')} ${(Number(r.priceUser ?? r.price)).toFixed(2)}` : '—'}</div>
                        ))}
                        {opt.rooms.length > 2 && <div>+{opt.rooms.length - 2} more…</div>}
                      </Box>
                    )}

                    <Box sx={{ mt: 2 }}>
                      <Button variant="contained" onClick={() => goBook(opt)}>Book</Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
              {!loading && !error && options.length === 0 && (
                <Grid item xs={12}><Typography color="text.secondary">No options found for selected dates.</Typography></Grid>
              )}
            </Grid>
          </Container>
        </Box>
      )}
    </AvailabilityBase>
  )
}

