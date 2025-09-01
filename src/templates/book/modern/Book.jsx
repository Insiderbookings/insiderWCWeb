import * as React from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { Box, Typography, CssBaseline } from "@mui/material"
import BookingForm from "../../../components/BookingForm"

export default function ModernBook({ cfg = {}, hotel = {} }) {
  const primary = cfg.primaryColor || "#0EA5E9"
  const surface = "#ffffff"
  const background = cfg.secondaryColor || "#F6F7FB"
  const font = cfg.fontFamily || "Inter, system-ui, sans-serif"

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
        styleOverrides: { root: { border: "1px solid rgba(2,6,23,0.06)" } },
      },
      MuiButton: {
        styleOverrides: { root: { borderRadius: 12 } },
      },
      MuiAppBar: {
        styleOverrides: { root: { backdropFilter: "saturate(140%) blur(6px)" } },
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: background, color: "text.primary", p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Book your stay {hotel?.hotelName ? `at ${hotel.hotelName}` : ""}
        </Typography>
        <BookingForm cfg={cfg} hotel={hotel} />
      </Box>
    </ThemeProvider>
  )
}
