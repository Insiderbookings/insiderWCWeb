// src/templates/Modern.jsx
import * as React from "react"
import {
  Box, Stack, Typography, Grid, Paper, Chip, Button, Divider,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined"
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined"
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined"
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import ModernLayout from "./Layout"
import Availability from "./Availability"

const fullAddress = (loc) =>
  !loc ? "" : [loc.address, loc.city, loc.zipCode, loc.country].filter(Boolean).join(", ")

export default function Modern({ cfg = {}, hotel = {} }) {
  const theme = useTheme()
  const surface = theme.palette.background.paper
  const textSecondary = theme.palette.text.secondary

  const address = fullAddress(hotel?.location)
  const email = hotel?.contact?.email || ""
  const phone = hotel?.contact?.telephone || ""

  return (
    <ModernLayout cfg={cfg} hotel={hotel}>
      {/* ⚠️ Sin hero aquí: vive en modern/layout.jsx */}

      {/* AMENITIES (look claro/minimal) */}
      <Box id="amenities" sx={{ mb: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 2 }}>Amenities</Typography>
        <Grid container spacing={2}>
          {[
            { icon: <RestaurantOutlinedIcon />, label: "Seasonal dining" },
            { icon: <SpaOutlinedIcon />, label: "Wellness & spa" },
            { icon: <Chip label="24/7" />, label: "Concierge" },
            { icon: <Chip label="Wi-Fi" />, label: "High-speed Wi-Fi" },
          ].map((a, i) => (
            <Grid key={i} item xs={12} sm={6} md={3}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box sx={{ display: "grid", placeItems: "center" }}>{a.icon}</Box>
                  <Typography>{a.label}</Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* AVAILABILITY — cards propias de Modern */}
      <Availability hotel={hotel} />

      {/* LOCATION & CONTACT (light) */}
      <Box id="location" sx={{ mt: 8 }}>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: "100%", display: "grid", placeItems: "center", color: textSecondary }}>
              <Typography>Map embed (placeholder)</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 1.5 }}>Contact</Typography>
              <Stack spacing={1.2} sx={{ fontSize: 14 }}>
                {address && (
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <RoomOutlinedIcon color="primary" /><Typography>{address}</Typography>
                  </Stack>
                )}
                {phone && (
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <LocalPhoneOutlinedIcon color="primary" /><Typography>{phone}</Typography>
                  </Stack>
                )}
                {email && (
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <MailOutlineIcon color="primary" /><Typography>{email}</Typography>
                  </Stack>
                )}
              </Stack>
              <Button variant="text" href="#availability" sx={{ mt: 2 }}>Check availability</Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </ModernLayout>
  )
}
