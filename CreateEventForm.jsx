import React, { useState } from "react";
import axios from "axios";
import { CalendarDays, MapPin, FileText, Loader2 } from "lucide-react";

const API_URL = "http://localhost:3000";

export default function CreateEventForm({ token, onEventCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/events`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onEventCreated();
      setForm({ title: "", description: "", date: "", venue: "" });
      alert("🎉 Event created successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .form-container {
          max-width: 600px;
          margin: 0 auto;
          background: linear-gradient(145deg, #1a132b, #261945);
          padding: 35px;
          border-radius: 18px;
          color: #eae6ff;
          box-shadow: 0 10px 30px rgba(147, 51, 234, 0.2);
          border: 1px solid rgba(255,255,255,0.1);
          transition: 0.3s ease;
        }

        .form-container:hover {
          box-shadow: 0 10px 40px rgba(147, 51, 234, 0.3);
        }

        .form-container h2 {
          text-align: center;
          margin-bottom: 25px;
          font-size: 1.5rem;
          color: #d8b4fe;
          letter-spacing: 0.5px;
        }

        .input-group {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 10px 14px;
          transition: 0.3s;
        }

        .input-group:focus-within {
          border-color: #a78bfa;
          box-shadow: 0 0 8px rgba(167, 139, 250, 0.4);
        }

        .input-group input,
        .input-group textarea {
          background: transparent;
          border: none;
          outline: none;
          color: #eae6ff;
          font-size: 0.95rem;
          width: 100%;
          resize: none;
        }

        .input-group input::placeholder,
        .input-group textarea::placeholder {
          color: #9d8bc2;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(90deg, #6d28d9, #9333ea);
          border: none;
          border-radius: 10px;
          color: white;
          font-weight: 600;
          padding: 12px 20px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.3s ease;
        }

        .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 15px rgba(147, 51, 234, 0.5);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <form className="form-container" onSubmit={handleSubmit}>
        <h2>Create a New Event</h2>

        <div className="input-group">
          <FileText size={18} />
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <CalendarDays size={18} />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <MapPin size={18} />
          <input
            type="text"
            name="venue"
            placeholder="Event Venue"
            value={form.venue}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <textarea
            name="description"
            placeholder="Event Description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={18} /> : "Create Event"}
        </button>
      </form>
    </>
  );
}
