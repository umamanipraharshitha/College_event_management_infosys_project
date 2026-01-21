import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

export default function CreateEventForm({ token, onEventCreated, isDark }) {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    start_date: "",
    end_date: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) data.append(key, formData[key]);
    if (image) data.append("image", image);

    try {
      await axios.post(`${API_URL}/events`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ Event created successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        start_date: "",
        end_date: "",
      });
      setImage(null);
      onEventCreated();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create event");
    }
  };

  return (
    <>
      <style>{`
        .create-container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 30px 20px;
        }

        .create-card {
          width: 100%;
          max-width: 600px;
          padding: 25px 30px;
          border-radius: 12px;
          border: 1px solid ${isDark ? "#333" : "#ccc"};
          background: ${isDark ? "#1e1e1e" : "#fff"};
          color: ${isDark ? "#eee" : "#222"};
          box-shadow: ${isDark
            ? "0 0 10px rgba(0,0,0,0.4)"
            : "0 2px 8px rgba(0,0,0,0.1)"};
        }

        .create-card h2 {
          text-align: center;
          margin-bottom: 20px;
          font-size: 1.4rem;
          color: ${isDark ? "#b28dff" : "#4b0082"};
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        label {
          font-weight: 500;
        }

        input, textarea, select {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid ${isDark ? "#444" : "#ccc"};
          background: ${isDark ? "#2c2c2c" : "#f9f9f9"};
          color: ${isDark ? "#eee" : "#222"};
          font-size: 15px;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: ${isDark ? "#8b5cf6" : "#7c3aed"};
        }

        .date-row {
          display: flex;
          gap: 15px;
        }

        button {
          background: ${isDark ? "#7c3aed" : "#5b21b6"};
          color: #fff;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }

        button:hover {
          background: ${isDark ? "#6d28d9" : "#4c1d95"};
        }
      `}</style>

      <div className="create-container">
        <div className="create-card">
          <h2>Create New Event</h2>
          <form onSubmit={handleCreateEvent} encType="multipart/form-data">
            <div>
              <label>Event Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Category</label>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="date-row">
              <div style={{ flex: 1 }}>
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label>Event Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <button type="submit">Create Event</button>
          </form>
        </div>
      </div>
    </>
  );
}
