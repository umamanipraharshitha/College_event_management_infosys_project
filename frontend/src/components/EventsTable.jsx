import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, X, MessageSquare } from "lucide-react";

const API_URL = "http://localhost:3000";

export default function EventsTable({ theme }) {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async (eventId) => {
    if (feedbacks[eventId]) {
      const updated = { ...feedbacks };
      delete updated[eventId];
      setFeedbacks(updated);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/feedback/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedbacks((prev) => ({ ...prev, [eventId]: res.data }));
    } catch {
      alert("Failed to fetch feedback");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`${API_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    } catch {
      alert("Failed to delete event");
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      location: event.location,
      start_date: event.start_date.split("T")[0],
      end_date: event.end_date.split("T")[0],
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/events/${editingEvent.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingEvent(null);
      fetchEvents();
    } catch {
      alert("Failed to update event");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div
      className={`min-h-screen px-6 py-10 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#0e0e11] text-gray-100"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      <h1 className="text-3xl font-semibold mb-8 text-center">
        Events Dashboard
      </h1>

      {/* LOADING STATE */}
      {loading ? (
        <p className="text-center opacity-70">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-center opacity-70">No events found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-5 border transition-transform duration-300 shadow-sm hover:scale-[1.02] ${
                theme === "dark"
                  ? "bg-[#1c1c22] border-gray-700"
                  : "bg-white border-gray-300"
              }`}
            >
              {event.image_url && (
                <img
                  src={`${API_URL}${event.image_url}`}
                  alt={event.title}
                  className="rounded-lg mb-3 w-full h-40 object-cover"
                />
              )}
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm opacity-80 mb-2">{event.description}</p>
              <p className="text-xs opacity-60">
                📍 {event.location} | 🕒{" "}
                {new Date(event.start_date).toLocaleDateString()} –{" "}
                {new Date(event.end_date).toLocaleDateString()}
              </p>

              <div className="flex justify-end mt-4 gap-3">
                <button
                  onClick={() => handleEdit(event)}
                  className={`p-2 rounded-md border ${
                    theme === "dark"
                      ? "hover:bg-gray-700 border-gray-600"
                      : "hover:bg-gray-200 border-gray-300"
                  }`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className={`p-2 rounded-md border text-red-500 ${
                    theme === "dark"
                      ? "hover:bg-red-800 border-gray-600"
                      : "hover:bg-red-100 border-gray-300"
                  }`}
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => fetchFeedback(event.id)}
                  className={`p-2 rounded-md border text-blue-500 ${
                    theme === "dark"
                      ? "hover:bg-gray-800 border-gray-600"
                      : "hover:bg-blue-50 border-gray-300"
                  }`}
                >
                  <MessageSquare size={16} />
                </button>
              </div>

              {/* FEEDBACK SECTION */}
              <AnimatePresence>
                {feedbacks[event.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 border-t border-gray-600 pt-3 space-y-2"
                  >
                    <h4 className="font-medium text-sm mb-1">Feedback</h4>
                    {feedbacks[event.id].length === 0 ? (
                      <p className="text-xs opacity-60">No feedback yet.</p>
                    ) : (
                      feedbacks[event.id].map((f) => (
                        <div
                          key={f.feedback_id}
                          className={`rounded-lg p-3 border ${
                            theme === "dark"
                              ? "border-gray-700 bg-[#121216]"
                              : "border-gray-300 bg-gray-50"
                          }`}
                        >
                          <div className="flex justify-between items-center text-xs opacity-70 mb-1">
                            <span>{f.student_name}</span>
                            <span>⭐ {f.rating}</span>
                          </div>
                          <p className="text-sm italic opacity-90">
                            “{f.feedback_text}”
                          </p>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* EDIT POPUP */}
      <AnimatePresence>
        {editingEvent && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative rounded-xl shadow-lg p-6 w-full max-w-md ${
                theme === "dark"
                  ? "bg-[#1c1c22] text-gray-100"
                  : "bg-white text-gray-900"
              }`}
            >
              <button
                onClick={() => setEditingEvent(null)}
                className="absolute top-4 right-4 opacity-70 hover:opacity-100"
              >
                <X size={22} />
              </button>

              <h2 className="text-xl font-semibold mb-4 text-center">
                Edit Event
              </h2>
              <form onSubmit={handleSave} className="flex flex-col gap-3">
                {["title", "description", "category", "location"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className={`rounded-md p-2 border ${
                      theme === "dark"
                        ? "bg-[#0f0f12] border-gray-700"
                        : "bg-gray-50 border-gray-300"
                    }`}
                  />
                ))}

                <div className="flex gap-3">
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date || ""}
                    onChange={handleChange}
                    className={`rounded-md p-2 border w-1/2 ${
                      theme === "dark"
                        ? "bg-[#0f0f12] border-gray-700"
                        : "bg-gray-50 border-gray-300"
                    }`}
                  />
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date || ""}
                    onChange={handleChange}
                    className={`rounded-md p-2 border w-1/2 ${
                      theme === "dark"
                        ? "bg-[#0f0f12] border-gray-700"
                        : "bg-gray-50 border-gray-300"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className={`mt-3 rounded-md py-2 font-medium ${
                    theme === "dark"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-indigo-500 hover:bg-indigo-600 text-white"
                  }`}
                >
                  Save Changes
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
