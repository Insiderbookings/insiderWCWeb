// src/themes/Modern.jsx
"use client"
import * as React from "react"
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Stack,
  Typography,
  IconButton,
  Button,
  Badge,
  Divider,
  Grid,
  Chip,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  CssBaseline,
  Paper,
  TextField,
  InputAdornment,
  Link as MLink,
} from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import SearchIcon from "@mui/icons-material/Search"
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"
import MenuIcon from "@mui/icons-material/Menu"
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined"
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined"
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined"
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined"
import MapOutlinedIcon from "@mui/icons-material/MapOutlined"
import Availability from "./modern/Availability"

// ---------- helpers ----------
const getDescription = (descriptions, langPref = "en") => {
  if (!descriptions) return ""
  if (Array.isArray(descriptions) && descriptions.length > 0) {
    const byLang =
      descriptions.find((d) => d?.language === langPref)?.text ||
      descriptions.find((d) => d?.language === "es")?.text ||
      descriptions[0]?.text
    return byLang || ""
  }
  if (typeof descriptions === "string") return descriptions
  return ""
}

const friendlySubtitle = (hotel) => {
  const sub = getDescription(hotel?.descriptions, "en")
  if (sub && sub.trim()) return sub
  return "A bright, minimalist space crafted for effortless stays."
}

const fullAddress = (location) => {
  if (!location) return ""
  return [location.address, location.city, location.zipCode, location.country]
    .filter(Boolean)
    .join(", ")
}

const parseRooms = (hotel) => {
  const edges = hotel?.rooms?.edges
  if (!Array.isArray(edges) || edges.length === 0) return []
  // devolvemos solo la cantidad como placeholders legibles
  return edges
    .map((e) => e?.node?.roomData?.roomCode)
    .filter(Boolean)
    .map((code, idx) => ({
      code,
      title: `Accommodation ${idx + 1}`,
      img:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1400&auto=format&fit=crop",
      features: ["Wi-Fi", "A/C", "Smart TV"],
    }))
}

// ---------- componente ----------
export default function Modern({ cfg = {}, hotel = {} }) {
  // paleta clara, acento azul/teal; completamente distinto al Classic
  const primary = cfg.primaryColor || "#0EA5E9" // sky-500
  const surface = "#ffffff"
  const background = cfg.secondaryColor || "#F6F7FB"
  const font = cfg.fontFamily || "Inter, system-ui, sans-serif"
  const ex = cfg.extra || {}
  const cartCount = Number.isFinite(cfg?.cartCount) ? cfg.cartCount : 0

  const pages =
    cfg.pages || ["Overview", "Rooms", "Amenities", "Location", "Contact"]

  const theme = createTheme({
    palette: {
      mode: "light",
      primary: { main: primary },
      background: { default: background, paper: surface },
      text: { primary: "#0F172A", secondary: "#475569" },
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: font,
      h2: { fontWeight: 900, letterSpacing: 0.2 },
      h4: { fontWeight: 800 },
      button: { textTransform: "none", fontWeight: 800 },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            border: "1px solid rgba(2,6,23,0.06)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
      MuiAppBar: {
        styleOverrides: { root: { backdropFilter: "saturate(140%) blur(6px)" } },
      },
    },
  })

  const hero = {
    title: hotel?.hotelName || "Modern Hotel",
    subtitle: friendlySubtitle(hotel),
    image:
      ex.heroImage ||
      "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1800&auto=format&fit=crop",
    ctaText: ex.heroCtaText || "Book now",
    ctaHref: ex.heroCtaHref || "#contact",
  }

  const address = fullAddress(hotel?.location)
  const email = hotel?.contact?.email || ""
  const phone = hotel?.contact?.telephone || ""
  const rooms = parseRooms(hotel)

  // drawer móvil
  const [open, setOpen] = React.useState(false)
  const toggle = () => setOpen((v) => !v)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: background, color: "text.primary" }}>
        {/* ===== NAVBAR (clara, sticky) ===== */}
        <AppBar
          position="sticky"
          elevation={0}
          color="transparent"
          sx={{
            borderBottom: "1px solid rgba(2,6,23,0.06)",
            backgroundColor: "rgba(255,255,255,0.7)",
          }}
        >
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ minHeight: 72 }}>
              {/* Logo + brand */}
              <Stack direction="row" alignItems="center" spacing={1.5}>
                {cfg.logoUrl ? (
                  <Box
                    component="img"
                    src={cfg.logoUrl}
                    alt="logo"
                    sx={{ width: 40, height: 40, objectFit: "contain" }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      bgcolor: primary,
                    }}
                  />
                )}
                <Typography sx={{ fontWeight: 900 }}>
                  {hotel?.hotelName || "Modern Hotel"}
                </Typography>
              </Stack>

              {/* Search (desktop) */}
              <Box sx={{ flex: 1, display: { xs: "none", md: "flex" }, px: 3 }}>
                <TextField
                  placeholder="Search rooms, amenities…"
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Nav (desktop) */}
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ display: { xs: "none", md: "flex" }, mr: 1.5 }}
              >
                {pages.map((p) => (
                  <MLink
                    key={p}
                    href={`#${p.toLowerCase()}`}
                    underline="none"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 700,
                      "&:hover": { color: "text.primary" },
                    }}
                  >
                    {p}
                  </MLink>
                ))}
              </Stack>

              {/* Actions */}
              <Stack direction="row" spacing={1.25} alignItems="center" sx={{ ml: "auto" }}>
                <IconButton>
                  <Badge badgeContent={cartCount} color="primary">
                    <ShoppingCartOutlinedIcon />
                  </Badge>
                </IconButton>
                <Button variant="contained" href={hero.ctaHref}>
                  {hero.ctaText}
                </Button>
                <IconButton onClick={toggle} sx={{ display: { md: "none" } }}>
                  <MenuIcon />
                </IconButton>
              </Stack>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Drawer móvil */}
        <Drawer anchor="right" open={open} onClose={toggle}>
          <Box sx={{ width: 300 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                Menu
              </Typography>
              <IconButton onClick={toggle}>
                <MenuIcon />
              </IconButton>
            </Stack>
            <Divider />
            <List>
              {pages.map((p) => (
                <ListItemButton
                  key={p}
                  component="a"
                  href={`#${p.toLowerCase()}`}
                  onClick={toggle}
                >
                  <ListItemText primary={p} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* ===== HERO (split) ===== */}
        <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 8 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2">{hero.title}</Typography>
              <Typography sx={{ mt: 2, color: "text.secondary", lineHeight: 1.8 }}>
                {hero.subtitle}
              </Typography>
              <Stack direction="row" spacing={1.25} sx={{ mt: 3, flexWrap: "wrap" }}>
                <Chip icon={<VerifiedOutlinedIcon />} label="Best rate" />
                <Chip icon={<AccessTimeOutlinedIcon />} label="24/7 support" />
                <Chip icon={<HotelOutlinedIcon />} label="Curated rooms" />
              </Stack>
              <Stack direction="row" spacing={1.5} sx={{ mt: 4 }}>
                <Button variant="contained" size="large" href={hero.ctaHref}>
                  {hero.ctaText}
                </Button>
                <Button variant="outlined" size="large" href="#rooms">
                  Explore rooms
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow:
                    "0 10px 30px rgba(2,6,23,0.08), 0 2px 10px rgba(2,6,23,0.04)",
                }}
              >
                {/* fondo decorativo */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(600px 240px at 90% 10%, rgba(14,165,233,0.12), transparent 60%)",
                    pointerEvents: "none",
                  }}
                />
                <Box
                  sx={{
                    pt: "66%",
                    backgroundImage: `url(${hero.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* ===== AVAILABILITY & BOOK ===== */}
        <Availability hotel={hotel} />

        {/* ===== OVERVIEW (cards) ===== */}
        <Container id="overview" maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
          <Grid container spacing={3}>
            {[
              {
                icon: <HotelOutlinedIcon />,
                title: "Design-first hospitality",
                text: "Minimal layouts, sunlit spaces, premium linens.",
              },
              {
                icon: <MapOutlinedIcon />,
                title: "Prime location",
                text: address || "Steps away from city highlights.",
              },
              {
                icon: <VerifiedOutlinedIcon />,
                title: "Trusted experience",
                text: "Direct booking benefits & transparent policies.",
              },
            ].map((card, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 3,
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.98))",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: "rgba(14,165,233,0.12)",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <Box sx={{ color: "primary.main" }}>{card.icon}</Box>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {card.title}
                    </Typography>
                  </Stack>
                  <Typography sx={{ mt: 1.5, color: "text.secondary" }}>
                    {card.text}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* ===== ROOMS (horizontal scroll diferente) ===== */}
        {/* <Container id="rooms" maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Typography variant="h4">Rooms</Typography>
            <Button variant="text" href="#contact">
              Need help?
            </Button>
          </Stack>

          {rooms.length === 0 ? (
            <Paper elevation={0} sx={{ p: 3, textAlign: "center" }}>
              <Typography sx={{ color: "text.secondary" }}>
                Rooms coming soon.
              </Typography>
            </Paper>
          ) : (
            <Box
              sx={{
                display: "flex",
                gap: 2.5,
                overflowX: "auto",
                pb: 1,
                scrollSnapType: "x mandatory",
                "&::-webkit-scrollbar": { height: 8 },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(2,6,23,0.16)",
                  borderRadius: 8,
                },
              }}
            >
              {rooms.map((r, idx) => (
                <Paper
                  key={r.code}
                  elevation={0}
                  sx={{
                    minWidth: { xs: 280, sm: 320, md: 360 },
                    scrollSnapAlign: "start",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      pt: "62%",
                      backgroundImage: `url(${r.img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <Box sx={{ p: 2.25 }}>
                    <Typography sx={{ fontWeight: 800 }}>{r.title}</Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mt: 1.25, flexWrap: "wrap" }}
                    >
                      {r.features.map((f) => (
                        <Chip key={f} size="small" label={f} />
                      ))}
                    </Stack>
                    <Stack direction="row" spacing={1.25} sx={{ mt: 2 }}>
                      <Button variant="outlined">View details</Button>
                      <Button variant="contained">Reserve</Button>
                    </Stack>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Container> */}

        {/* ===== AMENITIES (chips sencillas) ===== */}
        <Container id="amenities" maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Amenities
          </Typography>
          <Paper elevation={0} sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {[
                "High-speed Wi-Fi",
                "Gym access",
                "Late checkout",
                "Concierge",
                "Airport transfer",
                "Pet-friendly",
              ].map((a) => (
                <Chip key={a} label={a} />
              ))}
            </Stack>
          </Paper>
        </Container>

        {/* ===== LOCATION + CONTACT (claro y minimal) ===== */}
        <Container id="location" maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 3, height: "100%" }}>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  Find us
                </Typography>
                <Typography sx={{ mt: 1.5, color: "text.secondary" }}>
                  {address || "Address available upon request."}
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    height: 260,
                    borderRadius: 2,
                    background:
                      "linear-gradient(180deg, rgba(14,165,233,0.10), rgba(14,165,233,0.02))",
                    border: "1px dashed rgba(2,6,23,0.12)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Typography sx={{ color: "text.secondary" }}>
                    Map placeholder (embed your map here)
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} id="contact">
              <Paper elevation={0} sx={{ p: 3, height: "100%" }}>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  Contact
                </Typography>
                <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                  {phone && (
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <LocalPhoneOutlinedIcon color="primary" />
                      <Typography>{phone}</Typography>
                    </Stack>
                  )}
                  {email && (
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <MailOutlineIcon color="primary" />
                      <Typography>{email}</Typography>
                    </Stack>
                  )}
                </Stack>

                <Divider sx={{ my: 2 }} />
                {/* formulario compacto (opcional) */}
                <Stack spacing={1.25}>
                  <TextField size="small" label="Your name" />
                  <TextField size="small" label="Email" />
                  <TextField size="small" label="Message" multiline rows={3} />
                  <Button variant="contained" size="large">
                    Send inquiry
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* ===== FOOTER ===== */}
        <Box
          component="footer"
          sx={{
            borderTop: "1px solid rgba(2,6,23,0.06)",
            py: 4,
            textAlign: "center",
          }}
        >
          <Container maxWidth="lg">
            <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
              © {new Date().getFullYear()} {hotel?.hotelName || "Modern Hotel"}. All
              rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
