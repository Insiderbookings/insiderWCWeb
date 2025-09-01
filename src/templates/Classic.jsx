// src/themes/Classic.jsx
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
  Link as MLink,
  Badge,
  Divider,
  Grid,
  Chip,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  CssBaseline,
} from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded"
import InstagramIcon from "@mui/icons-material/Instagram"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen" // lo usamos como X/Twitter (rotado)
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined"
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined"
import SearchIcon from "@mui/icons-material/Search"
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"
import MenuIcon from "@mui/icons-material/Menu"
import HotelIcon from "@mui/icons-material/Hotel"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import Availability from "../components/Availability"

// ------------ helpers ------------
const getDescription = (descriptions, langPref = "en") => {
  if (!descriptions) return ""
  // puede venir como [] de {text, language} o como string
  if (Array.isArray(descriptions) && descriptions.length > 0) {
    const byLang =
      descriptions.find((d) => d?.language === langPref)?.text ||
      descriptions.find((d) => d?.language === "en")?.text ||
      descriptions[0]?.text
    return byLang || ""
  }
  if (typeof descriptions === "string") return descriptions
  return ""
}

const getHeroSubtitle = (hotel) => {
  const sub = getDescription(hotel?.descriptions, "en")
  if (sub && sub.trim().length > 0) return sub
  return "Your perfect stay awaits."
}

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

// ------------ componente principal ------------
export default function Classic({ cfg = {}, hotel = {} }) {
  const primary = cfg.primaryColor || "#d4af37"
  const secondary = cfg.secondaryColor || "#0b0e13"
  const font = cfg.fontFamily || "Inter, system-ui, sans-serif"
  const ex = cfg?.extra || {}
  const social = cfg?.social || {}
  const cartCount = Number.isFinite(cfg?.cartCount) ? cfg.cartCount : 0

  const pages =
    cfg?.pages ||
    ["HOME", "DARK", "ROOMS & SUITES", "PAGES", "NEWS", "CONTACT"]

  const hero = {
    title: hotel?.hotelName || "Hotel",
    subtitle: getHeroSubtitle(hotel),
    image:
      ex.heroImage ||
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1800&auto=format&fit=crop",
    ctaText: ex.heroCtaText || "BOOK NOW",
    ctaHref: ex.heroCtaHref || "#book",
  }

  const theme = createTheme({
    typography: {
      fontFamily: font,
    },
    palette: {
      mode: "dark",
      primary: { main: primary },
      background: { default: secondary, paper: secondary },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 12, textTransform: "none", fontWeight: 800 },
        },
      },
    },
  })

  const address = formatFullAddress(hotel?.location)
  const email = hotel?.contact?.email || ""
  const phone = hotel?.contact?.telephone || ""
  const rooms = getRooms(hotel)

  // drawer móvil
  const [open, setOpen] = React.useState(false)
  const toggle = () => setOpen((v) => !v)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: secondary, color: "#fff", minHeight: "100vh" }}>
        {/* ===== NAV (transparente) ===== */}
        <AppBar
          position="absolute"
          elevation={0}
          sx={{
            top: 0,
            left: 0,
            right: 0,
            bgcolor: "transparent",
            color: "#fff",
            borderBottom: "1px solid rgba(255,255,255,.08)",
          }}
        >
          {/* Top bar */}
          <Box sx={{ borderBottom: "1px solid rgba(255,255,255,.08)" }}>
            <Container maxWidth="xl">
              <Toolbar
                variant="dense"
                sx={{
                  px: 0,
                  minHeight: 56,
                  justifyContent: "space-between",
                  color: "rgba(255,255,255,.8)",
                }}
              >
                {/* Social left */}
                <Stack direction="row" spacing={2} alignItems="center">
                  {social.facebook && (
                    <MLink
                      href={social.facebook}
                      underline="none"
                      aria-label="Facebook"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "inherit",
                        "&:hover": { color: primary },
                      }}
                    >
                      <FacebookRoundedIcon fontSize="small" />
                    </MLink>
                  )}
                  {social.instagram && (
                    <MLink
                      href={social.instagram}
                      underline="none"
                      aria-label="Instagram"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "inherit",
                        "&:hover": { color: primary },
                      }}
                    >
                      <InstagramIcon fontSize="small" />
                    </MLink>
                  )}
                  {social.linkedin && (
                    <MLink
                      href={social.linkedin}
                      underline="none"
                      aria-label="LinkedIn"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "inherit",
                        "&:hover": { color: primary },
                      }}
                    >
                      <LinkedInIcon fontSize="small" />
                    </MLink>
                  )}
                  {social.x && (
                    <MLink
                      href={social.x}
                      underline="none"
                      aria-label="X"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "inherit",
                        "&:hover": { color: primary },
                      }}
                    >
                      <CloseFullscreenIcon
                        fontSize="small"
                        sx={{ transform: "rotate(45deg)" }}
                      />
                    </MLink>
                  )}
                </Stack>

                {/* Contact right */}
                <Stack
                  direction="row"
                  spacing={3}
                  alignItems="center"
                  sx={{ fontSize: 13 }}
                >
                  {email && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <MailOutlineIcon sx={{ fontSize: 16, color: primary }} />
                      <span>{email}</span>
                    </Stack>
                  )}
                  {address && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <RoomOutlinedIcon sx={{ fontSize: 16, color: primary }} />
                      <span>{address}</span>
                    </Stack>
                  )}
                </Stack>
              </Toolbar>
            </Container>
          </Box>

          {/* Main bar */}
          <Container maxWidth="xl">
            <Toolbar
              disableGutters
              sx={{
                minHeight: 68,
                px: 0,
                position: "relative",
              }}
            >
              {/* Left: Logo */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ zIndex: 2 }}
              >
                {cfg.logoUrl ? (
                  <Box
                    component="img"
                    src={cfg.logoUrl}
                    alt="logo"
                    sx={{ width: 42, height: 42, objectFit: "contain" }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "8px",
                      bgcolor: "transparent",
                      border: `2px solid ${primary}`,
                    }}
                  />
                )}
              </Stack>

              {/* Center: Menu */}
              <Stack
                direction="row"
                spacing={3}
                alignItems="center"
                sx={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: { xs: "none", md: "flex" },
                }}
              >
                {pages.map((p) => (
                  <Button
                    key={p}
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      letterSpacing: 0.6,
                      "&:hover": { color: primary, background: "transparent" },
                    }}
                    href={`#${p.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {p}
                  </Button>
                ))}
              </Stack>

              {/* Right: icons */}
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ marginLeft: "auto", zIndex: 2 }}
              >
                <IconButton color="inherit" sx={{ "&:hover": { color: primary } }}>
                  <SearchIcon />
                </IconButton>
                <IconButton color="inherit" sx={{ "&:hover": { color: primary } }}>
                  <Badge badgeContent={cartCount} color="default" overlap="circular">
                    <ShoppingCartOutlinedIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  color="inherit"
                  onClick={toggle}
                  sx={{
                    display: { xs: "inline-flex", md: "inline-flex" },
                    "&:hover": { color: primary },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Stack>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Drawer móvil */}
        <Drawer anchor="right" open={open} onClose={toggle}>
          <Box
            role="presentation"
            sx={{ width: 280, bgcolor: secondary, height: "100%" }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ px: 2, py: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {hotel?.hotelName || "Hotel"}
              </Typography>
              <IconButton onClick={toggle} color="inherit">
                <MenuIcon />
              </IconButton>
            </Stack>
            <Divider sx={{ borderColor: "rgba(255,255,255,.08)" }} />
            <List>
              {pages.map((p) => (
                <ListItemButton
                  key={p}
                  component="a"
                  href={`#${p.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={toggle}
                >
                  <ListItemText
                    primary={p}
                    primaryTypographyProps={{ fontWeight: 700 }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* ===== HERO ===== */}
        <Box
          sx={{
            position: "relative",
            minHeight: { xs: 520, md: 720 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            backgroundImage: `url(${hero.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#fff",
            px: 2,
          }}
        >
          {/* overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                `radial-gradient(1200px 520px at 15% 50%, rgba(0,0,0,.0) 0%, rgba(0,0,0,.35) 60%, rgba(0,0,0,.65) 100%),
               linear-gradient(180deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,.55) 70%, rgba(0,0,0,.65) 100%)`,
            }}
          />
          <Box sx={{ position: "relative", zIndex: 1, maxWidth: 900, mt: 6 }}>
            <Typography
              variant="h2"
              sx={{ fontWeight: 900, letterSpacing: ".5px" }}
            >
              {hero.title}
            </Typography>
            <Typography sx={{ mt: 1.5, opacity: 0.92 }}>
              {hero.subtitle}
            </Typography>
            <Button
              href={hero.ctaHref}
              size="large"
              sx={{
                mt: 3,
                px: 4,
                borderRadius: 2,
                bgcolor: primary,
                color: "#111",
                fontWeight: 800,
                "&:hover": { bgcolor: primary },
              }}
            >
              {hero.ctaText}
            </Button>
          </Box>
        </Box>

        {/* ===== CONTENT ===== */}
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          {/* About / Highlights */}
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
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 2 }}
            >
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
        </Container>

        {/* ===== FOOTER ===== */}
        <Box
          component="footer"
          sx={{
            borderTop: "1px solid rgba(255,255,255,.08)",
            py: 4,
            textAlign: "center",
            opacity: 0.85,
          }}
        >
          <Typography sx={{ fontSize: 14 }}>
            © {new Date().getFullYear()} {hotel?.hotelName || "Hotel"}. All rights
            reserved.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
