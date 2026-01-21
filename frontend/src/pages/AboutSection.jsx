import React from "react";
import about1 from "../images/s.jpg";
import about2 from "../images/s.jpg";
import about3 from "../images/s.jpg";
import mImg from "../images/m.jpg";

export default function AboutSection() {
  return (
    <div className="about-page">
      <div className="about-text">
        <h2>About CampusFest</h2>
        <p>
          CampusFest bridges the gap between students, clubs, and organizers
          with seamless digital event management.
        </p>
        <ul>
          <li>🌟 All-in-one Platform: Manage registrations and results.</li>
          <li>🤝 Collaborative Events: Build teams & connect departments.</li>
        </ul>
      </div>
      <div className="about-images">
        {[about1, about2, about3, mImg].map((img, i) => (
          <img key={i} src={img} alt={`about-${i}`} />
        ))}
      </div>
    </div>
  );
}
