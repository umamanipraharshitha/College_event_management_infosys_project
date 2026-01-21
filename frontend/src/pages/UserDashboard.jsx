import React, { useEffect, useState } from "react";
import axios from "axios";
import EventsList from "./components/EventsList";
import RegisteredEvents from "./components/RegisteredEvents";
import FeedbackForm from "./components/FeedbackForm";
import { Moon, Sun } from "lucide-react"; // icons for theme toggle

const API_URL = "http://localhost:3000";

const UserDashboard = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  const [tab, setTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [registered, setRegistered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const fetchAllEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "/auth";
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisteredEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/registrations/student/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegistered(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const registerForEvent = async (eventId) => {
    try {
      const res = await axios.post(
        `${API_URL}/register`,
        { event_id: eventId, user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      fetchRegisteredEvents();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to register");
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return alert("Please enter your feedback!");
    try {
      await axios.post(
        `${API_URL}/feedback`,
        { user_id: userId, message: feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Thank you for your feedback!");
      setFeedback("");
    } catch {
      alert("Error submitting feedback");
    }
  };

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = "/auth";
  };

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  useEffect(() => {
    if (!token) return (window.location.href = "/auth");
    fetchAllEvents();
    fetchRegisteredEvents();
  }, []);

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background-color: ${darkMode ? "#0e0b1b" : "#f7f8fc"};
          color: ${darkMode ? "#eae6ff" : "#1e1e2f"};
          transition: all 0.4s ease;
        }

        .topbar {
          background: ${darkMode
            ? "linear-gradient(90deg, #1e1b3a, #2d1f54)"
            : "linear-gradient(90deg, #5b21b6, #9333ea)"};
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 40px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          position: sticky;
          top: 0;
          z-index: 100;
          transition: 0.4s ease;
        }

        .topbar h1 {
          font-size: 1.6rem;
          font-weight: 700;
        }

        .topbar-buttons {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .theme-toggle {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          color: white;
          padding: 8px 12px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s;
        }

        .theme-toggle:hover {
          background: rgba(255,255,255,0.25);
          transform: scale(1.1);
        }

        .signout-btn {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: 0.3s;
        }

        .signout-btn:hover {
          background: rgba(255,255,255,0.25);
          transform: scale(1.05);
        }

        .stats-section {
          display: flex;
          justify-content: center;
          gap: 30px;
          padding: 40px 20px;
          flex-wrap: wrap;
          background: ${darkMode ? "#151029" : "#fff"};
          transition: 0.4s ease;
        }

        .stat-card {
          background: ${darkMode
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.8)"};
          backdrop-filter: blur(15px);
          border-radius: 16px;
          padding: 25px 35px;
          text-align: center;
          width: 230px;
          box-shadow: 0 6px 20px rgba(147, 51, 234, 0.1);
          border: ${darkMode
            ? "1px solid rgba(167,139,250,0.2)"
            : "1px solid rgba(0,0,0,0.05)"};
          transition: transform 0.3s ease, background 0.4s;
        }

        .stat-card:hover {
          transform: translateY(-6px);
        }

        .stat-title {
          font-size: 0.9rem;
          color: ${darkMode ? "#bbb6d7" : "#666"};
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: ${darkMode ? "#c4b5fd" : "#6d28d9"};
        }

        .dashboard-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 30px;
          min-height: 100vh;
          background: ${darkMode ? "#0e0b1b" : "#f7f8fc"};
          transition: 0.4s;
        }

        .tabs {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .tabs button {
          padding: 12px 28px;
          border: none;
          border-radius: 10px;
          background: ${darkMode ? "#2a2250" : "#e5e0fa"};
          color: ${darkMode ? "#e6d9ff" : "#4b0082"};
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }

        .tabs button:hover {
          background: ${darkMode ? "#3d2e6d" : "#d8c9f7"};
        }

        .tabs .active {
          background: linear-gradient(90deg, #7e22ce, #9333ea);
          color: white;
          box-shadow: 0 0 15px rgba(147, 51, 234, 0.4);
        }

        .tab-content {
          width: 90%;
          max-width: 1200px;
          background: ${darkMode ? "#151029" : "#fff"};
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          transition: all 0.4s ease;
        }
          html, body {
  height: auto !important;
  overflow-y: auto !important;
}

      `}</style>

      <div className="topbar">
        <h1>User Dashboard</h1>
        <div className="topbar-buttons">
          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="signout-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <p className="stat-title">Total Events</p>
          <p className="stat-value">{events.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-title">Registered Events</p>
          <p className="stat-value">{registered.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-title">Feedback Given</p>
          <p className="stat-value">{feedback ? 1 : 0}</p>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="tabs">
          <button
            className={tab === "events" ? "active" : ""}
            onClick={() => setTab("events")}
          >
            Events
          </button>
          <button
            className={tab === "registrations" ? "active" : ""}
            onClick={() => setTab("registrations")}
          >
            My Registrations
          </button>
          <button
            className={tab === "feedback" ? "active" : ""}
            onClick={() => setTab("feedback")}
          >
            Feedback
          </button>
        </div>

        <div className="tab-content">
          {tab === "events" && (
            <EventsList
              events={events}
              loading={loading}
              registerForEvent={registerForEvent}
              API_URL={API_URL}
            />
          )}
          {tab === "registrations" && (
            <RegisteredEvents registered={registered} API_URL={API_URL} />
          )}
          {tab === "feedback" && (
            <FeedbackForm
              feedback={feedback}
              setFeedback={setFeedback}
              handleSubmitFeedback={handleSubmitFeedback}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
