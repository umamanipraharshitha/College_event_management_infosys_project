import React from "react";
import { Link } from "react-router-dom";
import hImg from "../images/h.png";
import mImg from "../images/m.jpg";
import cImg from "../images/c.jpg";
import sImg from "../images/s.jpg";

export default function HeroSection() {
  const tournaments = [
    { name: "Tech Fest", subtitle: "AI Challenges", img: cImg },
    { name: "Cultural Night", subtitle: "Dance • Music • Drama", img: mImg },
    { name: "Hackathon", subtitle: "Code for Innovation", img: hImg },
    { name: "Sports Meet", subtitle: "Track & Field", img: sImg },
  ];

  return (
    <div className="hero-page">
      <div className="hero-content">
        <h1>Discover the Spirit of College Events</h1>
        <p>
          Explore engaging workshops, vibrant fests, and memorable nights — all
          happening right on your campus.
        </p>
        <div className="cta">
          <Link to="/auth">
            <button>Try it Out</button>
          </Link>
          <Link to="/contact">
            <button>Contact Us</button>
          </Link>
        </div>
      </div>

      <div className="tournaments">
        {tournaments.map((item, idx) => (
          <div className="card" key={idx}>
            <img src={item.img} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
