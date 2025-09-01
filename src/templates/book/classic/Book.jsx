import * as React from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { Box, Typography, CssBaseline } from "@mui/material"
import BookingForm from "../../../components/BookingForm"

export default function ClassicBook({ cfg = {}, hotel = {} }) {
  const primary = cfg.primaryColor || "#d4af37"
  const secondary = cfg.secondaryColor || "#0b0e13"
  const font = cfg.fontFamily || "Inter, system-ui, sans-serif"

  const theme = createTheme({
    typography: { fontFamily: font },
    palette: {
      mode: 'dark',
      primary: { main: primary },
      background: { default: secondary, paper: secondary },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 12, textTransform: 'none', fontWeight: 800 },
        },
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: secondary, color: "#fff", minHeight: "100vh", p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Book your stay {hotel?.hotelName ? `at ${hotel.hotelName}` : ""}
        </Typography>
        <BookingForm cfg={cfg} hotel={hotel} />
      </Box>
    </ThemeProvider>
  )
}
