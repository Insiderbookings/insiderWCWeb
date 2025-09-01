import * as React from "react"
import { Box, Stack, Typography, Grid, Chip } from "@mui/material"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import BookingForm from "../../../components/BookingForm"
import ClassicLayout, { getHeroSubtitle } from "../../classic/layout"

export default function ClassicBook({ cfg = {}, hotel = {} }) {
  return (
    <ClassicLayout cfg={cfg} hotel={hotel}>
      <Box id="home">
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} md={7}>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Bienvenido a {hotel?.hotelName || "nuestro hotel"}
            </Typography>
            <Typography sx={{ mt: 2, opacity: 0.9, lineHeight: 1.8 }}>
              {getHeroSubtitle(hotel)}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
              <Chip
                icon={<CheckCircleOutlineIcon />}
                label="Atención 24/7"
                variant="outlined"
                sx={{ borderColor: "rgba(255,255,255,.18)" }}
              />
              <Chip
                icon={<CheckCircleOutlineIcon />}
                label="Ubicación privilegiada"
                variant="outlined"
                sx={{ borderColor: "rgba(255,255,255,.18)" }}
              />
              <Chip
                icon={<CheckCircleOutlineIcon />}
                label="Mejor tarifa garantizada"
                variant="outlined"
                sx={{ borderColor: "rgba(255,255,255,.18)" }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box
              id="book"
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,.12)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02))",
                backdropFilter: "blur(6px)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                Reservá directo
              </Typography>
              <Typography sx={{ opacity: 0.85, mb: 2 }}>
                Leave your details and we will contact you to complete the booking.
              </Typography>
              <BookingForm cfg={cfg} hotel={hotel} />
            </Box>
          </Grid>
        </Grid>

      </Box>
    </ClassicLayout>
  )
}

