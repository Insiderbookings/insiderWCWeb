"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { createVaultPaymentIntent, confirmVaultPayment } from "../../api/booking.js"

/* ------------------- Helpers ------------------- */

const ROOMS = [
  {
    id: "king",
    name: "King Room",
    price: 140,
    description:
      "Sophisticated sanctuary with floor-to-ceiling windows, premium Italian linens, and curated workspace.",
    features: ["1 king bed", "Panoramic city views", "Rainfall shower", '55" smart TV', "Nespresso machine"],
    image: "https://insidermedia.s3.us-east-1.amazonaws.com/miniown/5958550121815854232.jpg",
  },
  {
    id: "double-queen",
    name: "Double Queen Room",
    price: 150,
    description:
      "Spacious retreat perfect for families or friends with two plush queen beds and generous living space.",
    features: ["2 queen beds", "Lounge seating area", "Walk-in closet", "Complimentary minibar", "Smart home controls"],
    image: "https://insidermedia.s3.us-east-1.amazonaws.com/miniown/5958550121815854215.jpg",
  },
  {
    id: "suite",
    name: "Signature Suite",
    price: 190,
    description: "Expansive open-concept suite with separate living area, soaking tub, and premium amenities.",
    features: [
      "King bed + sofa bed",
      "Separate living room",
      "Free-standing tub",
      "Nespresso station",
      "Private balcony",
    ],
    image: "https://insidermedia.s3.us-east-1.amazonaws.com/miniown/5958550121815854226.jpg",
  },
]

const todayISO = () => {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now.toISOString().slice(0, 10)
}

const addDaysISO = (isoDate, days) => {
  const base = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(base)) return isoDate
  base.setDate(base.getDate() + days)
  return base.toISOString().slice(0, 10)
}

const computeNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 1
  const start = new Date(`${checkIn}T00:00:00`)
  const end = new Date(`${checkOut}T00:00:00`)
  const diff = (end - start) / 86_400_000
  return Number.isFinite(diff) && diff > 0 ? Math.round(diff) : 1
}

const formatCurrency = (value, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value)

const DEFAULT_CHECK_IN = todayISO()
const DEFAULT_CHECK_OUT = addDaysISO(DEFAULT_CHECK_IN, 2)

const normalizeLocation = (loc, fallback = "Sumter, SC") => {
  if (!loc) return fallback
  if (typeof loc === "string") return loc
  if (typeof loc === "object") {
    const { address, city, zipCode, country } = loc
    return [address, city, zipCode, country].filter(Boolean).join(", ") || fallback
  }
  return fallback
}

// ---- Escalado opcional de hojas de estilo (por si querés reutilizar) ----
const scalePxValueInString = (value, ratio) => {
  if (typeof value !== "string") return value
  return value.replace(/(-?\d*\.?\d+)px/g, (_, numeric) => {
    const scaled = parseFloat(numeric) * ratio
    if (!Number.isFinite(scaled)) return `${numeric}px`
    const normalized = parseFloat(scaled.toFixed(2))
    return `${normalized}px`
  })
}

const scaleStyleSheet = (stylesObject, ratio = 1) => {
  if (ratio === 1) return stylesObject

  const applyScale = (node) => {
    if (Array.isArray(node)) return node.map(applyScale)
    if (node && typeof node === "object") {
      return Object.fromEntries(Object.entries(node).map(([key, val]) => [key, applyScale(val)]))
    }
    return scalePxValueInString(node, ratio)
  }

  return applyScale(stylesObject)
}

/* ------------------- Component ------------------- */

const DESKTOP_SCALE_RATIO = 0.88

export default function MiniownLandingPage({ cfg = {}, hotel = {} }) {
  const stripeRef = useRef(null)
  const elementsRef = useRef(null)
  const cardElementRef = useRef(null)
  const cardChangeUnsubRef = useRef(null)
  const STRIPE_PK = import.meta.env.VITE_STRIPE_PK || ""

  const [selectedRoomId, setSelectedRoomId] = useState(ROOMS[0].id)
  const [checkIn, setCheckIn] = useState(DEFAULT_CHECK_IN)
  const [checkOut, setCheckOut] = useState(DEFAULT_CHECK_OUT)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [confirmEmail, setConfirmEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")

  const [error, setError] = useState("")
  const [cardError, setCardError] = useState("")
  const [isProcessing, setProcessing] = useState(false)
  const [stripeReady, setStripeReady] = useState(false)
  const [success, setSuccess] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  // NEW: real mobile detection (<= 768px)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(max-width: 768px)")
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener?.("change", apply)
    return () => mq.removeEventListener?.("change", apply)
  }, [])

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Stripe bootstrapping (single card Element)
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!STRIPE_PK) {
      setStripeReady(false)
      return
    }

    let cancelled = false

    const mountStripe = async () => {
      if (!window.Stripe) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script")
          script.src = "https://js.stripe.com/v3"
          script.async = true
          script.onload = resolve
          script.onerror = () => reject(new Error("Stripe.js failed to load"))
          document.head.appendChild(script)
        })
      }
      if (cancelled) return

      if (!stripeRef.current) stripeRef.current = window.Stripe(STRIPE_PK)
      if (!elementsRef.current) elementsRef.current = stripeRef.current.elements()

      if (!cardElementRef.current) {
        const card = elementsRef.current.create("card", {
          style: {
            base: {
              fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
              color: "rgb(28, 25, 23)",
              fontSize: "16px", // 16px avoids iOS zoom
            },
            invalid: { color: "#dc2626" },
          },
          hidePostalCode: true,
        })
        cardElementRef.current = card

        const onChange = (event) => setCardError(event.error?.message || "")
        card.on("change", onChange)
        cardChangeUnsubRef.current = () => card.off("change", onChange)
      }

      const container = document.getElementById("miniown-card-element")
      if (container) {
        // ensure single mount
        container.innerHTML = ""
        cardElementRef.current.mount(container)
      }

      setStripeReady(true)
    }

    mountStripe().catch((err) => {
      console.error(err)
      setError(err.message || "We couldn't initialize the payment form.")
    })

    return () => {
      cancelled = true
      if (cardElementRef.current) {
        try {
          cardElementRef.current.unmount()
        } catch {}
      }
    }
  }, [STRIPE_PK])

  const selectedRoom = useMemo(() => ROOMS.find((room) => room.id === selectedRoomId) || ROOMS[0], [selectedRoomId])
  const nights = useMemo(() => computeNights(checkIn, checkOut), [checkIn, checkOut])
  const total = useMemo(() => selectedRoom.price * nights, [selectedRoom.price, nights])

  const hotelName = hotel?.name || cfg.propertyName || "Miniown Hotel"
  const hotelLocationStr = normalizeLocation(hotel?.location || cfg.location)

  const validateForm = () => {
    if (!fullName.trim()) return "Guest full name is required."
    const emailTrim = email.trim().toLowerCase()
    if (!emailTrim) return "Please enter a valid email address."
    if (emailTrim !== confirmEmail.trim().toLowerCase()) return "Email and confirmation do not match."
    if (!phone.trim()) return "Please enter a contact phone number."
    if (!checkIn) return "Choose a check-in date."
    if (!checkOut) return "Choose a check-out date."
    if (new Date(`${checkOut}T00:00:00`) <= new Date(`${checkIn}T00:00:00`)) return "Check-out must be after check-in."
    if (!stripeReady || !stripeRef.current || !cardElementRef.current) return "Payment form is still preparing."
    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setCardError("")
    setSuccess(null)

    const validation = validateForm()
    if (validation) {
      setError(validation)
      return
    }

    const stripe = stripeRef.current
    const card = cardElementRef.current
    if (!stripe || !card) {
      setError("Stripe is not ready yet. Please try again in a moment.")
      return
    }

    const adultsNumber = Math.max(1, Number(adults) || 1)
    const childrenNumber = Math.max(0, Number(children) || 0)

    setProcessing(true)
    try {
      const intentResponse = await createVaultPaymentIntent({
        amount: total,
        currency: "USD",
        source: "VAULT",
        guestInfo: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          specialRequests: specialRequests.trim() || undefined,
        },
        bookingData: {
          checkIn,
          checkOut,
          adults: adultsNumber,
          children: childrenNumber,
          roomId: selectedRoom.id,
          roomName: selectedRoom.name,
          roomType: selectedRoom.name,
          roomImage: selectedRoom.image,
          hotelName,
          hotelAddress:
            typeof hotel.address === "string" ? hotel.address : normalizeLocation(hotel.location || cfg.location),
          nights,
          nightlyRate: selectedRoom.price,
          totalAmount: total,
          rooms: 1,
        },
      })

      const clientSecret = intentResponse?.clientSecret
      if (!clientSecret) throw new Error("Could not start the payment with Stripe.")

      const confirmation = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: fullName.trim(),
            email: email.trim(),
            phone: phone.trim() || undefined,
          },
        },
      })

      if (confirmation.error) throw new Error(confirmation.error.message || "The bank rejected the transaction.")

      const paymentIntentId = intentResponse.paymentIntentId || confirmation.paymentIntent?.id
      const confirmResponse = await confirmVaultPayment({
        paymentIntentId,
        bookingRef: intentResponse.bookingRef,
      })

      try {
        card.clear?.()
      } catch {}

      setSuccess({
        bookingCode: confirmResponse?.bookingData?.bookingID || intentResponse.bookingRef || paymentIntentId || "",
        email: email.trim(),
        checkIn,
        checkOut,
        nights,
        roomName: selectedRoom.name,
        amount: total,
        currency: intentResponse?.currency || "USD",
      })
    } catch (err) {
      console.error(err)
      setError(err?.message || "We couldn't complete your reservation. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  const handleRoomSelect = (roomId) => {
    setSelectedRoomId(roomId)
    const target = document.getElementById("booking")
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  /* ------------------- Styles (responsive via isMobile) ------------------- */

  const styles = useMemo(() => {
    // spacing helpers
    const containerWidth = isMobile ? "100%" : "1400px"
    const sectionPadY = isMobile ? "72px" : "120px"
    const sidePad = isMobile ? "16px" : "32px"

    const ratio = isMobile ? 1 : DESKTOP_SCALE_RATIO

    const baseStyles = {
      header: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? "rgba(250,248,246,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgb(231,219,208)" : "1px solid transparent",
        transition: "all 0.3s ease",
      },
      headerInner: {
        maxWidth: containerWidth,
        margin: "0 auto",
        padding: `${isMobile ? 12 : 20}px ${sidePad}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      },
      logo: {
        fontFamily: "var(--font-serif)",
        fontSize: isMobile ? "20px" : "24px",
        fontWeight: 700,
        color: scrolled ? "rgb(28,25,23)" : "rgb(250,248,246)",
        letterSpacing: "0.02em",
        transition: "color 0.3s ease",
      },
      nav: {
        display: isMobile ? "none" : "flex",
        gap: "32px",
        alignItems: "center",
      },
      navLink: {
        color: scrolled ? "rgb(120,113,108)" : "rgba(250,248,246,0.9)",
        textDecoration: "none",
        fontSize: "15px",
        fontWeight: 500,
        transition: "color 0.2s ease",
        cursor: "pointer",
      },
      hero: {
        position: "relative",
        minHeight: isMobile ? "72vh" : "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgb(196,113,87)",
        overflow: "hidden",
      },
      heroImage: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        filter: "saturate(0.8) brightness(0.82) contrast(0.96)",
      },
      heroOverlay: {
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.35) 100%)",
        pointerEvents: "none",
      },
      heroContent: {
        position: "relative",
        zIndex: 2,
        textAlign: "center",
        maxWidth: isMobile ? "92%" : "900px",
        padding: `0 ${sidePad}`,
        color: "rgb(250,248,246)",
        textShadow: "0 2px 20px rgba(0,0,0,0.35)",
      },
      heroTitle: {
        fontFamily: "var(--font-serif)",
        fontSize: isMobile ? "40px" : "clamp(48px, 8vw, 96px)",
        fontWeight: 700,
        marginBottom: isMobile ? "16px" : "24px",
        lineHeight: 1.05,
        letterSpacing: "-0.02em",
      },
      heroSubtitle: {
        fontSize: isMobile ? "16px" : "clamp(18px, 2.5vw, 24px)",
        lineHeight: 1.6,
        margin: "0 auto",
        marginBottom: isMobile ? "28px" : "48px",
        opacity: 0.95,
        maxWidth: "700px",
      },
      primaryButton: {
        padding: isMobile ? "14px 24px" : "18px 48px",
        borderRadius: "999px",
        border: "2px solid rgb(250,248,246)",
        background: "transparent",
        color: "rgb(250,248,246)",
        fontWeight: 600,
        fontSize: "16px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        letterSpacing: "0.02em",
        minHeight: 44, // touch target
      },
      section: {
        padding: `${sectionPadY} ${sidePad}`,
        maxWidth: containerWidth,
        margin: "0 auto",
      },
      sectionTitle: {
        fontFamily: "var(--font-serif)",
        fontSize: isMobile ? "32px" : "clamp(36px,5vw,56px)",
        fontWeight: 700,
        marginBottom: "12px",
        textAlign: "center",
        letterSpacing: "-0.01em",
      },
      sectionSubtitle: {
        fontSize: isMobile ? "16px" : "18px",
        color: "rgb(120,113,108)",
        textAlign: "center",
        maxWidth: "700px",
        margin: "0 auto 56px",
        lineHeight: 1.7,
      },
      // Discover grid (first gallery)
      discoverGrid: {
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
        gap: isMobile ? "14px" : "20px",
        maxWidth: containerWidth,
        margin: "0 auto",
      },
      galleryItem: {
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "pointer",
        background: "rgb(245,237,230)",
        height: "100%",
      },
      galleryImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transition: "transform 0.5s ease",
        display: "block",
      },
      galleryCaption: {
        position: "absolute",
        bottom: "16px",
        left: "16px",
        background: "rgba(255,255,255,0.95)",
        color: "rgb(28,25,23)",
        padding: "10px 14px",
        borderRadius: "8px",
        fontWeight: 600,
        fontSize: "14px",
        letterSpacing: "0.02em",
        opacity: 0,
        transform: "translateY(10px)",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      },
      roomsGrid: {
        display: "grid",
        gap: isMobile ? "20px" : "48px",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(350px, 1fr))",
      },
      roomCard: {
        background: "rgb(255,255,255)",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(28,25,23,0.08)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
      },
      roomImage: {
        width: "100%",
        height: isMobile ? "220px" : "280px",
        objectFit: "cover",
        display: "block",
      },
      roomBody: {
        padding: isMobile ? "20px" : "32px",
      },
      roomName: {
        fontFamily: "var(--font-serif)",
        fontSize: isMobile ? "24px" : "28px",
        fontWeight: 700,
        marginBottom: "10px",
      },
      roomDescription: {
        color: "rgb(120,113,108)",
        lineHeight: 1.7,
        marginBottom: "18px",
        fontSize: isMobile ? "15px" : "16px",
      },
      featureList: {
        listStyle: "none",
        padding: 0,
        margin: "0 0 22px 0",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      },
      featureItem: { display: "flex", alignItems: "center", gap: "12px", color: "rgb(120,113,108)", fontSize: "15px" },
      priceRow: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "16px" },
      price: { fontFamily: "var(--font-serif)", fontSize: isMobile ? "28px" : "32px", fontWeight: 700, color: "rgb(196,113,87)" },
      perNight: { fontSize: "14px", color: "rgb(120,113,108)" },
      selectButton: {
        width: "100%",
        padding: "16px",
        borderRadius: "12px",
        border: "2px solid rgb(196,113,87)",
        background: "transparent",
        color: "rgb(196,113,87)",
        fontWeight: 600,
        fontSize: "16px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        minHeight: 44,
      },
      selectButtonActive: { background: "rgb(196,113,87)", color: "rgb(255,255,255)" },

      // Location
      locationSection: { background: "rgb(255,255,255)", padding: `${sectionPadY} ${sidePad}` },
      locationGrid: {
        maxWidth: containerWidth,
        margin: "0 auto",
        display: "grid",
        gap: isMobile ? "24px" : "64px",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        alignItems: "center",
      },
      locationContent: { paddingRight: isMobile ? 0 : "40px" },
      locationTitle: {
        fontFamily: "var(--font-serif)",
        fontSize: isMobile ? "28px" : "clamp(36px,5vw,48px)",
        fontWeight: 700,
        marginBottom: isMobile ? "12px" : "24px",
        letterSpacing: "-0.01em",
      },
      locationAddress: {
        fontSize: isMobile ? "18px" : "20px",
        color: "rgb(196,113,87)",
        fontWeight: 600,
        marginBottom: isMobile ? "20px" : "32px",
        lineHeight: 1.6,
      },
      locationDetails: { display: "flex", flexDirection: "column", gap: "16px" },
      locationItem: { display: "flex", alignItems: "flex-start", gap: "14px" },
      locationIcon: { width: "24px", height: "24px", flexShrink: 0, marginTop: "2px" },
      locationText: { color: "rgb(120,113,108)", lineHeight: 1.7, fontSize: isMobile ? "15px" : "16px" },
      mapPlaceholder: {
        width: "100%",
        height: isMobile ? "320px" : "500px",
        borderRadius: "24px",
        background: "rgb(245,237,230)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      },

      // Booking
      bookingSection: { background: "rgb(245,237,230)", padding: `${sectionPadY} ${sidePad}` },
      bookingWrap: { maxWidth: containerWidth, margin: "0 auto" },
      bookingGrid: {
        display: "grid",
        gap: isMobile ? "20px" : "48px",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1.5fr",
      },
      summaryCard: {
        background: "rgb(28,25,23)",
        color: "rgb(250,248,246)",
        borderRadius: "24px",
        padding: isMobile ? "24px" : "40px",
        height: "fit-content",
        position: isMobile ? "static" : "sticky",
        top: isMobile ? undefined : "120px",
      },
      summaryTitle: { fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 700, marginBottom: "24px" },
      summaryRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "16px",
        paddingBottom: "16px",
        borderBottom: "1px solid rgba(250,248,246,0.1)",
        fontSize: isMobile ? "14px" : "15px",
      },
      summaryLabel: { opacity: 0.7 },
      summaryValue: { fontWeight: 600 },
      summaryTotal: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "24px",
        paddingTop: "24px",
        borderTop: "2px solid rgba(250,248,246,0.2)",
      },
      totalLabel: { fontSize: "18px", fontWeight: 600 },
      totalAmount: { fontFamily: "var(--font-serif)", fontSize: isMobile ? "28px" : "36px", fontWeight: 700 },

      formCard: {
        background: "rgb(255,255,255)",
        borderRadius: "24px",
        padding: isMobile ? "24px" : "48px",
        boxShadow: "0 4px 24px rgba(28,25,23,0.08)",
      },
      formTitle: { fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: 700, marginBottom: "10px" },
      formSubtitle: { color: "rgb(120,113,108)", marginBottom: "28px", lineHeight: 1.6, fontSize: "15px" },
      label: { display: "block", fontWeight: 600, marginBottom: "8px", fontSize: "14px", letterSpacing: "0.01em" },
      input: {
        width: "100%",
        borderRadius: "12px",
        border: "1px solid rgb(231,219,208)",
        padding: "14px 16px",
        fontSize: 16, // iOS no-zoom
        background: "rgb(255,255,255)",
        transition: "border-color 0.2s ease",
        minHeight: 44,
      },
      textarea: {
        width: "100%",
        borderRadius: "12px",
        border: "1px solid rgb(231,219,208)",
        padding: "14px 16px",
        fontSize: 16,
        minHeight: "120px",
        resize: "vertical",
        background: "rgb(255,255,255)",
        fontFamily: "inherit",
      },
      submitButton: {
        width: "100%",
        padding: "18px",
        borderRadius: "12px",
        border: "none",
        fontWeight: 600,
        fontSize: "16px",
        background: "rgb(196,113,87)",
        color: "rgb(255,255,255)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        letterSpacing: "0.02em",
        minHeight: 48,
      },
      errorBox: {
        background: "rgb(254,226,226)",
        color: "rgb(185,28,28)",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "20px",
        fontSize: "14px",
      },
      successBox: {
        background: "rgb(236,253,243)",
        color: "rgb(21,128,61)",
        borderRadius: "16px",
        padding: "20px",
        marginTop: "24px",
        border: "1px solid rgba(34,197,94,0.3)",
      },

      // Footer
      footer: { background: "rgb(28,25,23)", color: "rgb(250,248,246)", padding: `${isMobile ? 56 : 80}px ${sidePad} 40px` },
      footerContent: {
        maxWidth: containerWidth,
        margin: "0 auto",
        display: "grid",
        gap: isMobile ? "32px" : "64px",
        gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr",
        marginBottom: isMobile ? "40px" : "64px",
      },
      footerBrand: { fontFamily: "var(--font-serif)", fontSize: isMobile ? "28px" : "32px", fontWeight: 700, marginBottom: "12px" },
      footerText: { opacity: 0.7, lineHeight: 1.7, fontSize: isMobile ? "14px" : "16px" },
      footerTitle: {
        fontWeight: 600,
        marginBottom: "16px",
        fontSize: "15px",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      },
      footerLink: {
        display: "block",
        color: "rgba(250,248,246,0.7)",
        textDecoration: "none",
        marginBottom: "10px",
        transition: "color 0.2s ease",
        fontSize: "15px",
      },
      footerBottom: {
        maxWidth: containerWidth,
        margin: "0 auto",
        paddingTop: "24px",
        borderTop: "1px solid rgba(250,248,246,0.1)",
        textAlign: "center",
        opacity: 0.6,
        fontSize: "14px",
      },
    }

    // Aplicamos el escalado en desktop
    return scaleStyleSheet(baseStyles, ratio)
  }, [isMobile, scrolled])

  /* ------------------- Render ------------------- */

  const RoomsGrid = (
    <div style={styles.roomsGrid}>
      {ROOMS.map((room) => (
        <article
          key={room.id}
          style={styles.roomCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)"
            e.currentTarget.style.boxShadow = "0 12px 48px rgba(28,25,23,0.12)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 4px 24px rgba(28,25,23,0.08)"
          }}
        >
          <img src={room.image || "/placeholder.svg"} alt={room.name} style={styles.roomImage} />
          <div style={styles.roomBody}>
            <h3 style={styles.roomName}>{room.name}</h3>
            <p style={styles.roomDescription}>{room.description}</p>
            <ul style={styles.featureList}>
              {room.features.map((feature) => (
                <li key={feature} style={styles.featureItem}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <circle cx="10" cy="10" r="10" fill="rgb(196,113,87)" opacity="0.2" />
                    <path d="M6 10l3 3 5-6" stroke="rgb(196,113,87)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <div style={styles.priceRow}>
              <div>
                <span style={styles.price}>{formatCurrency(room.price)}</span>
                <span style={styles.perNight}> / night</span>
              </div>
            </div>
            <button
              onClick={() => handleRoomSelect(room.id)}
              style={{
                ...styles.selectButton,
                ...(room.id === selectedRoomId ? styles.selectButtonActive : {}),
              }}
              onMouseEnter={(e) => {
                if (room.id !== selectedRoomId) {
                  e.currentTarget.style.background = "rgb(196,113,87)"
                  e.currentTarget.style.color = "rgb(255,255,255)"
                }
              }}
              onMouseLeave={(e) => {
                if (room.id !== selectedRoomId) {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = "rgb(196,113,87)"
                }
              }}
              aria-pressed={room.id === selectedRoomId}
            >
              {room.id === selectedRoomId ? "Selected" : "Select Room"}
            </button>
          </div>
        </article>
      ))}
    </div>
  )

  const BookingSummary = (
    <aside style={styles.summaryCard} aria-label="Booking summary">
      <h3 style={styles.summaryTitle}>Booking Summary</h3>
      <div style={styles.summaryRow}>
        <span style={styles.summaryLabel}>Room</span>
        <span style={styles.summaryValue}>{selectedRoom.name}</span>
      </div>
      <div style={styles.summaryRow}>
        <span style={styles.summaryLabel}>Check-in</span>
        <span style={styles.summaryValue}>{checkIn}</span>
      </div>
      <div style={styles.summaryRow}>
        <span style={styles.summaryLabel}>Check-out</span>
        <span style={styles.summaryValue}>{checkOut}</span>
      </div>
      <div style={styles.summaryRow}>
        <span style={styles.summaryLabel}>Nights</span>
        <span style={styles.summaryValue}>{nights}</span>
      </div>
      <div style={styles.summaryRow}>
        <span style={styles.summaryLabel}>Guests</span>
        <span style={styles.summaryValue}>
          {adults} adult{adults !== 1 ? "s" : ""}{children > 0 ? `, ${children} child${children !== 1 ? "ren" : ""}` : ""}
        </span>
      </div>
      <div style={styles.summaryRow}>
        <span style={styles.summaryLabel}>Rate per night</span>
        <span style={styles.summaryValue}>{formatCurrency(selectedRoom.price)}</span>
      </div>
      <div style={styles.summaryTotal}>
        <span style={styles.totalLabel}>Total</span>
        <span style={styles.totalAmount}>{formatCurrency(total)}</span>
      </div>
      <p style={{ fontSize: "13px", opacity: 0.7, marginTop: "12px", lineHeight: 1.6 }}>
        All taxes and fees included. Free cancellation up to 72 hours before check-in.
      </p>
    </aside>
  )

  const BookingForm = (
    <form id="booking-form" style={styles.formCard} onSubmit={handleSubmit}>
      <h3 style={styles.formTitle}>Guest Information</h3>
      <p style={styles.formSubtitle}>Please provide your details to complete the reservation.</p>

      {error && <div style={styles.errorBox} role="alert">{error}</div>}
      {cardError && (
        <div style={{ ...styles.errorBox, background: "rgb(254,243,199)", color: "rgb(146,64,14)" }} role="alert">
          {cardError}
        </div>
      )}

      {/* Stay Details */}
      <div style={{ marginBottom: "28px" }}>
        <h4 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "18px" }}>Stay Details</h4>
        <div
          style={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          <div>
            <label style={styles.label} htmlFor="miniown-check-in">Check-in</label>
            <input
              id="miniown-check-in"
              type="date"
              required
              value={checkIn}
              onChange={(e) => {
                const value = e.target.value
                setCheckIn(value)
                if (new Date(`${value}T00:00:00`) >= new Date(`${checkOut}T00:00:00`)) {
                  setCheckOut(addDaysISO(value, 2))
                }
              }}
              style={styles.input}
              onFocus={(e) => (e.target.style.borderColor = "rgb(196,113,87)")}
              onBlur={(e) => (e.target.style.borderColor = "rgb(231,219,208)")}
            />
          </div>
          <div>
            <label style={styles.label} htmlFor="miniown-check-out">Check-out</label>
            <input
              id="miniown-check-out"
              type="date"
              required
              min={addDaysISO(checkIn, 1)}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              style={styles.input}
              onFocus={(e) => (e.target.style.borderColor = "rgb(196,113,87)")}
              onBlur={(e) => (e.target.style.borderColor = "rgb(231,219,208)")}
            />
          </div>
          <div>
            <label style={styles.label} htmlFor="miniown-adults">Adults</label>
            <input
              id="miniown-adults"
              type="number"
              min={1}
              value={adults}
              onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))}
              style={styles.input}
              onFocus={(e) => (e.target.style.borderColor = "rgb(196,113,87)")}
              onBlur={(e) => (e.target.style.borderColor = "rgb(231,219,208)")}
            />
          </div>
          <div>
            <label style={styles.label} htmlFor="miniown-children">Children</label>
            <input
              id="miniown-children"
              type="number"
              min={0}
              value={children}
              onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))}
              style={styles.input}
              onFocus={(e) => (e.target.style.borderColor = "rgb(196,113,87)")}
              onBlur={(e) => (e.target.style.borderColor = "rgb(231,219,208)")}
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div style={{ marginBottom: "28px" }}>
        <h4 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "18px" }}>Contact Information</h4>
        <div style={{ display: "grid", gap: "16px" }}>
          <div>
            <label style={styles.label} htmlFor="miniown-full-name">Full Name</label>
            <input
              id="miniown-full-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              style={styles.input}
              onFocus={(e) => (e.target.style.borderColor = "rgb(196,113,87)")}
              onBlur={(e) => (e.target.style.borderColor = "rgb(231,219,208)")}
            />
          </div>
          <div style={{ display: "grid", gap: "16px", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
            <div>
              <label style={styles.label} htmlFor="miniown-email">Email Address</label>
              <input
                id="miniown-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                style={styles.input}
                onFocus={(e) => (e.target.style.borderColor = "rgb(196,113,87)")}
                onBlur={(e) => (e.target.style.borderColor = "rgb(231,219,208)")}
              />
            </div>
            <div>
              <label style={styles.label} htmlFor="miniown-email-confirm">Confirm Email</label>
              <input
                id="miniown-email-confirm"
                type="email"
                required
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="john@example.com"
                style={styles.input}
                onFocus={(e) => (e.target.style.borderColor = "rgb(196,113,87)")}
                onBlur={(e) => (e.target.style.borderColor = "rgb(231,219,208)")}
              />
            </div>
          </div>
          <div>
            <label style={styles.label} htmlFor="miniown-phone">Phone Number</label>
            <input
              id="miniown-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (803) 856-0916"
              style={styles.input}
              onFocus={(e) => (e.target.style.borderColor = "rgb(196,113,87)")}
              onBlur={(e) => (e.target.style.borderColor = "rgb(231,219,208)")}
            />
          </div>
        </div>
      </div>

      {/* Special Requests */}
      <div style={{ marginBottom: "24px" }}>
        <label style={styles.label} htmlFor="miniown-special">Special Requests (Optional)</label>
        <textarea
          id="miniown-special"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Let us know if you have any special requirements or preferences..."
          style={styles.textarea}
          onFocus={(e) => (e.target.style.borderColor = "rgb(196,113,87)")}
          onBlur={(e) => (e.target.style.borderColor = "rgb(231,219,208)")}
        />
      </div>

      {/* Payment */}
      <div style={{ marginBottom: "24px" }}>
        <h4 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "12px" }}>Payment Information</h4>
        {!STRIPE_PK && (
          <div style={{ ...styles.errorBox, background: "rgb(254,249,195)", color: "rgb(146,64,14)" }}>
            Set the <code>VITE_STRIPE_PK</code> environment variable to enable payments.
          </div>
        )}
        <div
          id="miniown-card-element"
          style={{
            borderRadius: "12px",
            border: "1px solid rgb(231,219,208)",
            padding: "16px",
            background: "rgb(255,255,255)",
          }}
        />
        <p style={{ fontSize: "13px", color: "rgb(120,113,108)", marginTop: "10px", lineHeight: 1.6 }}>
          Your payment information is secure and encrypted.
        </p>
      </div>

      <button
        type="submit"
        style={{
          ...styles.submitButton,
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing || !stripeReady ? "not-allowed" : "pointer",
        }}
        disabled={isProcessing || !stripeReady}
        onMouseEnter={(e) => {
          if (!isProcessing && stripeReady) e.currentTarget.style.background = "rgb(176,93,67)"
        }}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgb(196,113,87)")}
        aria-busy={isProcessing}
      >
        {isProcessing ? "Processing..." : `Complete Booking · ${formatCurrency(total)}`}
      </button>

      {success && (
        <div style={styles.successBox} role="status">
          <h4 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px" }}>Reservation Confirmed!</h4>
          <p style={{ marginBottom: "14px", lineHeight: 1.7 }}>
            Thank you for choosing Miniown Hotel. A confirmation email has been sent to <strong>{success.email}</strong>.
          </p>
          <div style={{ background: "rgba(21,128,61,0.08)", borderRadius: "12px", padding: "16px" }}>
            <div style={{ display: "grid", gap: "8px", fontSize: "15px" }}>
              <div><strong>Booking ID:</strong> {success.bookingCode || "—"}</div>
              <div><strong>Room:</strong> {success.roomName}</div>
              <div><strong>Dates:</strong> {success.checkIn} → {success.checkOut} ({success.nights} night{success.nights === 1 ? "" : "s"})</div>
              <div><strong>Total Paid:</strong> {formatCurrency(success.amount, success.currency)}</div>
            </div>
          </div>
        </div>
      )}
    </form>
  )

  return (
    <div>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>MINIOWN</div>
          <nav style={styles.nav}>
            <a href="#rooms" style={styles.navLink}>Rooms</a>
            <a href="#experience" style={styles.navLink}>Experience</a>
            <a href="#location" style={styles.navLink}>Location</a>
            <a href="#booking" style={styles.navLink}>Book Now</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <img src="/heroimage.jpg" alt="Miniown Hotel" style={styles.heroImage} />
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Where luxury meets authenticity</h1>
          <p style={styles.heroSubtitle}>
            Experience Sumter&apos;s finest boutique hotel. Curated spaces, exceptional service, and unforgettable
            moments in the heart of the city.
          </p>
          <button
            style={styles.primaryButton}
            onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgb(250,248,246)"
              e.currentTarget.style.color = "rgb(196,113,87)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.color = "rgb(250,248,246)"
            }}
          >
            Reserve Your Stay
          </button>
        </div>
      </section>

      {/* Discover / Gallery Section */}
      <section id="discover" style={styles.section}>
        <div style={{ maxWidth: isMobile ? "100%" : "1400px", margin: "0 auto" }}>
          <h2 style={styles.sectionTitle}>Discover Miniown</h2>
          <p style={styles.sectionSubtitle}>
            Every corner of our hotel tells a story. Explore our curated spaces designed for comfort and inspiration.
          </p>

          <div style={styles.discoverGrid}>
            {/* Large Lobby (desktop spans 2 rows) */}
            <div
              style={{
                ...styles.galleryItem,
                gridRow: isMobile ? "auto" : "span 2",
                aspectRatio: isMobile ? "16/10" : "auto",
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector("img")
                const cap = e.currentTarget.querySelector("div")
                if (img) img.style.transform = "scale(1.05)"
                if (cap) { cap.style.opacity = "1"; cap.style.transform = "translateY(0)" }
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector("img")
                const cap = e.currentTarget.querySelector("div")
                if (img) img.style.transform = "scale(1)"
                if (cap) { cap.style.opacity = "0"; cap.style.transform = "translateY(10px)" }
              }}
            >
              <img
                src="https://insidermedia.s3.us-east-1.amazonaws.com/miniown/5958550121815854214.jpg"
                alt="Hotel Lobby"
                style={styles.galleryImage}
              />
              <div style={styles.galleryCaption}>Lobby & Reception</div>
            </div>

            {[
              ["https://insidermedia.s3.us-east-1.amazonaws.com/miniown/5958550121815854223.jpg", "Rooftop Pool"],
              ["https://insidermedia.s3.us-east-1.amazonaws.com/miniown/5958550121815854227.jpg", "Restaurant"],
              ["https://insidermedia.s3.us-east-1.amazonaws.com/miniown/5958550121815854216.jpg", "Wellness Studio"],
              ["https://insidermedia.s3.us-east-1.amazonaws.com/miniown/5958550121815854219.jpg", "Equipped Gym"],
              ["https://insidermedia.s3.us-east-1.amazonaws.com/miniown/5958550121815854212.jpg", "Elegant Hallways"],
              ["https://insidermedia.s3.us-east-1.amazonaws.com/miniown/5958550121815854218.jpg", "Meeting Room"],
            ].map(([src, caption]) => (
              <div
                key={caption}
                style={{ ...styles.galleryItem, aspectRatio: "4/3" }}
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector("img")
                  const cap = e.currentTarget.querySelector("div")
                  if (img) img.style.transform = "scale(1.05)"
                  if (cap) { cap.style.opacity = "1"; cap.style.transform = "translateY(0)" }
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector("img")
                  const cap = e.currentTarget.querySelector("div")
                  if (img) img.style.transform = "scale(1)"
                  if (cap) { cap.style.opacity = "0"; cap.style.transform = "translateY(10px)" }
                }}
              >
                <img src={src} alt={caption} style={styles.galleryImage} />
                <div style={styles.galleryCaption}>{caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" style={styles.section}>
        <h2 style={styles.sectionTitle}>Thoughtfully designed rooms</h2>
        <p style={styles.sectionSubtitle}>
          Each room is a sanctuary of comfort and style, designed to make your stay extraordinary.
        </p>
        {RoomsGrid}
      </section>

      {/* Location Section */}
      <section id="location" style={styles.locationSection}>
        <div style={styles.locationGrid}>
          <div style={styles.locationContent}>
            <h2 style={styles.locationTitle}>In the heart of Sumter</h2>
            <p style={styles.locationAddress}>
              530 S Pike E, Apt 25<br />Sumter, SC 29150<br />United States
            </p>
            <div style={styles.locationDetails}>
              <div style={styles.locationItem}>
                <svg style={styles.locationIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="rgb(196,113,87)" strokeWidth="2" fill="none" />
                  <circle cx="12" cy="9" r="2.5" fill="rgb(196,113,87)" />
                </svg>
                <div>
                  <strong style={{ display: "block", marginBottom: 4, color: "rgb(28,25,23)" }}>Prime Location</strong>
                  <p style={styles.locationText}>Close to local dining, parks, and attractions in historic Sumter.</p>
                </div>
              </div>
              <div style={styles.locationItem}>
                <svg style={styles.locationIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="rgb(196,113,87)" strokeWidth="2" fill="none" />
                  <path d="M9 22V12h6v10" stroke="rgb(196,113,87)" strokeWidth="2" />
                </svg>
                <div>
                  <strong style={{ display: "block", marginBottom: 4, color: "rgb(28,25,23)" }}>Easy Access</strong>
                  <p style={styles.locationText}>Convenient access via US-76 / US-378. Complimentary parking available.</p>
                </div>
              </div>
              <div style={styles.locationItem}>
                <svg style={styles.locationIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="rgb(196,113,87)" strokeWidth="2" fill="none" />
                  <path d="M12 6v6l4 2" stroke="rgb(196,113,87)" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <div>
                  <strong style={{ display: "block", marginBottom: 4, color: "rgb(28,25,23)" }}>24/7 Concierge</strong>
                  <p style={styles.locationText}>Our team is here to help you plan your perfect day and explore local gems.</p>
                </div>
              </div>
            </div>
          </div>
          <div style={styles.mapPlaceholder}>
            <img
              src="https://res.cloudinary.com/doqyrz0sg/image/upload/v1759520323/Sin_t%C3%ADtulo_c4g7h4.png"
              alt="Map of Miniown Hotel location in Sumter"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" style={styles.bookingSection}>
        <div style={{ ...styles.bookingWrap, marginBottom: isMobile ? 40 : 80 }}>
          <h2 style={styles.sectionTitle}>Reserve your stay</h2>
          <p style={styles.sectionSubtitle}>
            Book directly for the best rates and instant confirmation. Flexible cancellation up to 72 hours before arrival.
          </p>
        </div>

        <div style={styles.bookingWrap}>
          <div style={styles.bookingGrid}>
            {/* In mobile we render Form first for better UX */}
            {isMobile ? (
              <>
                {BookingForm}
                {BookingSummary}
              </>
            ) : (
              <>
                {BookingSummary}
                {BookingForm}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div>
            <div style={styles.footerBrand}>MINIOWN</div>
            <p style={styles.footerText}>A boutique hotel experience in the heart of Sumter, SC. Where luxury meets authenticity.</p>
          </div>
          <div>
            <h4 style={styles.footerTitle}>Quick Links</h4>
            <a href="#rooms" style={styles.footerLink}>Rooms & Suites</a>
            <a href="#experience" style={styles.footerLink}>Amenities</a>
            <a href="#location" style={styles.footerLink}>Location</a>
            <a href="#booking" style={styles.footerLink}>Book Now</a>
          </div>
          <div>
            <h4 style={styles.footerTitle}>Contact</h4>
            <a href="mailto:miniownllc@gmail.com" style={styles.footerLink}>miniownllc@gmail.com</a>
            <a href="tel:+18038560916" style={styles.footerLink}>+1 (803) 856-0916</a>
            <p style={{ ...styles.footerText, marginTop: 16 }}>
              530 S Pike E, Apt 25<br />Sumter, SC 29150
            </p>
          </div>
        </div>
        <div style={styles.footerBottom}>© {new Date().getFullYear()} Miniown Hotel. All rights reserved.</div>
      </footer>
    </div>
  )
}
