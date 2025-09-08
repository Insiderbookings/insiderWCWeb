// src/templates/classic/layout.jsx
import * as React from "react"
import {
  AppBar, Toolbar, Container, Box, Stack, Typography, IconButton, Button,
  Link as MLink, Badge, Divider, Drawer, List, ListItemButton, ListItemText,
  CssBaseline, Chip,
} from "@mui/material"
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles"
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded"
import InstagramIcon from "@mui/icons-material/Instagram"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen"
import SearchIcon from "@mui/icons-material/Search"
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"
import MenuIcon from "@mui/icons-material/Menu"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined"
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined"
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined"
import KingBedOutlinedIcon from "@mui/icons-material/KingBedOutlined"

export const getDescription = (descriptions, langPref = "en") => {
  if (!descriptions) return ""
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

export const getHeroSubtitle = (hotel) => {
  const sub = getDescription(hotel?.descriptions, "en")
  if (sub && sub.trim().length > 0) return sub
  return "Your perfect stay awaits."
}

const formatFullAddress = (location) => {
  if (!location) return ""
  const parts = [location.address, location.city, location.zipCode, location.country].filter(Boolean)
  return parts.join(", ")
}

export default function ClassicLayout({ cfg = {}, hotel = {}, children }) {
  const primary = cfg.primaryColor || "#d4af37"
  const secondary = cfg.secondaryColor || "#0b0e13"
  const font = cfg.fontFamily || "Inter, system-ui, sans-serif"
  const ex = cfg?.extra || {}
  const social = cfg?.social || {}
  const cartCount = Number.isFinite(cfg?.cartCount) ? cfg.cartCount : 0

  // Por defecto quitamos "Rooms & Suites" y sumamos "Availability"
  const pages = cfg?.pages || ["Home", "Experiences", "Amenities", "Availability", "Dining & Spa", "Reviews", "Contact"]

  const hero = {
    title: hotel?.hotelName || "Boutique Luxury Hotel",
    subtitle: getHeroSubtitle(hotel),
    image:
      ex.heroImage ||
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1800&auto=format&fit=crop",
    ctaText: ex.heroCtaText || "BOOK NOW",
    ctaHref: ex.heroCtaHref || "/book",
  }

  const theme = createTheme({
    typography: { fontFamily: font, button: { textTransform: "none", fontWeight: 800 } },
    palette: {
      mode: "dark",
      primary: { main: primary },
      background: { default: secondary, paper: secondary },
      divider: "rgba(255,255,255,.08)",
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: { styleOverrides: { root: { borderRadius: 12 } } },
      MuiPaper: { styleOverrides: { root: { border: "1px solid rgba(255,255,255,.12)" } } },
    },
  })

  const address = formatFullAddress(hotel?.location)
  const email = hotel?.contact?.email || ""

  const [open, setOpen] = React.useState(false)
  const toggle = () => setOpen((v) => !v)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: secondary, color: "#fff", minHeight: "100vh" }}>
        {/* NAV */}
        <AppBar position="absolute" elevation={0} sx={{ bgcolor: "transparent", color: "#fff", borderBottom: "1px solid", borderColor: "divider" }}>
          {/* Top bar */}
          <Box sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
            <Container maxWidth="xl">
              <Toolbar variant="dense" sx={{ px: 0, minHeight: 56, justifyContent: "space-between", color: "rgba(255,255,255,.85)" }}>
                {/* Social */}
                <Stack direction="row" spacing={2} alignItems="center">
                  {social.facebook && (
                    <MLink href={social.facebook} underline="none" aria-label="Facebook" sx={{ display: "flex", alignItems: "center", color: "inherit", "&:hover": { color: primary } }}>
                      <FacebookRoundedIcon fontSize="small" />
                    </MLink>
                  )}
                  {social.instagram && (
                    <MLink href={social.instagram} underline="none" aria-label="Instagram" sx={{ display: "flex", alignItems: "center", color: "inherit", "&:hover": { color: primary } }}>
                      <InstagramIcon fontSize="small" />
                    </MLink>
                  )}
                  {social.linkedin && (
                    <MLink href={social.linkedin} underline="none" aria-label="LinkedIn" sx={{ display: "flex", alignItems: "center", color: "inherit", "&:hover": { color: primary } }}>
                      <LinkedInIcon fontSize="small" />
                    </MLink>
                  )}
                  {social.x && (
                    <MLink href={social.x} underline="none" aria-label="X" sx={{ display: "flex", alignItems: "center", color: "inherit", "&:hover": { color: primary } }}>
                      <CloseFullscreenIcon fontSize="small" sx={{ transform: "rotate(45deg)" }} />
                    </MLink>
                  )}
                </Stack>

                {/* Contacto */}
                <Stack direction="row" spacing={3} alignItems="center" sx={{ fontSize: 13 }}>
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
            <Toolbar disableGutters sx={{ minHeight: 68, px: 0, position: "relative" }}>
              {/* Logo */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ zIndex: 2 }}>
                {cfg.logoUrl ? (
                  <Box component="img" src={cfg.logoUrl} alt="logo" sx={{ width: 42, height: 42, objectFit: "contain" }} />
                ) : (
                  <Box sx={{ width: 42, height: 42, borderRadius: 2, border: `2px solid ${primary}` }} />
                )}
              </Stack>

              {/* Menú */}
              <Stack direction="row" spacing={3} alignItems="center" sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: { xs: "none", md: "flex" } }}>
                {pages.map((p) => (
                  <Button key={p} sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.6, "&:hover": { color: primary, background: "transparent" } }} href={`#${p.toLowerCase().replace(/\s+/g, "-")}`}>
                    {p}
                  </Button>
                ))}
              </Stack>

              {/* Acciones */}
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: "auto", zIndex: 2 }}>
                <IconButton color="inherit" sx={{ "&:hover": { color: primary } }}>
                  <SearchIcon />
                </IconButton>
                <IconButton color="inherit" sx={{ "&:hover": { color: primary } }}>
                  <Badge badgeContent={cartCount} color="default" overlap="circular">
                    <ShoppingCartOutlinedIcon />
                  </Badge>
                </IconButton>
                <IconButton color="inherit" onClick={toggle} sx={{ display: { xs: "inline-flex", md: "inline-flex" }, "&:hover": { color: primary } }}>
                  <MenuIcon />
                </IconButton>
              </Stack>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Drawer */}
        <Drawer anchor="right" open={open} onClose={toggle}>
          <Box role="presentation" sx={{ width: 280, bgcolor: secondary, height: "100%" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{hotel?.hotelName || "Hotel"}</Typography>
              <IconButton onClick={toggle} color="inherit"><MenuIcon /></IconButton>
            </Stack>
            <Divider sx={{ borderColor: "divider" }} />
            <List>
              {pages.map((p) => (
                <ListItemButton key={p} component="a" href={`#${p.toLowerCase().replace(/\s+/g, "-")}`} onClick={toggle}>
                  <ListItemText primary={p} primaryTypographyProps={{ fontWeight: 700 }} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* HERO ÚNICO */}
        <Box
          id="home"
          sx={{
            position: "relative",
            minHeight: { xs: 560, md: 720 },
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
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                `radial-gradient(1200px 520px at 15% 50%, rgba(0,0,0,.05) 0%, rgba(0,0,0,.35) 60%, rgba(0,0,0,.7) 100%),` +
                `linear-gradient(180deg, rgba(0,0,0,.40) 0%, rgba(0,0,0,.60) 65%, rgba(0,0,0,.75) 100%)`,
            }}
          />
          <Box sx={{ position: "relative", zIndex: 1, maxWidth: 980, mt: 8 }}>
            <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: ".5px" }}>{hero.title}</Typography>
            <Typography sx={{ mt: 1.5, opacity: 0.92, lineHeight: 1.9 }}>{hero.subtitle}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <Chip icon={<VerifiedOutlinedIcon />} label="Best Rate Guarantee" sx={{ bgcolor: alpha(primary, 0.18), color: "#fff", border: 0 }} />
              <Chip icon={<AccessTimeOutlinedIcon />} label="24/7 Concierge" sx={{ bgcolor: alpha(primary, 0.18), color: "#fff", border: 0 }} />
              <Chip icon={<KingBedOutlinedIcon />} label="Signature Suites" sx={{ bgcolor: alpha(primary, 0.18), color: "#fff", border: 0 }} />
            </Stack>
            <Button href={hero.ctaHref} size="large" sx={{ mt: 3, px: 4, borderRadius: 2, bgcolor: primary, color: "#111", fontWeight: 900, "&:hover": { bgcolor: primary } }}>
              {hero.ctaText}
            </Button>
          </Box>
        </Box>

        {/* CONTENIDO */}
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          {children}
        </Container>

        {/* FOOTER */}
        <Box component="footer" sx={{ borderTop: "1px solid", borderColor: "divider", py: 4, textAlign: "center", opacity: 0.85 }}>
          <Typography sx={{ fontSize: 14 }}>© {new Date().getFullYear()} {hotel?.hotelName || "Hotel"}. All rights reserved.</Typography>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
