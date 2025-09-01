import * as React from "react"
import {
  Box,
  Stack,
  Typography,
  Grid,
  Chip,
  Button,
  Divider,
} from "@mui/material"
import HotelIcon from "@mui/icons-material/Hotel"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined"
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import Availability from "../components/Availability"
import ClassicLayout, { getHeroSubtitle } from "./classic/layout"

const formatFullAddress = (location) => {
  if (!location) return ""
  const parts = [
    location.address,
    location.city,
    location.zipCode,
    location.country,
  ].filter(Boolean)
  return parts.join(", ")
}

const getRooms = (hotel) => {
  const edges = hotel?.rooms?.edges
  if (!Array.isArray(edges) || edges.length === 0) return []
  return edges
    .map((e) => e?.node?.roomData?.roomCode)
    .filter(Boolean)
    .map((code) => ({
      code,
      name: `Room ${code}`,
    }))
}

export default function Classic({ cfg = {}, hotel = {} }) {
  const primary = cfg.primaryColor || "#d4af37"
  const ex = cfg?.extra || {}
  const address = formatFullAddress(hotel?.location)
  const email = hotel?.contact?.email || ""
  const phone = hotel?.contact?.telephone || ""
  const rooms = getRooms(hotel)

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
              <Stack spacing={1} sx={{ fontSize: 14 }}>
                {address && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <RoomOutlinedIcon sx={{ color: primary }} />
                    <span>{address}</span>
                  </Stack>
                )}
                {phone && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <LocalPhoneOutlinedIcon sx={{ color: primary }} />
                    <span>{phone}</span>
                  </Stack>
                )}
                {email && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <MailOutlineIcon sx={{ color: primary }} />
                    <span>{email}</span>
                  </Stack>
                )}
              </Stack>
              <Button
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.4,
                  bgcolor: primary,
                  color: "#111",
                  fontWeight: 900,
                  "&:hover": { bgcolor: primary },
                }}
                href={ex.heroCtaHref || "#"}
              >
                Request booking
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Availability & Booking */}
      <Availability hotel={hotel} />

      {/* Rooms & Suites */}
      <Box id="rooms-&-suites" sx={{ mt: { xs: 8, md: 10 } }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <HotelIcon sx={{ color: primary }} />
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            Rooms & Suites
          </Typography>
        </Stack>
        {rooms.length === 0 ? (
          <Typography sx={{ opacity: 0.8 }}>
            Rooms coming soon.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {rooms.map((r) => (
              <Grid item xs={12} sm={6} md={3} key={r.code}>
                <Box
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,.12)",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02))",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      pt: "62%",
                      backgroundImage:
                        "url(https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <Box sx={{ p: 2.2 }}>
                    <Typography sx={{ fontWeight: 800 }}>{r.name}</Typography>
                    <Typography sx={{ opacity: 0.8, fontSize: 14 }}>
                      Código interno: {r.code}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                      <Chip
                        size="small"
                        label="Wi-Fi"
                        variant="outlined"
                        sx={{ borderColor: "rgba(255,255,255,.18)" }}
                      />
                      <Chip
                        size="small"
                        label="A/C"
                        variant="outlined"
                        sx={{ borderColor: "rgba(255,255,255,.18)" }}
                      />
                    </Stack>
                    <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: primary,
                          color: primary,
                          fontWeight: 800,
                          "&:hover": { borderColor: primary, color: primary },
                        }}
                      >
                        Ver detalles
                      </Button>
                      <Button
                        size="small"
                        sx={{
                          bgcolor: primary,
                          color: "#111",
                          fontWeight: 900,
                          "&:hover": { bgcolor: primary },
                        }}
                      >
                        Book
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Contacto & Ubicación */}
      <Box id="contact" sx={{ mt: { xs: 8, md: 10 } }}>
        <Divider sx={{ mb: 3, borderColor: "rgba(255,255,255,.08)" }} />
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>
          Contact & Location
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,.12)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02))",
              }}
            >
              <Stack spacing={1.5} sx={{ fontSize: 14 }}>
                {address && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <RoomOutlinedIcon sx={{ color: primary }} />
                    <span>{address}</span>
                  </Stack>
                )}
                {phone && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <LocalPhoneOutlinedIcon sx={{ color: primary }} />
                    <span>{phone}</span>
                  </Stack>
                )}
                {email && (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <MailOutlineIcon sx={{ color: primary }} />
                    <span>{email}</span>
                  </Stack>
                )}
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,.12)",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02))",
              }}
            >
              <Typography sx={{ opacity: 0.85 }}>
                Mapa o imagen de ubicación (opcional).
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ClassicLayout>
  )
}

