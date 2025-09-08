// src/templates/Classic.jsx
import * as React from "react"
import {
  Box, Stack, Typography, Grid, Chip, Button, Divider, Paper, Avatar, Rating,
} from "@mui/material"
import { useTheme, alpha } from "@mui/material/styles"
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined"
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined"
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined"
import WifiOutlinedIcon from "@mui/icons-material/WifiOutlined"
import LocalParkingOutlinedIcon from "@mui/icons-material/LocalParkingOutlined"
import PoolOutlinedIcon from "@mui/icons-material/PoolOutlined"
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined"
import LocalLaundryServiceOutlinedIcon from "@mui/icons-material/LocalLaundryServiceOutlined"
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined"
import LocalTaxiOutlinedIcon from "@mui/icons-material/LocalTaxiOutlined"
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined"
import Availability from "./Availability"
import ClassicLayout from "./layout"

const pick = (v, fb) => (v === undefined || v === null || v === "" ? fb : v)
const fullAddress = (loc) => (!loc ? "" : [loc.address, loc.city, loc.zipCode, loc.country].filter(Boolean).join(", "))

const amenityItems = [
  { icon: <WifiOutlinedIcon />, label: "Wi-Fi Premium" },
  { icon: <LocalParkingOutlinedIcon />, label: "Parking" },
  { icon: <PoolOutlinedIcon />, label: "Pool" },
  { icon: <FitnessCenterOutlinedIcon />, label: "Gym" },
  { icon: <LocalLaundryServiceOutlinedIcon />, label: "Laundry" },
  { icon: <ShieldOutlinedIcon />, label: "24/7 Security" },
  { icon: <LocalTaxiOutlinedIcon />, label: "Airport Transfer" },
  { icon: <SpaOutlinedIcon />, label: "Spa & Wellness" },
]

const testimonials = [
  { name: "Ana", text: "Servicio impecable y detalles de lujo. El desayuno fue increíble y la ubicación perfecta.", rating: 5 },
  { name: "Marcos", text: "La habitación tenía un diseño espectacular. El personal nos ayudó en todo momento.", rating: 5 },
  { name: "Lucía", text: "Experiencia boutique real: silencioso, elegante y con atención personalizada.", rating: 5 },
]

const awards = ["Forbes Travel", "Conde Nast", "Tripadvisor", "Michelin Guide"]

export default function Classic({ cfg = {}, hotel = {} }) {
  const theme = useTheme()
  const primary = pick(cfg.primaryColor, theme.palette?.primary?.main || "#d4af37")
  const dimBorder = "rgba(255,255,255,.12)"
  const textLight = "#fff"
  const glassBg = "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.04))"
  const address = fullAddress(hotel?.location)
  const email = hotel?.contact?.email || ""
  const phone = hotel?.contact?.telephone || ""

  return (
    <ClassicLayout cfg={cfg} hotel={hotel}>
      {/* TRUST BAR */}
      <Box sx={{ mb: 6 }}>
        <Divider sx={{ borderColor: "rgba(255,255,255,.08)", mb: 3 }} />
        <Stack direction="row" spacing={4} sx={{ justifyContent: "center", flexWrap: "wrap", color: "rgba(255,255,255,.7)" }}>
          {awards.map((a) => (
            <Stack key={a} direction="row" spacing={1} alignItems="center">
              <StarBorderOutlinedIcon sx={{ color: primary }} />
              <Typography sx={{ fontWeight: 700 }}>{a}</Typography>
            </Stack>
          ))}
        </Stack>
      </Box>

      {/* EXPERIENCES */}
      <Box id="experiences" sx={{ mb: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
              Diseño clásico, alma contemporánea
            </Typography>
            <Typography sx={{ opacity: 0.95, lineHeight: 1.9 }}>
              Habitaciones diseñadas con materiales nobles, amenities premium y servicio de concierge.
              Descubrí una propuesta que combina tradición y tecnología para una estadía inolvidable.
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button href="/book" sx={{ bgcolor: primary, color: "#111", fontWeight: 900, "&:hover": { bgcolor: primary } }}>
                Reservar ahora
              </Button>
              <Button variant="outlined" href="#amenities" sx={{ color: textLight, borderColor: dimBorder }}>
                Ver amenities
              </Button>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {[
                "https://images.unsplash.com/photo-1542089363-8a86e7c28e5e?q=80&w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1501117716987-c8e1ecb2103a?q=80&w=1200&auto=format&fit=crop",
              ].map((src, i) => (
                <Grid key={src} item xs={i === 0 ? 12 : 6}>
                  <Box sx={{
                    pt: i === 0 ? "52%" : "100%", borderRadius: 3, overflow: "hidden",
                    border: `1px solid ${dimBorder}`, backgroundImage: `url(${src})`,
                    backgroundSize: "cover", backgroundPosition: "center",
                  }} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* AVAILABILITY — ahora con cards tipo Rooms */}
      <Availability hotel={hotel} />

      {/* AMENITIES */}
      <Box id="amenities" sx={{ mb: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>Amenities & Servicios</Typography>
        <Grid container spacing={2}>
          {amenityItems.map((a) => (
            <Grid item xs={12} sm={6} md={3} key={a.label}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, borderColor: dimBorder, background: glassBg, display: "flex", alignItems: "center", gap: 1.25 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 2, display: "grid", placeItems: "center", bgcolor: alpha(primary, 0.18), color: primary }}>
                  {a.icon}
                </Box>
                <Typography>{a.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* DINING & SPA */}
      <Box id="dining-spa" sx={{ mb: 8 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, minHeight: 260 }}>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <RestaurantOutlinedIcon sx={{ color: primary }} />
                <Typography variant="h6" sx={{ fontWeight: 900 }}>Gastronomía de autor</Typography>
              </Stack>
              <Typography sx={{ mt: 1.25, opacity: 0.9 }}>Carta de temporada, maridajes y room service 24/7.</Typography>
              <Button href="/book" sx={{ mt: 2, color: primary }}>Reservar mesa</Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, minHeight: 260 }}>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <SpaOutlinedIcon sx={{ color: primary }} />
                <Typography variant="h6" sx={{ fontWeight: 900 }}>Spa & Wellness</Typography>
              </Stack>
              <Typography sx={{ mt: 1.25, opacity: 0.9 }}>Tratamientos personalizados, sauna y sala de masajes.</Typography>
              <Button href="/book" sx={{ mt: 2, color: primary }}>Agendar tratamiento</Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* REVIEWS */}
      <Box id="reviews" sx={{ mb: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>Lo que dicen nuestros huéspedes</Typography>
        <Grid container spacing={2}>
          {testimonials.map((t) => (
            <Grid item xs={12} md={4} key={t.name}>
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: "100%" }}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Avatar>{t.name[0]}</Avatar>
                  <Typography sx={{ fontWeight: 800 }}>{t.name}</Typography>
                </Stack>
                <Rating value={t.rating} readOnly sx={{ mt: 1 }} />
                <Typography sx={{ mt: 1.25, opacity: 0.95 }}>{t.text}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA */}
      <Box sx={{ mb: 8, p: { xs: 3, md: 4 }, borderRadius: 3, border: `1px solid ${dimBorder}`, background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.04))", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
        <Typography sx={{ fontWeight: 900, fontSize: { xs: 18, md: 22 } }}>Listo para tu próxima escapada de lujo</Typography>
        <Button href="/book" sx={{ px: 3, bgcolor: primary, color: "#111", fontWeight: 900, "&:hover": { bgcolor: primary } }}>
          Reservar ahora
        </Button>
      </Box>

      {/* CONTACT */}
      <Box id="contact" sx={{ mb: 10 }}>
        <Divider sx={{ borderColor: "rgba(255,255,255,.08)", mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, borderRadius: 3, border: `1px solid ${dimBorder}`, background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.04))" }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 1.5 }}>Contacto & Ubicación</Typography>
              <Stack spacing={1.2} sx={{ fontSize: 14 }}>
                {address && (
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <RoomOutlinedIcon sx={{ color: primary }} />
                    <span>{address}</span>
                  </Stack>
                )}
                {phone && (
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <LocalPhoneOutlinedIcon sx={{ color: primary }} />
                    <span>{phone}</span>
                  </Stack>
                )}
                {email && (
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <MailOutlineIcon sx={{ color: primary }} />
                    <span>{email}</span>
                  </Stack>
                )}
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, borderRadius: 3, border: `1px solid ${dimBorder}`, background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.04))", height: "100%", display: "grid", placeItems: "center", color: "rgba(255,255,255,.8)" }}>
              <Typography sx={{ opacity: 0.85 }}>Mapa embebido (placeholder)</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ClassicLayout>
  )
}
