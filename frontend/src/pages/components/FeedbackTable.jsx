import React, { useEffect, useState } from "react";
import axios from "axios";
import { MessageCircle, Star } from "lucide-react";

const API_URL = "http://localhost:3000";

export default function FeedbackTable({ token }) {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${API_URL}/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!feedbacks.length)
    return (
      <div style={{ textAlign: "center", padding: "40px", opacity: 0.7 }}>
        <p>No feedbacks yet.</p>
      </div>
    );

  return (
    <>
      <style>{`
        .feedback-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
        }

        .feedback-card {
          background: linear-gradient(145deg, #1a132b, #23163d);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 20px;
          color: #eae6ff;
          box-shadow: 0 8px 18px rgba(147, 51, 234, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .feedback-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px rgba(147, 51, 234, 0.35);
        }

        .feedback-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .feedback-name {
          font-weight: 600;
          color: #c4b5fd;
        }

        .feedback-stars {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .feedback-stars svg {
          color: #facc15;
        }

        .feedback-message {
          color: #ddd4ff;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-top: 8px;
        }
      `}</style>

      <div className="feedback-grid">
        {feedbacks.map((f) => (
          <div className="feedback-card" key={f.id}>
            <div className="feedback-header">
              <div className="feedback-name">
                <MessageCircle size={16} style={{ marginRight: "6px" }} />
                {f.userName}
              </div>
              <div className="feedback-stars">
                {Array.from({ length: f.rating || 4 }).map((_, i) => (
                  <Star key={i} size={16} fill="#facc15" />
                ))}
              </div>
            </div>
            <div className="feedback-message">{f.comment}</div>
          </div>
        ))}
      </div>
    </>
  );
}
