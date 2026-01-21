import React from "react";
import { Edit3, Trash2, Users } from "lucide-react";

export default function EventsTable({ events, onDelete, onView }) {
  if (!events.length)
    return (
      <div style={{ textAlign: "center", padding: "40px", opacity: 0.7 }}>
        <p>No events found.</p>
      </div>
    );

  return (
    <>
      <style>{`
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .event-card {
          background: linear-gradient(145deg, #1a132b, #261945);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 25px;
          color: #eae6ff;
          box-shadow: 0 8px 20px rgba(147, 51, 234, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .event-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 30px rgba(147, 51, 234, 0.35);
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .event-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #d8b4fe;
        }

        .event-body {
          line-height: 1.6;
          color: #cfc6f8;
          margin-bottom: 20px;
        }

        .event-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .event-btn {
          border: none;
          outline: none;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          border-radius: 10px;
          padding: 8px 14px;
          transition: 0.3s;
        }

        .event-btn.view {
          background: linear-gradient(90deg, #6d28d9, #9333ea);
          color: white;
        }

        .event-btn.view:hover {
          filter: brightness(1.1);
          transform: scale(1.05);
        }

        .event-btn.edit {
          background: rgba(255,255,255,0.08);
          color: #c4b5fd;
        }

        .event-btn.edit:hover {
          background: rgba(255,255,255,0.15);
          transform: scale(1.05);
        }

        .event-btn.delete {
          background: rgba(255,0,76,0.08);
          color: #ff5c8a;
        }

        .event-btn.delete:hover {
          background: rgba(255,0,76,0.15);
          transform: scale(1.05);
        }

        .footer-left {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #a78bfa;
        }
      `}</style>

      <div className="events-grid">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            <div className="event-header">
              <h3 className="event-title">{event.title}</h3>
              <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                {new Date(event.date).toLocaleDateString()}
              </span>
            </div>

            <div className="event-body">
              <p><strong>Venue:</strong> {event.venue}</p>
              <p><strong>Organizer:</strong> {event.organizer || "Admin"}</p>
              <p style={{ opacity: 0.9 }}>{event.description}</p>
            </div>

            <div className="event-footer">
              <div className="footer-left">
                <Users size={18} />
                <span>{event.participantsCount || 0} registered</span>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button className="event-btn view" onClick={() => onView(event.id)}>
                  View
                </button>

                <button className="event-btn edit">
                  <Edit3 size={16} /> Edit
                </button>

                <button className="event-btn delete" onClick={() => onDelete(event.id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
