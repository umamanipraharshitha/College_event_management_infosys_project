import React from "react";

const EventList = ({ title, events, loading, onRegister, isRegisteredList }) => {
  return (
    <>
      <style>{`
        .event-section {
          margin-bottom: 40px;
        }

        .event-title {
          color: #c689fe;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 15px;
          text-align: center;
        }

        .event-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .event-card {
          background: rgba(17, 17, 17, 0.9);
          border: 1px solid rgba(86, 48, 142, 0.4);
          border-radius: 16px;
          padding: 20px;
          color: #e6dcff;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0 25px rgba(198, 137, 254, 0.3);
        }

        .event-card h3 {
          color: #bfa2f7;
          margin-bottom: 8px;
        }

        .event-card small {
          display: block;
          color: #a59fb6;
          margin-bottom: 10px;
        }

        .event-card button {
          background: linear-gradient(135deg, #6e4bbf, #c689fe);
          border: none;
          color: #fff;
          padding: 8px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          transition: all 0.3s ease;
        }

        .event-card button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(198, 137, 254, 0.4);
        }

        .no-events {
          color: #ccc;
          text-align: center;
          font-size: 0.95rem;
          margin-top: 10px;
        }
      `}</style>

      <div className="event-section">
        <h2 className="event-title">{title}</h2>
        {loading ? (
          <p className="no-events">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="no-events">
            No {isRegisteredList ? "registered" : ""} events found.
          </p>
        ) : (
          <div className="event-grid">
            {events.map((event) =>
              isRegisteredList ? (
                <div className="event-card" key={event.registration_id}>
                  <h3>{event.event_title}</h3>
                  <small>Status: {event.status}</small>
                  <small>
                    {new Date(event.start_date).toLocaleDateString()} –{" "}
                    {new Date(event.end_date).toLocaleDateString()}
                  </small>
                </div>
              ) : (
                <div className="event-card" key={event.id}>
                  <h3>{event.title}</h3>
                  <small>Category: {event.category}</small>
                  <small>
                    {new Date(event.start_date).toLocaleDateString()} –{" "}
                    {new Date(event.end_date).toLocaleDateString()}
                  </small>
                  <button onClick={() => onRegister(event.id)}>Register</button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default EventList;
