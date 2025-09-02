// src/templates/classic/Book.jsx
import * as React from "react"
import { Box, Stack, Typography, Chip } from "@mui/material"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import BookingForm from "../../../components/BookingForm"
import ClassicLayout, { getHeroSubtitle } from "../../classic/layout"

export default function ClassicBook({ cfg = {}, hotel = {} }) {
  const primary = cfg.primaryColor || "#d4af37"

  return (
    <ClassicLayout cfg={cfg} hotel={hotel}>
      <Box id="home">
        {/* Apilado vertical: encabezado arriba, formulario abajo */}
        <Stack spacing={{ xs: 3, md: 4 }}>
          {/* Encabezado / Hero copy */}
          <Box>
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
          </Box>

          {/* Tarjeta de reserva: ahora se estira al ancho del contenedor */}
          <Box
            id="book"
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,.12)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02))",
              backdropFilter: "blur(6px)",
              width: "100%",        // ocupa todo el ancho disponible
              maxWidth: "none",     // sin límite de ancho
              mx: 0,                // sin centrado forzado
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Reservá directo
            </Typography>
            <Typography sx={{ opacity: 0.85, mb: 2 }}>
              Leave your details and we will contact you to complete the booking.
            </Typography>

            {/* En modo compacto, el form NO agrega otro Paper ni encabezado */}
            <BookingForm compact cfg={cfg} hotel={hotel} />
          </Box>
        </Stack>
      </Box>
    </ClassicLayout>
  )
}
