import React, { useState } from "react";
import axios from "axios";
import { MessageSquare, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisteredEvents({ registered, API_URL }) {
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const [openEvent, setOpenEvent] = useState(null);
  const [feedbacks, setFeedbacks] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFeedbackChange = (eventId, field, value) => {
    setFeedbacks({
      ...feedbacks,
      [eventId]: { ...feedbacks[eventId], [field]: value },
    });
  };

  const submitFeedback = async (eventId) => {
    const { rating, comment } = feedbacks[eventId] || {};
    if (!rating) return alert("Please select a rating!");

    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/feedback`,
        {
          event_id: eventId,
          user_id: userId,
          rating,
          comment: comment || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Feedback submitted successfully!");
      setOpenEvent(null);
      setFeedbacks((prev) => ({
        ...prev,
        [eventId]: { rating: "", comment: "" },
      }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error submitting feedback.");
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ eventId }) => {
    const rating = feedbacks[eventId]?.rating || 0;
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((num) => (
          <Star
            key={num}
            size={28}
            className={`star ${num <= rating ? "active" : ""}`}
            onClick={() => handleFeedbackChange(eventId, "rating", num)}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <style>{`
        body {
          background: radial-gradient(circle at top left, #0b0017, #100028 60%, #18003a);
        }

        .events-container {
          padding: 50px;
          color: #e9d5ff;
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
        }

        h2 {
          text-align: center;
          color: #c4b5fd;
          font-size: 2rem;
          margin-bottom: 35px;
          letter-spacing: 1px;
        }

        .event-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
        }

        .event-card {
          background: rgba(25, 0, 50, 0.9);
          border-radius: 18px;
          border: 1px solid rgba(168, 85, 247, 0.35);
          box-shadow: 0 0 25px rgba(168, 85, 247, 0.3);
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .event-card img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          border-bottom: 1px solid rgba(167, 139, 250, 0.2);
        }

        .event-details {
          padding: 20px;
        }

        .event-details h3 {
          color: #d8b4fe;
          font-size: 1.2rem;
          margin-bottom: 8px;
        }

        .event-details p {
          color: #cfc2f9;
          font-size: 0.9rem;
          margin: 3px 0;
        }

        .feedback-icon {
          margin: 20px auto 25px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7e22ce, #9333ea);
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          cursor: pointer;
          transition: 0.3s ease;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.6);
        }

        .feedback-icon:hover {
          transform: scale(1.1);
        }

        /* Modal Styling */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-box {
          background: rgba(25, 0, 50, 0.95);
          border: 1px solid rgba(168, 85, 247, 0.4);
          border-radius: 16px;
          padding: 30px;
          width: 90%;
          max-width: 550px;
          box-shadow: 0 0 40px rgba(168, 85, 247, 0.5);
          text-align: center;
        }

        .close-btn {
          position: absolute;
          top: 15px;
          right: 20px;
          background: none;
          border: none;
          color: #c4b5fd;
          font-size: 1.3rem;
          cursor: pointer;
        }

        .stars {
          display: flex;
          justify-content: center;
          margin: 15px 0;
        }

        .star {
          color: #4b0082;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .star.active {
          color: #a855f7;
          transform: scale(1.2);
          filter: drop-shadow(0 0 6px #9333ea);
        }

        textarea {
          width: 100%;
          background: rgba(35, 0, 70, 0.9);
          border: 1px solid #7e22ce;
          border-radius: 10px;
          padding: 12px;
          color: #fff;
          font-size: 1rem;
          resize: none;
          min-height: 100px;
          margin-top: 10px;
          margin-bottom: 20px;
        }

        .modal-btn {
          background: linear-gradient(90deg, #7e22ce, #9333ea);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
          width: 100%;
        }

        .modal-btn:hover {
          background: linear-gradient(90deg, #9333ea, #a855f7);
          box-shadow: 0 0 20px rgba(167, 139, 250, 0.6);
        }
      `}</style>

      <div className="events-container">
        <h2>Your Registered Events</h2>
        <div className="event-grid">
          {registered.length === 0 ? (
            <p style={{ textAlign: "center", color: "#c4b5fd" }}>
              You haven’t registered for any events yet.
            </p>
          ) : (
            registered.map((ev) => (
              <motion.div
                key={ev.registration_id}
                className="event-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={
                    ev.image_url
                      ? `${API_URL.replace(/\/$/, "")}/${ev.image_url.replace(
                          /^\//,
                          ""
                        )}`
                      : "/fallback.jpg"
                  }
                  alt={ev.event_title}
                  onError={(e) => (e.target.src = "/fallback.jpg")}
                />
                <div className="event-details">
                  <h3>{ev.event_title}</h3>
                  <p>📅 {new Date(ev.start_date).toLocaleDateString()}</p>
                  <p>📍 {ev.location || "Venue not specified"}</p>
                </div>

                <div
                  className="feedback-icon"
                  onClick={() => setOpenEvent(ev.event_id)}
                >
                  <MessageSquare size={22} />
                </div>

                <AnimatePresence>
                  {openEvent === ev.event_id && (
                    <motion.div
                      className="modal-overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setOpenEvent(null)}
                    >
                      <motion.div
                        className="modal-box"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="close-btn"
                          onClick={() => setOpenEvent(null)}
                        >
                          ✕
                        </button>
                        <h3>Feedback for {ev.event_title}</h3>

                        <StarRating eventId={ev.event_id} />

                        <textarea
                          placeholder="Write your feedback..."
                          value={feedbacks[ev.event_id]?.comment || ""}
                          onChange={(e) =>
                            handleFeedbackChange(
                              ev.event_id,
                              "comment",
                              e.target.value
                            )
                          }
                        />

                        <button
                          className="modal-btn"
                          onClick={() => submitFeedback(ev.event_id)}
                          disabled={loading}
                        >
                          {loading ? "Submitting..." : "Submit Feedback"}
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
