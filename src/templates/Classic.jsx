// src/themes/Classic.jsx
import * as React from 'react'
import {
  AppBar, Toolbar, Container, Box, Stack, Typography, IconButton, Button, Link, Badge
} from '@mui/material'
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen' // lo usamos como "X/Twitter"
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import MenuIcon from '@mui/icons-material/Menu'

export default function Classic({ cfg, hotel }) {
  const primary = cfg.primaryColor || '#d4af37'
  const secondary = cfg.secondaryColor || '#0b0e13'
  const font = cfg.fontFamily || 'Inter, system-ui, sans-serif'
  const ex = cfg?.extra || {}

  const pages = ['HOME', 'DARK', 'ROOMS & SUITES', 'PAGES', 'NEWS', 'CONTACT']

  const hero = {
    title: hotel.hotelName || 'Hotel',
    subtitle: hotel.descriptions || 'Descripcion',
    image: ex.heroImage || 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1800&auto=format&fit=crop',
    ctaText: ex.heroCtaText || 'BOOK NOW',
    ctaHref: ex.heroCtaHref || '#book'
  }

  return (
    <Box sx={{ fontFamily: font, bgcolor: secondary, color: '#fff' }}>
      {/* ===== NAV (transparente) ===== */}
      <AppBar
        position="absolute"
        elevation={0}
        sx={{
          top: 0, left: 0, right: 0,
          bgcolor: 'transparent',
          color: '#fff',
          borderBottom: '1px solid rgba(255,255,255,.08)',
        }}
      >
        {/* --- Top bar --- */}
        <Box sx={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <Container maxWidth="xl">
            <Toolbar
              variant="dense"
              sx={{
                px: 0,
                minHeight: 56,
                justifyContent: 'space-between',
                color: 'rgba(255,255,255,.8)',
              }}
            >
              {/* Social left */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Link
                  href="#"
                  underline="none"
                  sx={{
                    display: 'flex',            // 👈 asegura centrado vertical
                    alignItems: 'center',
                    color: 'inherit',
                    '&:hover': { color: primary }
                  }}
                >
                  <FacebookRoundedIcon fontSize="small" />
                </Link>

                <Link
                  href="#"
                  underline="none"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'inherit',
                    '&:hover': { color: primary }
                  }}
                >
                  <InstagramIcon fontSize="small" />
                </Link>

                <Link
                  href="#"
                  underline="none"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'inherit',
                    '&:hover': { color: primary }
                  }}
                >
                  <LinkedInIcon fontSize="small" />
                </Link>

                <Link
                  href="#"
                  underline="none"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'inherit',
                    '&:hover': { color: primary }
                  }}
                >
                  <CloseFullscreenIcon fontSize="small" sx={{ transform: 'rotate(45deg)' }} />
                </Link>
              </Stack>

              {/* Contact right */}
              <Stack direction="row" spacing={3} alignItems="center" sx={{ fontSize: 13 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <MailOutlineIcon sx={{ fontSize: 16, color: primary }} />
                  <span>{hotel?.contact?.email}</span>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <RoomOutlinedIcon sx={{ fontSize: 16, color: primary }} />
                  <span>{hotel?.location?.address}</span>
                </Stack>
              </Stack>
            </Toolbar>
          </Container>
        </Box>

        {/* --- Main bar --- */}
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              minHeight: 68,
              px: 0,
              position: 'relative',
            }}
          >
            {/* Left: Logo */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ zIndex: 2 }}>
              {cfg.logoUrl
                ? (
                  <Box component="img" src={cfg.logoUrl} alt="logo"
                    sx={{ width: 42, height: 42, objectFit: 'contain' }} />
                )
                : (
                  <Box sx={{
                    width: 42, height: 42,
                    borderRadius: '8px',
                    bgcolor: 'transparent',
                    border: `2px solid ${primary}`
                  }} />
                )
              }
            </Stack>

            {/* Center: Menu (absolute centrado) */}
            <Stack
              direction="row"
              spacing={3}
              alignItems="center"
              sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                display: { xs: 'none', md: 'flex' },
              }}
            >
              {pages.map((p) => (
                <Button
                  key={p}
                  endIcon={<Box component="span" sx={{
                    width: 6, height: 6, borderRadius: '50%',
                    bgcolor: 'transparent', ml: .5
                  }} />}
                  sx={{
                    color: '#fff',
                    fontWeight: 700,
                    letterSpacing: .6,
                    '&:hover': { color: primary, background: 'transparent' }
                  }}
                >
                  {p}
                </Button>
              ))}
            </Stack>

            {/* Right: icons */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ marginLeft: 'auto', zIndex: 2 }}>
              <IconButton color="inherit" sx={{ '&:hover': { color: primary } }}>
                <SearchIcon />
              </IconButton>
              <IconButton color="inherit" sx={{ '&:hover': { color: primary } }}>
                <Badge badgeContent={0} color="default" overlap="circular">
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit" sx={{ display: { xs: 'inline-flex', md: 'inline-flex' }, '&:hover': { color: primary } }}>
                <MenuIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* ===== HERO ===== */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 520, md: 720 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          backgroundImage: `url(${hero.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          px: 2
        }}
      >
        {/* overlay y viñetas similares a tu versión */}
        <Box sx={{
          position: 'absolute', inset: 0,
          background:
            `radial-gradient(1200px 520px at 15% 50%, rgba(0,0,0,.0) 0%, rgba(0,0,0,.35) 60%, rgba(0,0,0,.65) 100%),
             linear-gradient(180deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,.55) 70%, rgba(0,0,0,.65) 100%)`
        }} />

        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 900 }}>
          <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: '.5px' }}>
            {hero.title}
          </Typography>
          <Typography sx={{ mt: 1.5, opacity: .9 }}>
            {hero.subtitle}
          </Typography>
          <Button
            href={hero.ctaHref}
            size="large"
            sx={{
              mt: 3, px: 4, borderRadius: 2,
              bgcolor: primary, color: '#111', fontWeight: 800,
              '&:hover': { bgcolor: primary }
            }}
          >
            {hero.ctaText}
          </Button>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }} />
    </Box>
  )
}
