// src/templates/classic/Book.jsx
import * as React from "react"
import { Box, Stack, Typography, Chip, Paper, Grid } from "@mui/material"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import BookingForm from "../../components/BookingForm"
import ClassicLayout, { getHeroSubtitle } from "./layout"

export default function ClassicBook({ cfg = {}, hotel = {} }) {
  return (
    <ClassicLayout cfg={cfg} hotel={hotel}>
      <Box id="book" sx={{ mt: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Stack spacing={2.5}>
              <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: .6 }}>
                Bienvenido a {hotel?.hotelName || 'nuestro hotel'}
              </Typography>
              <Typography sx={{ opacity: 0.9, lineHeight: 1.8 }}>
                {getHeroSubtitle(hotel)}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                <Chip icon={<CheckCircleOutlineIcon />} label="Atención 24/7" variant="outlined" sx={{ borderColor: 'rgba(212,175,55,.35)' }} />
                <Chip icon={<CheckCircleOutlineIcon />} label="Ubicación privilegiada" variant="outlined" sx={{ borderColor: 'rgba(212,175,55,.35)' }} />
                <Chip icon={<CheckCircleOutlineIcon />} label="Mejor tarifa garantizada" variant="outlined" sx={{ borderColor: 'rgba(212,175,55,.35)' }} />
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper variant="outlined" sx={{
              p: { xs: 2, sm: 3 }, borderRadius: 3,
              borderColor: 'rgba(212,175,55,.35)',
              background: 'linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.03))',
              backdropFilter: 'blur(6px)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 1.5 }}>Reserva directa</Typography>
              <BookingForm compact cfg={cfg} hotel={hotel} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ClassicLayout>
  )
}
