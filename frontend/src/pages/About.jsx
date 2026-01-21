import React from "react";

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
  },

  // Hero Section
  heroContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "8vh 4vw",
  },
  topLine: {
    color: "#9a95a9ff",
    fontWeight: 600,
    fontSize: "1.11rem",
    letterSpacing: "0.04em",
    marginBottom: "1rem",
  },
  header1: {
    fontSize: "3rem",
    fontWeight: 800,
    color: "#c3b0ccff",
    textShadow: "0 2px 18px #2a0c5299",
    marginBottom: "2rem",
  },
  desc: {
    maxWidth: "800px",
    fontSize: "1.15rem",
    color: "#dbcff3",
    lineHeight: 1.65,
    fontWeight: 500,
    textAlign: "center",
  },

  // Team / Info Section (optional cards)
  section: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem",
    margin: "5vh 0",
    padding: "0 4vw",
  },
  card: {
    background: "#1c1c1c",
    borderRadius: "16px",
    boxShadow:
      "0 -8px 20px rgba(154, 116, 225, 0.3), 0 20px 36px -12px rgba(92, 21, 154, 0.4)",
    padding: "1.5rem",
    maxWidth: "700px",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "#c689fe",
    marginBottom: "0.5rem",
  },
  cardText: {
    fontSize: "1.05rem",
    color: "#bfa2f5",
    lineHeight: 1.6,
  },
};

export default function About() {
  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <div style={styles.heroContent}>
        <div style={styles.topLine}>About CampusFest</div>
        <h1 style={styles.header1}>Celebrate, Connect, Explore</h1>
        <div style={styles.desc}>
          CampusFest is your gateway to vibrant campus life! From tech competitions
          to cultural nights, sports meets, and workshops, we bring all college
          events under one platform. Discover new experiences, join events easily,
          and celebrate the spirit of your campus community.
        </div>
      </div>

      {/* Optional Info Section */}
      <div style={styles.section}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Our Mission</div>
          <div style={styles.cardText}>
            To provide students with a seamless way to explore, participate, and
            celebrate campus events, fostering community engagement and creativity.
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>What We Offer</div>
          <div style={styles.cardText}>
            Event discovery, updates, and participation made easy. From cultural fests
            and sports meets to workshops and hackathons, never miss out on campus
            excitement.
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Join the Fun</div>
          <div style={styles.cardText}>
            Sign up, explore upcoming events, and connect with fellow students to
            create memories that last a lifetime.
          </div>
        </div>
      </div>
    </div>
  );
}
