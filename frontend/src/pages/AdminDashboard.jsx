import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import CreateEventForm from "../components/CreateEventForm";
import EventsTable from "../components/EventsTable";
import RegistrationsTable from "../components/RegistrationsTable";
import FeedbackTable from "../components/FeedbackTable";
import "./AdminDashboard.css";

const API_URL = "http://localhost:3000";

export default function AdminDashboard() {
  const token = localStorage.getItem("token");
  const [tab, setTab] = useState("create");
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (!token) return (window.location.href = "/login");
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/events/my-college`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRegistrations = async (eventId) => {
    try {
      const res = await axios.get(`${API_URL}/registrations/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegistrations(res.data);
      setSelectedEvent(eventId);
      setTab("registrations");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`${API_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
      setRegistrations([]);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete event");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API_URL}/registrations/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRegistrations(selectedEvent);
    } catch {
      alert("Failed to update status");
    }
  };

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      <style>{`
        body {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          background: radial-gradient(circle at top left, #0b001a, #100020, #000);
          color: #e4d9ff;
          overflow: hidden;
        }

        .dashboard {
          display: flex;
          height: 100vh;
        }

        .sidebar {
          width: 250px;
          background: linear-gradient(180deg, #0d001a, #14002b);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 2px solid #2a1849;
          box-shadow: 2px 0 20px rgba(145, 76, 255, 0.15);
        }

        .sidebar h2 {
          text-align: center;
          color: #c4b5fd;
          margin: 30px 0;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .sidebar button {
          background: none;
          border: none;
          padding: 15px 25px;
          color: #9e8ac7;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          border-left: 4px solid transparent;
          transition: 0.3s;
        }

        .sidebar button:hover,
        .sidebar .active {
          color: #fff;
          background: #1f003d;
          border-left-color: #a78bfa;
          box-shadow: inset 0 0 10px rgba(167, 139, 250, 0.2);
        }

        .signout {
          margin: 30px;
          background: linear-gradient(90deg, #d946ef, #a855f7);
          border: none;
          padding: 12px;
          color: #fff;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.3s;
        }

        .signout:hover {
          background: linear-gradient(90deg, #ec4899, #8b5cf6);
          box-shadow: 0 0 15px rgba(217, 70, 239, 0.4);
        }

        .main {
          flex-grow: 1;
          overflow-y: auto;
          padding: 40px;
          background: linear-gradient(145deg, #0a001a, #1a0035);
        }

        h2 {
          color: #c4b5fd;
          margin-bottom: 20px;
          font-size: 1.6rem;
          text-shadow: 0 0 10px rgba(167, 139, 250, 0.2);
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: #14002a;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 25px rgba(167, 139, 250, 0.15);
        }

        th, td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid rgba(167, 139, 250, 0.2);
        }

        th {
          color: #a78bfa;
          background: #1a0033;
          font-weight: 600;
        }

        tr:hover {
          background: rgba(167, 139, 250, 0.1);
        }

        button {
          cursor: pointer;
          transition: 0.3s;
        }

        .action-btn {
          background: linear-gradient(90deg, #8b5cf6, #a855f7);
          border: none;
          color: white;
          font-weight: 600;
          padding: 8px 14px;
          border-radius: 6px;
          margin-right: 5px;
        }

        .action-btn:hover {
          box-shadow: 0 0 10px rgba(167, 139, 250, 0.3);
        }
      `}</style>

      <div className="dashboard">
        <Sidebar tab={tab} setTab={setTab} handleSignOut={handleSignOut} />

        <div className="main">
          {tab === "create" && (
            <CreateEventForm token={token} onEventCreated={fetchEvents} />
          )}
          {tab === "events" && (
            <EventsTable
              events={events}
              onDelete={handleDeleteEvent}
              onView={fetchRegistrations}
            />
          )}
          {tab === "registrations" && (
            <RegistrationsTable
              registrations={registrations}
              selectedEvent={selectedEvent}
              onStatusChange={handleUpdateStatus}
            />
          )}
          {tab === "feedback" && <FeedbackTable token={token} />}
        </div>
      </div>
    </>
  );
}
