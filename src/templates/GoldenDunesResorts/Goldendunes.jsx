"use client"

import { useState, useEffect } from "react"

const GoldenDunesLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedDates, setSelectedDates] = useState({
    checkIn: "",
    checkOut: "",
    guests: "2",
  })
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = 80
      const elementPosition = element.offsetTop - headerHeight
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      })
    }
    setIsMenuOpen(false) // Close mobile menu after navigation
  }

  const BeachIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H9V3H7V5H5V7H3V9H1V11H3V13H5V15H7V17H9V19H15V17H17V15H19V13H21V11H23V9H21ZM19 11H17V13H15V15H13V17H11V15H9V13H7V11H5V9H7V7H9V5H11V7H13V9H15V7H17V9H19V11Z"
        fill="#c4956c"
      />
    </svg>
  )

  const DiningIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.1 13.34L10.91 10.53C11.35 10.09 11.35 9.36 10.91 8.92C10.47 8.48 9.74 8.48 9.3 8.92L6.49 11.73C6.05 12.17 6.05 12.9 6.49 13.34C6.93 13.78 7.66 13.78 8.1 13.34ZM13.41 7.56L10.91 5.06C10.47 4.62 9.74 4.62 9.3 5.06C8.86 5.5 8.86 6.23 9.3 6.67L11.8 9.17C12.24 9.61 12.97 9.61 13.41 9.17C13.85 8.73 13.85 7.99 13.41 7.56ZM13.34 15.9L10.53 13.09C10.09 12.65 9.36 12.65 8.92 13.09C8.48 13.53 8.48 14.26 8.92 14.7L11.73 17.51C12.17 17.95 12.9 17.95 13.34 17.51C13.78 17.07 13.78 16.34 13.34 15.9ZM19.07 4.93C18.63 4.49 17.9 4.49 17.46 4.93L15.07 7.32C14.63 7.76 14.63 8.49 15.07 8.93C15.51 9.37 16.24 9.37 16.68 8.93L19.07 6.54C19.51 6.1 19.51 5.37 19.07 4.93Z"
        fill="#c4956c"
      />
      <circle cx="17.5" cy="17.5" r="4.5" stroke="#c4956c" strokeWidth="2" fill="none" />
      <path d="M15 17.5H20M17.5 15V20" stroke="#c4956c" strokeWidth="2" />
    </svg>
  )

  const SpaIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="#c4956c" />
      <path
        d="M12 7C8.69 7 6 9.69 6 13C6 16.31 8.69 19 12 19C15.31 19 18 16.31 18 13C18 9.69 15.31 7 12 7ZM12 17C9.79 17 8 15.21 8 13C8 10.79 9.79 9 12 9C14.21 9 16 10.79 16 13C16 15.21 14.21 17 12 17Z"
        fill="#c4956c"
      />
      <path
        d="M12 11C10.9 11 10 11.9 10 13C10 14.1 10.9 15 12 15C13.1 15 14 14.1 14 13C14 11.9 13.1 11 12 11Z"
        fill="#c4956c"
      />
      <path
        d="M7.5 20.5C7.5 21.33 8.17 22 9 22H15C15.83 22 16.5 21.33 16.5 20.5C16.5 19.67 15.83 19 15 19H9C8.17 19 7.5 19.67 7.5 20.5Z"
        fill="#c4956c"
      />
    </svg>
  )

  const styles = {
    // Global styles
    "*": {
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
    },
    body: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      lineHeight: 1.6,
      color: "#2c2c2c",
    },

    header: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: scrolled ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      borderBottom: scrolled ? "1px solid rgba(0, 0, 0, 0.15)" : "1px solid rgba(0, 0, 0, 0.1)",
      padding: scrolled ? "0.75rem 2rem" : "1rem 2rem",
      transition: "all 0.3s ease",
      boxShadow: scrolled ? "0 2px 20px rgba(0, 0, 0, 0.1)" : "none",
    },
    nav: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      maxWidth: "1400px",
      margin: "0 auto",
    },
    logo: {
      fontSize: "1.5rem",
      fontWeight: "600",
      color: "#c4956c",
      textDecoration: "none",
      cursor: "pointer",
      transition: "color 0.3s ease",
    },
    navLinks: {
      display: "flex",
      gap: "2rem",
      listStyle: "none",
      alignItems: "center",
      "@media (max-width: 768px)": {
        display: isMenuOpen ? "flex" : "none",
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        backgroundColor: "white",
        flexDirection: "column",
        padding: "2rem",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
        gap: "1.5rem",
      },
    },
    navLink: {
      textDecoration: "none",
      color: "#2c2c2c",
      fontSize: "0.95rem",
      fontWeight: "400",
      transition: "color 0.3s ease",
      cursor: "pointer",
      padding: "0.5rem 0",
    },
    bookButton: {
      backgroundColor: "#c4956c",
      color: "white",
      padding: "0.75rem 1.5rem",
      borderRadius: "50px",
      textDecoration: "none",
      fontSize: "0.9rem",
      fontWeight: "500",
      transition: "all 0.3s ease",
      border: "none",
      cursor: "pointer",
    },

    // Hero section
    hero: {
      minHeight: "100vh",
      backgroundColor: "#f5f2ed",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "2rem",
      position: "relative",
    },
    heroContent: {
      maxWidth: "800px",
      margin: "0 auto",
    },
    heroTitle: {
      fontSize: "clamp(3rem, 8vw, 6rem)",
      fontWeight: "300",
      color: "#2c2c2c",
      marginBottom: "1.5rem",
      lineHeight: "1.1",
      letterSpacing: "-0.02em",
    },
    heroSubtitle: {
      fontSize: "1.25rem",
      color: "#666",
      marginBottom: "3rem",
      fontWeight: "400",
      maxWidth: "600px",
      margin: "0 auto 3rem auto",
    },

    // Booking form
    bookingForm: {
      backgroundColor: "white",
      padding: "2rem",
      borderRadius: "12px",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      display: "flex",
      gap: "1rem",
      alignItems: "end",
      flexWrap: "wrap",
      justifyContent: "center",
      maxWidth: "800px",
      margin: "0 auto",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      minWidth: "150px",
    },
    label: {
      fontSize: "0.85rem",
      color: "#666",
      marginBottom: "0.5rem",
      fontWeight: "500",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    input: {
      padding: "0.75rem",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "1rem",
      backgroundColor: "#fafafa",
      transition: "border-color 0.3s ease",
    },
    searchButton: {
      backgroundColor: "#2c2c2c",
      color: "white",
      padding: "0.75rem 2rem",
      border: "none",
      borderRadius: "6px",
      fontSize: "1rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.3s ease",
      minHeight: "50px",
    },

    // Features section
    features: {
      padding: "6rem 2rem",
      backgroundColor: "white",
    },
    featuresContainer: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    sectionTitle: {
      fontSize: "clamp(2.5rem, 5vw, 4rem)",
      fontWeight: "300",
      textAlign: "center",
      marginBottom: "4rem",
      color: "#2c2c2c",
      letterSpacing: "-0.02em",
    },
    featuresGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "3rem",
      marginTop: "4rem",
    },
    featureCard: {
      textAlign: "center",
      padding: "2rem",
    },
    featureIcon: {
      width: "80px",
      height: "80px",
      backgroundColor: "#f5f2ed",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1.5rem auto",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    featureTitle: {
      fontSize: "1.5rem",
      fontWeight: "500",
      marginBottom: "1rem",
      color: "#2c2c2c",
    },
    featureDescription: {
      color: "#666",
      lineHeight: "1.6",
    },

    // Gallery section
    gallery: {
      padding: "6rem 2rem",
      backgroundColor: "#f5f2ed",
    },
    galleryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      gap: "2rem",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    galleryItem: {
      borderRadius: "12px",
      overflow: "hidden",
      aspectRatio: "4/3",
      backgroundColor: "#ddd",
      position: "relative",
    },
    galleryImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },

    // CTA section
    cta: {
      padding: "6rem 2rem",
      backgroundColor: "#c4956c",
      color: "white",
      textAlign: "center",
    },
    ctaTitle: {
      fontSize: "clamp(2rem, 4vw, 3rem)",
      fontWeight: "300",
      marginBottom: "1.5rem",
      letterSpacing: "-0.02em",
    },
    ctaDescription: {
      fontSize: "1.25rem",
      marginBottom: "2rem",
      opacity: 0.9,
      maxWidth: "600px",
      margin: "0 auto 2rem auto",
    },
    ctaButton: {
      backgroundColor: "white",
      color: "#c4956c",
      padding: "1rem 2.5rem",
      borderRadius: "50px",
      textDecoration: "none",
      fontSize: "1.1rem",
      fontWeight: "500",
      transition: "all 0.3s ease",
      display: "inline-block",
      border: "none",
      cursor: "pointer",
    },

    // Footer
    footer: {
      backgroundColor: "#2c2c2c",
      color: "white",
      padding: "4rem 2rem 2rem 2rem",
    },
    footerContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "3rem",
    },
    footerSection: {
      display: "flex",
      flexDirection: "column",
    },
    footerTitle: {
      fontSize: "1.2rem",
      fontWeight: "600",
      marginBottom: "1rem",
      color: "#c4956c",
    },
    footerLink: {
      color: "#ccc",
      textDecoration: "none",
      marginBottom: "0.5rem",
      transition: "color 0.3s ease",
      cursor: "pointer",
    },
    footerBottom: {
      borderTop: "1px solid #444",
      marginTop: "3rem",
      paddingTop: "2rem",
      textAlign: "center",
      color: "#999",
    },

    mobileMenuButton: {
      display: "none",
      backgroundColor: "transparent",
      border: "none",
      fontSize: "1.5rem",
      cursor: "pointer",
      color: "#2c2c2c",
      padding: "0.5rem",
      borderRadius: "4px",
      transition: "background-color 0.3s ease",
      "@media (max-width: 768px)": {
        display: "block",
      },
    },
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    alert("Booking search initiated! This would connect to your booking system.")
  }

  return (
    <div style={styles.body}>
      {/* Header */}
      <header style={styles.header}>
        <nav style={styles.nav}>
          <a
            href="#"
            style={styles.logo}
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("hero")
            }}
            onMouseEnter={(e) => (e.target.style.color = "#b8875f")}
            onMouseLeave={(e) => (e.target.style.color = "#c4956c")}
          >
            Golden Dunes Resorts
          </a>

          <ul style={styles.navLinks}>
            <li>
              <a
                style={styles.navLink}
                onClick={() => scrollToSection("destinations")}
                onMouseEnter={(e) => (e.target.style.color = "#c4956c")}
                onMouseLeave={(e) => (e.target.style.color = "#2c2c2c")}
              >
                Destinations
              </a>
            </li>
            <li>
              <a
                style={styles.navLink}
                onClick={() => scrollToSection("experiences")}
                onMouseEnter={(e) => (e.target.style.color = "#c4956c")}
                onMouseLeave={(e) => (e.target.style.color = "#2c2c2c")}
              >
                Experiences
              </a>
            </li>
            <li>
              <a
                style={styles.navLink}
                onClick={() => scrollToSection("about")}
                onMouseEnter={(e) => (e.target.style.color = "#c4956c")}
                onMouseLeave={(e) => (e.target.style.color = "#2c2c2c")}
              >
                About
              </a>
            </li>
            <li>
              <a
                style={styles.navLink}
                onClick={() => scrollToSection("contact")}
                onMouseEnter={(e) => (e.target.style.color = "#c4956c")}
                onMouseLeave={(e) => (e.target.style.color = "#2c2c2c")}
              >
                Contact
              </a>
            </li>
            <li>
              <button
                style={styles.bookButton}
                onClick={() => scrollToSection("book")}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#b8875f")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#c4956c")}
              >
                Book Now
              </button>
            </li>
          </ul>

          <button
            style={{
              ...styles.mobileMenuButton,
              backgroundColor: isMenuOpen ? "#f5f2ed" : "transparent",
              display: window.innerWidth <= 768 ? "block" : "none",
            }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f5f2ed")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = isMenuOpen ? "#f5f2ed" : "transparent")}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Luxury meets
            <br />
            endless horizons
          </h1>
          <p style={styles.heroSubtitle}>
            Discover extraordinary resort experiences in the world's most breathtaking destinations. Where golden sands
            meet unparalleled luxury.
          </p>

          <form id="book" style={styles.bookingForm} onSubmit={handleBookingSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Check In</label>
              <input
                type="date"
                style={styles.input}
                value={selectedDates.checkIn}
                onChange={(e) => setSelectedDates({ ...selectedDates, checkIn: e.target.value })}
                onFocus={(e) => (e.target.style.borderColor = "#c4956c")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Check Out</label>
              <input
                type="date"
                style={styles.input}
                value={selectedDates.checkOut}
                onChange={(e) => setSelectedDates({ ...selectedDates, checkOut: e.target.value })}
                onFocus={(e) => (e.target.style.borderColor = "#c4956c")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Guests</label>
              <select
                style={styles.input}
                value={selectedDates.guests}
                onChange={(e) => setSelectedDates({ ...selectedDates, guests: e.target.value })}
                onFocus={(e) => (e.target.style.borderColor = "#c4956c")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5+">5+ Guests</option>
              </select>
            </div>

            <button
              type="submit"
              style={styles.searchButton}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#1a1a1a")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#2c2c2c")}
            >
              Search Resorts
            </button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section id="experiences" style={styles.features}>
        <div style={styles.featuresContainer}>
          <h2 style={styles.sectionTitle}>Exceptional experiences await</h2>

          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div
                style={styles.featureIcon}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-5px)"
                  e.target.style.boxShadow = "0 10px 25px rgba(196, 149, 108, 0.2)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "none"
                }}
              >
                <BeachIcon />
              </div>
              <h3 style={styles.featureTitle}>Pristine Beaches</h3>
              <p style={styles.featureDescription}>
                Wake up to endless ocean views and pristine golden beaches. Our beachfront resorts offer direct access
                to some of the world's most beautiful coastlines.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div
                style={styles.featureIcon}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-5px)"
                  e.target.style.boxShadow = "0 10px 25px rgba(196, 149, 108, 0.2)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "none"
                }}
              >
                <DiningIcon />
              </div>
              <h3 style={styles.featureTitle}>World-Class Dining</h3>
              <p style={styles.featureDescription}>
                Savor exceptional cuisine crafted by renowned chefs. From local delicacies to international favorites,
                every meal is a culinary journey.
              </p>
            </div>

            <div style={styles.featureCard}>
              <div
                style={styles.featureIcon}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-5px)"
                  e.target.style.boxShadow = "0 10px 25px rgba(196, 149, 108, 0.2)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "none"
                }}
              >
                <SpaIcon />
              </div>
              <h3 style={styles.featureTitle}>Wellness & Spa</h3>
              <p style={styles.featureDescription}>
                Rejuvenate your mind, body, and soul at our award-winning spas. Experience holistic treatments in
                serene, luxurious settings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="destinations" style={styles.gallery}>
        <div style={styles.featuresContainer}>
          <h2 style={styles.sectionTitle}>Discover our destinations</h2>

          <div style={styles.galleryGrid}>
            <div style={styles.galleryItem}>
              <img src="/luxury-beachfront-resort-with-golden-sand.jpg" alt="Beachfront Resort" style={styles.galleryImage} />
            </div>
            <div style={styles.galleryItem}>
              <img src="/infinity-pool-overlooking-ocean-at-sunset.jpg" alt="Pool Area" style={styles.galleryImage} />
            </div>
            <div style={styles.galleryItem}>
              <img src="/luxury-spa-candles.png" alt="Spa Experience" style={styles.galleryImage} />
            </div>
            <div style={styles.galleryItem}>
              <img src="/elegant-fine-dining-restaurant-with-ocean-view.jpg" alt="Fine Dining" style={styles.galleryImage} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready for your perfect getaway?</h2>
        <p style={styles.ctaDescription}>
          Join thousands of travelers who have discovered their dream destinations with Golden Dunes Resorts. Your
          luxury escape is just one click away.
        </p>
        <button
          style={styles.ctaButton}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f5f2ed"
            e.target.style.transform = "translateY(-2px)"
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "white"
            e.target.style.transform = "translateY(0)"
          }}
          onClick={() => scrollToSection("book")}
        >
          Start Your Journey
        </button>
      </section>

      {/* Footer */}
      <footer id="contact" style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Golden Dunes Resorts</h4>
            <p style={{ color: "#ccc", lineHeight: "1.6" }}>
              Creating unforgettable luxury experiences in the world's most beautiful destinations.
            </p>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Destinations</h4>
            <a
              style={styles.footerLink}
              onClick={() => scrollToSection("destinations")}
              onMouseEnter={(e) => (e.target.style.color = "#c4956c")}
              onMouseLeave={(e) => (e.target.style.color = "#ccc")}
            >
              Maldives
            </a>
            <a
              style={styles.footerLink}
              onClick={() => scrollToSection("destinations")}
              onMouseEnter={(e) => (e.target.style.color = "#c4956c")}
              onMouseLeave={(e) => (e.target.style.color = "#ccc")}
            >
              Bali
            </a>
            <a
              style={styles.footerLink}
              onClick={() => scrollToSection("destinations")}
              onMouseEnter={(e) => (e.target.style.color = "#c4956c")}
              onMouseLeave={(e) => (e.target.style.color = "#ccc")}
            >
              Santorini
            </a>
            <a
              style={styles.footerLink}
              onClick={() => scrollToSection("destinations")}
              onMouseEnter={(e) => (e.target.style.color = "#c4956c")}
              onMouseLeave={(e) => (e.target.style.color = "#ccc")}
            >
              Dubai
            </a>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Services</h4>
            <a
              style={styles.footerLink}
              onClick={() => scrollToSection("book")}
              onMouseEnter={(e) => (e.target.style.color = "#c4956c")}
              onMouseLeave={(e) => (e.target.style.color = "#ccc")}
            >
              Resort Booking
            </a>
            <a
              style={styles.footerLink}
              onClick={() => scrollToSection("experiences")}
              onMouseEnter={(e) => (e.target.style.color = "#c4956c")}
              onMouseLeave={(e) => (e.target.style.color = "#ccc")}
            >
              Concierge
            </a>
            <a
              style={styles.footerLink}
              onClick={() => scrollToSection("experiences")}
              onMouseEnter={(e) => (e.target.style.color = "#c4956c")}
              onMouseLeave={(e) => (e.target.style.color = "#ccc")}
            >
              Private Events
            </a>
            <a
              style={styles.footerLink}
              onClick={() => scrollToSection("experiences")}
              onMouseEnter={(e) => (e.target.style.color = "#c4956c")}
              onMouseLeave={(e) => (e.target.style.color = "#ccc")}
            >
              Spa & Wellness
            </a>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Contact</h4>
            <p style={{ color: "#ccc", marginBottom: "0.5rem" }}>+1 (555) 123-4567</p>
            <p style={{ color: "#ccc", marginBottom: "0.5rem" }}>info@goldendunesresorts.com</p>
            <p style={{ color: "#ccc" }}>Available 24/7</p>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p>&copy; 2025 Golden Dunes Resorts. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default GoldenDunesLandingPage
