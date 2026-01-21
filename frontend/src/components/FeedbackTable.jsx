import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { MessageSquare, Star } from "lucide-react";

const API_URL = "http://localhost:3000";

export default function FeedbackTable({ token }) {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await axios.get(`${API_URL}/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Error fetching feedback:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#1a001f] to-black text-white py-10 px-6 overflow-x-auto">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-center text-purple-400 mb-10 tracking-wide drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
      >
        💬 Feedback Overview
      </motion.h2>

      {feedbacks.length === 0 ? (
        <p className="text-center text-gray-500 mt-20 text-lg">
          No feedback available yet.
        </p>
      ) : (
        <div className="max-w-7xl mx-auto bg-[#1a0026] border border-purple-700 rounded-2xl shadow-[0_0_30px_10px_rgba(168,85,247,0.2)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#2d0040] text-purple-300">
              <tr>
                <th className="py-3 px-5 border-b border-purple-800">Event</th>
                <th className="py-3 px-5 border-b border-purple-800">Feedback</th>
                <th className="py-3 px-5 border-b border-purple-800">Rating</th>
                <th className="py-3 px-5 border-b border-purple-800">User</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((f, index) => (
                <motion.tr
                  key={f.feedback_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-[#25003a] transition duration-200"
                >
                  <td className="py-4 px-5 text-purple-200 font-medium">
                    {f.event_title}
                  </td>
                  <td className="py-4 px-5 text-gray-300 flex items-start gap-2">
                    <MessageSquare size={16} className="text-purple-400 mt-1" />
                    {f.feedback_text || "No comment provided."}
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex">
                      {[...Array(f.rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className="text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-5 text-purple-300 font-medium">
                    👤 {f.student_name}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
