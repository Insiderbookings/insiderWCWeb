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
import { ThemeProvider, createTheme } from "@mui/material/styles"
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded"
import InstagramIcon from "@mui/icons-material/Instagram"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen"
import SearchIcon from "@mui/icons-material/Search"
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined"
import MenuIcon from "@mui/icons-material/Menu"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import BookingForm from "../../../components/BookingForm"

// -------- helpers (copied from Classic.jsx) --------
const getDescription = (descriptions, langPref = "en") => {
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

const getHeroSubtitle = (hotel) => {
  const sub = getDescription(hotel?.descriptions, "en")
  if (sub && sub.trim().length > 0) return sub
  return "Your perfect stay awaits."
}

export default function ClassicBook({ cfg = {}, hotel = {} }) {
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

  const [open, setOpen] = React.useState(false)
  const toggle = () => setOpen((v) => !v)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: secondary, color: "#fff", minHeight: "100vh" }}>
        {/* ===== NAV ===== */}
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
                {/* Right icons */}
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <IconButton size="small" color="inherit">
                    <SearchIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="inherit">
                    <Badge
                      badgeContent={cartCount}
                      color="primary"
                      sx={{ "& .MuiBadge-badge": { fontWeight: 700 } }}
                    >
                      <ShoppingCartOutlinedIcon fontSize="small" />
                    </Badge>
                  </IconButton>
                </Stack>
              </Toolbar>
            </Container>
          </Box>

          {/* Main Nav */}
          <Container maxWidth="xl">
            <Toolbar
              disableGutters
              sx={{
                minHeight: 72,
                justifyContent: "space-between",
                px: 0,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {hotel?.hotelName || "Hotel"}
              </Typography>
              <Stack
                direction="row"
                spacing={3}
                alignItems="center"
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                {pages.map((p) => (
                  <MLink
                    key={p}
                    href={`#${p.toLowerCase().replace(/\s+/g, "-")}`}
                    underline="none"
                    sx={{
                      fontSize: 14,
                      color: "inherit",
                      fontWeight: 700,
                      "&:hover": { color: primary },
                    }}
                  >
                    {p}
                  </MLink>
                ))}
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Button
                  href="#book"
                  size="small"
                  sx={{
                    bgcolor: primary,
                    color: "#111",
                    fontWeight: 900,
                    px: 2.5,
                    "&:hover": { bgcolor: primary },
                  }}
                >
                  Book Now
                </Button>
                <IconButton
                  size="small"
                  sx={{ display: { xs: "flex", md: "none" } }}
                  onClick={toggle}
                  color="inherit"
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
            <Grid
              container
              spacing={{ xs: 4, md: 6 }}
              alignItems="stretch"
            >
              <Grid item xs={12} md={6}>
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
              <Grid
                item
                xs={12}
                md={6}
                sx={{ display: "flex", mt: { xs: 4, md: 0 } }}
              >
                <Box
                  id="book"
                  sx={{
                    p: { xs: 2.5, md: 4 },
                    borderRadius: 3,
                    border: "1px solid rgba(255,255,255,.12)",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02))",
                    backdropFilter: "blur(6px)",
                    flexGrow: 1,
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

