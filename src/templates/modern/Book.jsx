// src/templates/book/modern/Book.jsx
import * as React from "react"
import { Box, Typography, Paper, Grid, LinearProgress } from "@mui/material"
import BookingForm from "../../components/BookingForm"
import ModernLayout from "./Layout"
import { getHeroSubtitle } from "./Layout"

export default function ModernBook({ cfg = {}, hotel = {} }) {
  return (
    <ModernLayout cfg={cfg} hotel={hotel}>
      {/* Sólo contenido (el hero vive en el layout) */}
      <Box id="book" sx={{ mt: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
                Book your stay {hotel?.hotelName ? `at ${hotel.hotelName}` : ''}
              </Typography>
              <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                {getHeroSubtitle(hotel)}
              </Typography>
              <BookingForm cfg={cfg} hotel={hotel} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper variant="outlined" sx={{ p: 2.2, borderRadius: 4 }}>
              <Typography sx={{ fontWeight: 800, mb: 1 }}>Booking summary</Typography>
              <Typography variant="body2" color="text.secondary">
                We’ll confirm availability and send a payment link to your email.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">Progress</Typography>
                <LinearProgress variant="determinate" value={40} sx={{ mt: .5 }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ModernLayout>
  )
}
