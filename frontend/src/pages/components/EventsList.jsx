import React, { useState, useEffect } from "react";
import axios from "axios";

const EventsList = ({ API_URL, registerForEvent }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [filterType, setFilterType] = useState("all");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchEvents();
  }, [filterType, category, date]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/events`;

      if (filterType === "myCollege") url = `${API_URL}/events/my-college`;
      else if (category) url = `${API_URL}/events/category/${category}`;
      else if (date) url = `${API_URL}/events/date/${date}`;

      const res = await axios.get(url, { headers });
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]);
    }
    setLoading(false);
  };

  return (
    <div className="events-container">
      <h2>Available Events</h2>

      {/* 🔹 Filter Bar */}
      <div className="filter-bar">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Technical">Technical</option>
          <option value="Cultural">Cultural</option>
          <option value="Sports">Sports</option>
          <option value="Workshop">Workshop</option>
          <option value="Seminar">Seminar</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          className={filterType === "myCollege" ? "active-filter" : ""}
          onClick={() =>
            setFilterType(filterType === "myCollege" ? "all" : "myCollege")
          }
        >
          {filterType === "myCollege" ? "Show All Events" : "My College Only"}
        </button>

        {(category || date || filterType !== "all") && (
          <button
            className="reset-btn"
            onClick={() => {
              setCategory("");
              setDate("");
              setFilterType("all");
            }}
          >
            Reset
          </button>
        )}
      </div>

      {/* 🔹 Events Display */}
      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <div className="event-grid">
          {events.map((ev) => (
            <div key={ev.id} className="event-card">
              {ev.image_url && (
                <img
                  src={`${API_URL}${ev.image_url}`}
                  alt={ev.title}
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
              <div className="event-card-content">
                <h3>{ev.title}</h3>
                <p>{ev.description}</p>
                <p>📍 {ev.location}</p>
                <p>
                  🗓 {ev.start_date?.slice(0, 10)} → {ev.end_date?.slice(0, 10)}
                </p>
                <button onClick={() => registerForEvent(ev.id)}>Register</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsList;
