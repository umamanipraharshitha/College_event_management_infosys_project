import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import cImg from "../images/c.jpg";
import hImg from "../images/h.png";
import mImg from "../images/m.jpg";
import sImg from "../images/s.jpg";
import about1 from "../images/s.jpg";
import about2 from "../images/s.jpg";
import about3 from "../images/s.jpg";

export default function Homepage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const handleResize = () => setMenuOpen(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMenuOpen(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Message Sent! Thank you, ${formData.name}`);
    setFormData({ name: "", email: "", message: "" });
  };

  const tournaments = [
    { name: "Tech Fest", subtitle: "AI Challenges", img: cImg },
    { name: "Cultural Night", subtitle: "Dance • Music • Drama", img: mImg },
    { name: "Hackathon", subtitle: "Code for Innovation", img: hImg },
    { name: "Sports Meet", subtitle: "Track & Field", img: sImg },
  ];

  const styles = {
    page: {
      minHeight: "100vh",
      width: "100%",
      margin: 0,
      padding: 0,
      background: "linear-gradient(135deg, #000000ff 65%, #2a0c52 100%)",
      fontFamily: "Poppins, Arial, sans-serif",
      color: "#f0f0f0",
      overflowX: "hidden",
      scrollBehavior: "smooth",
    },
    nav: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1.5rem 6vw",
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(0,0,0,0.4)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 2px 14px rgba(92,21,154,0.35)",
    },
    logo: {
      fontSize: "1.9rem",
      fontWeight: 700,
      color: "#c8b5ff",
      letterSpacing: ".045em",
    },
    menu: {
      display: "flex",
      gap: "2.4rem",
      listStyle: "none",
      margin: 0,
      padding: 0,
    },
    menuItem: {
      cursor: "pointer",
      fontWeight: 500,
      fontSize: "1.08rem",
      color: "#cdc9ce",
      transition: "color 0.18s ease",
    },
    contactBtn: {
      background: "#b793d6",
      color: "#2a0c52",
      border: "none",
      borderRadius: "20px",
      padding: "0.6rem 1.4rem",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "1rem",
      transition: "all 0.3s cubic-bezier(.56,-0.26,.61,1.43)",
      boxShadow: "0 3px 14px rgba(183,147,214,0.5)",
    },
    hamburger: {
      display: "none",
      flexDirection: "column",
      cursor: "pointer",
      gap: "5px",
    },
    bar: {
      height: "3px",
      width: "25px",
      backgroundColor: "#cdc9ce",
      borderRadius: "2px",
    },
    mobileMenu: {
      display: "flex",
      position: "absolute",
      top: "100%",
      right: 0,
      backgroundColor: "#1c1c1c",
      width: "200px",
      borderRadius: "8px",
      flexDirection: "column",
      padding: "1rem",
      gap: "1rem",
    },
    heroContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "6vh",
      marginBottom: "6vh",
      textAlign: "center",
      flexWrap: "wrap",
      padding: "0 4vw",
    },
    heroText: {
      maxWidth: "650px",
      color: "#dbcff3",
      margin: "0 auto",
      zIndex: 2,
    },
    topLine: {
      color: "#9a95a9ff",
      fontWeight: 600,
      fontSize: "1.11rem",
      letterSpacing: "0.04em",
    },
    header1: {
      margin: "1rem 0 0.8rem 0",
      fontSize: "3.2rem",
      lineHeight: 1.17,
      fontWeight: 800,
      color: "#c3b0ccff",
      textShadow: "0 2px 18px #2a0c5299",
    },
    desc: {
      color: "#bdb6c8ff",
      fontSize: "1.13rem",
      marginBottom: "1.45rem",
      marginTop: ".7rem",
      lineHeight: 1.59,
      fontWeight: 500,
    },
    cta: {
      display: "flex",
      gap: "1.1rem",
      justifyContent: "center",
      marginTop: "1.6rem",
      flexWrap: "wrap",
    },
    getStarted: {
      padding: "0.8rem 1.6rem",
      borderRadius: "14px",
      border: "none",
      fontSize: "1.07rem",
      cursor: "pointer",
      fontWeight: 700,
      background: "linear-gradient(93deg,#6e4bbf 0%,#c689fe 110%)",
      color: "#fff",
      boxShadow: "0 4px 18px rgba(158, 88, 244, 0.18)",
      transition: "transform 0.18s, background 0.3s",
    },
    watchVideo: {
      padding: "0.8rem 1.6rem",
      borderRadius: "14px",
      background: "transparent",
      color: "#c1a2f5",
      border: "2px solid #867095",
      fontSize: "1.07rem",
      cursor: "pointer",
      fontWeight: 700,
      transition: "all 0.3s cubic-bezier(.54,-0.24,.67,1.22)",
    },
    tournaments: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "3rem",
      margin: "5vh auto 10vh auto",
      padding: "0 5vw",
      maxWidth: "1240px",
    },
    tournamentCard: {
      background: "#1c1c1c",
      borderRadius: "21px",
      boxShadow:
        "0 -12px 32px rgba(154, 116, 225, 0.3), 0 28px 46px -18px rgba(92, 21, 154, 0.40)",
      width: "245px",
      overflow: "hidden",
      textAlign: "center",
      transition:
        "transform 0.27s cubic-bezier(.62,-0.22,.69,1.23), box-shadow 0.33s cubic-bezier(.74,-0.36,.67,1.24)",
    },
    tournamentImg: {
      width: "100%",
      height: "140px",
      objectFit: "cover",
      boxShadow: "0 1px 8px #64428c27",
    },
    cardContent: {
      padding: "0.5rem 1.1rem 0.8rem 1.1rem",
    },
    cardTitle: {
      fontSize: "1.13rem",
      color: "#c689fe",
      fontWeight: 700,
      marginBottom: "0.4rem",
    },
    cardSub: {
      fontSize: "0.99rem",
      color: "#bfa2f5",
      fontWeight: 600,
    },
    aboutSection: {
      maxWidth: "1200px",
      margin: "5vh auto 10vh auto",
      padding: "0 2rem",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
      alignItems: "center",
      gap: "3rem",
    },
    aboutText: {
      textAlign: "left",
    },
    aboutHeading: {
      fontSize: "2.7rem",
      fontWeight: 700,
      color: "#c3b0ccff",
      marginBottom: "1rem",
    },
    aboutIntro: {
      fontSize: "1.18rem",
      color: "#bfb5d1",
      fontWeight: 500,
      marginBottom: "1.8rem",
      lineHeight: 1.6,
    },
    aboutHighlights: {
      display: "flex",
      flexDirection: "column",
      gap: "1.2rem",
    },
    highlightItem: {
      background: "rgba(0, 0, 0, 0.5)",
      borderLeft: "4px solid #5a446eff",
      padding: "1rem 1.2rem",
      borderRadius: "10px",
      boxShadow: "0 4px 20px rgba(195, 141, 245, 0.3)",
    },
    aboutImageGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1rem",
    },
    aboutImg: {
      width: "100%",
      height: "240px",
      objectFit: "cover",
      borderRadius: "14px",
      boxShadow: "0 6px 18px rgba(92,21,154,0.4)",
    },
    contactSection: {
      background: "#100216ff",
      borderRadius: "18px",
      padding: "2rem",
      maxWidth: "700px",
      margin: "8vh auto",
      boxShadow: "0 8px 25px rgba(149, 112, 183, 0.5)",
      textAlign: "center",
    },
    contactHeading: {
      fontSize: "2.4rem",
      color: "#c3b0cc",
      marginBottom: "1.2rem",
      fontWeight: 700,
    },
    contactDesc: {
      fontSize: "1.1rem",
      color: "#bfb5d1",
      marginBottom: "2rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1.2rem",
    },
    input: {
      padding: "0.9rem 1rem",
      borderRadius: "10px",
      border: "1px solid #867095",
      background: "#0c0210ff",
      color: "#fff",
      fontSize: "1rem",
    },
    textarea: {
      padding: "0.9rem 1rem",
      borderRadius: "10px",
      border: "1px solid #867095",
      background: "#120212ff",
      color: "#fff",
      fontSize: "1rem",
      resize: "none",
    },
    submitBtn: {
      background: "linear-gradient(93deg,#6e4bbf 0%,#c689fe 110%)",
      color: "#fff",
      border: "none",
      padding: "0.9rem",
      borderRadius: "12px",
      fontWeight: 700,
      fontSize: "1.1rem",
      cursor: "pointer",
      transition: "transform 0.2s ease",
    },
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.logo} onClick={() => scrollToSection("home")}>
          CampusFest
        </div>
        <ul
          style={{
            ...styles.menu,
            display: window.innerWidth > 768 ? "flex" : "none",
          }}
        >
          <li style={styles.menuItem} onClick={() => scrollToSection("home")}>
            Home
          </li>
          <li style={styles.menuItem} onClick={() => scrollToSection("about")}>
            About
          </li>
          <li style={styles.menuItem} onClick={() => scrollToSection("contact")}>
            Contact
          </li>
        </ul>
        <div
          style={{
            ...styles.hamburger,
            display: window.innerWidth <= 768 ? "flex" : "none",
          }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div style={styles.bar}></div>
          <div style={styles.bar}></div>
          <div style={styles.bar}></div>
        </div>
        <button
          style={{
            ...styles.contactBtn,
            display: window.innerWidth > 768 ? "block" : "none",
          }}
        >
          <Link to="/auth" style={{ textDecoration: "none", color: "#2a0c52" }}>
            Login / Register
          </Link>
        </button>
        {menuOpen && window.innerWidth <= 768 && (
          <div style={styles.mobileMenu}>
            <div onClick={() => scrollToSection("home")}>Home</div>
            <div onClick={() => scrollToSection("about")}>About</div>
            <div onClick={() => scrollToSection("contact")}>Contact</div>
            <Link to="/auth" style={{ textDecoration: "none" }}>
              <button style={styles.contactBtn}>Login / Register</button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div id="home" style={styles.heroContent}>
        <div style={styles.heroText}>
          <div style={styles.topLine}>Experience • Celebrate • Connect</div>
          <h1 style={styles.header1}>
            Discover the Spirit of <br /> College Events
          </h1>
          <div style={styles.desc}>
            Explore engaging workshops, vibrant fests, and memorable nights — all
            happening right on your campus.
          </div>
          <div style={styles.cta}>
            <Link to="/auth" style={{ textDecoration: "none" }}>
              <button style={styles.getStarted}>Try it Out</button>
            </Link>
            <button style={styles.watchVideo} onClick={() => scrollToSection("contact")}>
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div style={styles.tournaments}>
        {tournaments.map((item, idx) => (
          <div
            key={idx}
            style={styles.tournamentCard}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-12px) scale(1.04)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0) scale(1)")
            }
          >
            <img style={styles.tournamentImg} src={item.img} alt={item.subtitle} />
            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>{item.name}</h3>
              <div style={styles.cardSub}>{item.subtitle}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Unique About Section */}
      <section id="about" style={styles.aboutSection}>
        <div style={styles.aboutText}>
          <h2 style={styles.aboutHeading}>About CampusFest</h2>
          <p style={styles.aboutIntro}>
            CampusFest bridges the gap between students, clubs, and organizers with
            seamless digital event management. We empower creativity and simplify
            collaboration — from small workshops to mega fests.
          </p>
          <div style={styles.aboutHighlights}>
            <div style={styles.highlightItem}>
              🌟 <b>All-in-one Platform:</b> Manage registrations, schedules, and results in one place.
            </div>
            <div style={styles.highlightItem}>
              🤝 <b>Collaborative Events:</b> Build teams, share resources, and connect across departments.
            </div>
           
          </div>
        </div>
        <div style={styles.aboutImageGrid}>
          <img src={about1} alt="About 1" style={styles.aboutImg} />
          <img src={about2} alt="About 2" style={styles.aboutImg} />
          <img src={about3} alt="About 3" style={styles.aboutImg} />
          <img src={mImg} alt="About 4" style={styles.aboutImg} />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={styles.contactSection}>
        <h2 style={styles.contactHeading}>Contact Us</h2>
        <p style={styles.contactDesc}>
          Have questions, feedback, or collaboration ideas? Reach out to us below.
        </p>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            style={styles.input}
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            style={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            rows="5"
            placeholder="Your Message"
            style={styles.textarea}
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit" style={styles.submitBtn}>
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
}
