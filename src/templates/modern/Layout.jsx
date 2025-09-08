// src/templates/modern/layout.jsx
import * as React from "react"
import {
  AppBar, Toolbar, Container, Box, Stack, Typography, IconButton, Button,
  Badge, Divider, Drawer, List, ListItemButton, ListItemText, CssBaseline,
  TextField, InputAdornment, Link as MLink, Chip
} from "@mui/material"
import { useTheme, alpha } from "@mui/material/styles"
import SearchIcon from "@mui/icons-material/Search"
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"
import MenuIcon from "@mui/icons-material/Menu"
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined"
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined"
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined"

export const getDescription = (descriptions, langPref = "en") => {
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

export const getHeroSubtitle = (hotel) => {
  const sub = getDescription(hotel?.descriptions, "en")
  return sub && sub.trim()
    ? sub
    : "A bright, minimalist space crafted for effortless stays."
}

export default function ModernLayout({ cfg = {}, hotel = {}, children }) {
  const theme = useTheme()
  const primary = cfg.primaryColor || theme.palette?.primary?.main || "#0EA5E9"
  const surface = theme.palette.background.paper
  const background = theme.palette.background.default
  const textPrimary = theme.palette.text.primary
  const textSecondary = theme.palette.text.secondary
  const divider = theme.palette.divider

  const ex = cfg.extra || {}
  const pages = cfg.pages || ["Overview", "Amenities", "Availability", "Location", "Contact"]
  const cartCount = Number.isFinite(cfg?.cartCount) ? cfg.cartCount : 0

  const hero = {
    title: hotel?.hotelName || "Modern Hotel",
    subtitle: getHeroSubtitle(hotel),
    image:
      ex.heroImage ||
      "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1800&auto=format&fit=crop",
    ctaText: ex.heroCtaText || "Book now",
    ctaHref: ex.heroCtaHref || "/book",
  }

  const [open, setOpen] = React.useState(false)
  const toggle = () => setOpen((v) => !v)

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: background, color: textPrimary }}>
      <CssBaseline />

      {/* ===== NAVBAR (clara, sticky) ===== */}
      <AppBar
        position="sticky"
        elevation={0}
        color="transparent"
        sx={{
          borderBottom: `1px solid ${divider}`,
          backgroundColor: alpha(surface, 0.85),
          backdropFilter: "saturate(140%) blur(8px)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 72 }}>
            {/* Brand */}
            <Stack direction="row" alignItems="center" spacing={1.5}>
              {cfg.logoUrl ? (
                <Box component="img" src={cfg.logoUrl} alt="logo" sx={{ width: 40, height: 40, objectFit: "contain" }} />
              ) : (
                <Box sx={{ width: 40, height: 40, borderRadius: 10, bgcolor: primary }} />
              )}
              <Typography sx={{ fontWeight: 900 }}>{hotel?.hotelName || "Modern Hotel"}</Typography>
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
            <Stack direction="row" spacing={2} alignItems="center" sx={{ display: { xs: "none", md: "flex" }, mr: 1.5 }}>
              {pages.map((p) => (
                <MLink
                  key={p}
                  href={`#${p.toLowerCase().replace(/\s+/g, "-")}`}
                  underline="none"
                  sx={{ color: textSecondary, fontWeight: 700, "&:hover": { color: textPrimary } }}
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
              <Button variant="contained" href={hero.ctaHref}>{hero.ctaText}</Button>
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
            <Typography variant="h6" sx={{ fontWeight: 900 }}>Menu</Typography>
            <IconButton onClick={toggle}><MenuIcon /></IconButton>
          </Stack>
          <Divider />
          <List>
            {pages.map((p) => (
              <ListItemButton key={p} component="a" href={`#${p.toLowerCase().replace(/\s+/g, "-")}`} onClick={toggle}>
                <ListItemText primary={p} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* ===== HERO ÚNICO (split, claro) ===== */}
      <Container id="overview" maxWidth="lg" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
            gap: { xs: 3, md: 4 },
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: 0.2 }}>{hero.title}</Typography>
            <Typography sx={{ mt: 2, color: textSecondary, lineHeight: 1.8 }}>{hero.subtitle}</Typography>
            <Stack direction="row" spacing={1.25} sx={{ mt: 3, flexWrap: "wrap" }}>
              <Chip icon={<VerifiedOutlinedIcon />} label="Best rate" />
              <Chip icon={<AccessTimeOutlinedIcon />} label="24/7 support" />
              <Chip icon={<HotelOutlinedIcon />} label="Curated rooms" />
            </Stack>
            <Stack direction="row" spacing={1.5} sx={{ mt: 4 }}>
              <Button variant="contained" size="large" href={hero.ctaHref}>{hero.ctaText}</Button>
              <Button variant="outlined" size="large" href="#availability">Check availability</Button>
            </Stack>
          </Box>

          <Box
            sx={{
              position: "relative",
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(2,6,23,0.08), 0 2px 10px rgba(2,6,23,0.04)",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(600px 240px at 90% 10%, ${alpha(primary, 0.16)}, transparent 60%)`,
                pointerEvents: "none",
              }}
            />
            <Box sx={{ pt: "66%", backgroundImage: `url(${hero.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          </Box>
        </Box>
      </Container>

      {/* ===== CONTENIDO ===== */}
      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 8 } }}>
        {children}
      </Container>

      {/* ===== FOOTER ===== */}
      <Box component="footer" sx={{ borderTop: `1px solid ${divider}`, py: 3, textAlign: "center" }}>
        <Container maxWidth="lg">
          <Typography sx={{ color: textSecondary, fontSize: 14 }}>
            © {new Date().getFullYear()} {hotel?.hotelName || "Modern Hotel"}. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
