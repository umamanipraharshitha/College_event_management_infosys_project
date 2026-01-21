import React, { useState } from "react";
import axios from "axios";
import { MessageSquare } from "lucide-react";

const API_URL = "http://localhost:3000";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [eventList, setEventList] = useState([]);

  // Feedback popup state
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("date", formData.date);
    data.append("location", formData.location);
    data.append("description", formData.description);
    if (image) data.append("image", image);

    try {
      const res = await axios.post(`${API_URL}/api/events/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Event registered successfully!");
      setEventList((prev) => [...prev, res.data.event]);
      setFormData({ name: "", date: "", location: "", description: "" });
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setError("Failed to register event. Please try again.");
    }
  };

  const submitFeedback = () => {
    if (feedbackText.trim() === "") return;
    console.log("Feedback submitted:", feedbackText);
    setFeedbackText("");
    setIsFeedbackOpen(false);
    alert("Thank you for your feedback!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-black p-6 flex flex-col items-center text-white relative">
      <h2 className="text-3xl font-bold mb-6 text-purple-400 drop-shadow-md">
        Register an Event
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-black/40 backdrop-blur-lg border border-purple-700 p-6 rounded-2xl shadow-lg w-full max-w-lg space-y-4"
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Event Name"
          required
          className="w-full p-3 border border-purple-700 bg-transparent rounded-lg focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full p-3 border border-purple-700 bg-transparent rounded-lg focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Event Location"
          required
          className="w-full p-3 border border-purple-700 bg-transparent rounded-lg focus:ring-2 focus:ring-purple-500"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Event Description"
          required
          className="w-full p-3 border border-purple-700 bg-transparent rounded-lg focus:ring-2 focus:ring-purple-500"
        />

        <div className="flex items-center gap-3">
          <label className="font-semibold text-purple-300">Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="p-2 border border-purple-700 bg-transparent rounded-lg"
          />
        </div>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-2 w-full h-48 object-cover rounded-xl border border-purple-600"
          />
        )}

        <button
          type="submit"
          className="w-full bg-purple-700 text-white p-3 rounded-lg hover:bg-purple-800 transition font-semibold"
        >
          Register Event
        </button>

        {success && <p className="text-green-400 font-semibold mt-2">{success}</p>}
        {error && <p className="text-red-400 font-semibold mt-2">{error}</p>}
      </form>

      {eventList.length > 0 && (
        <div className="mt-10 w-full max-w-4xl">
          <h3 className="text-2xl font-bold mb-4 text-purple-400">Registered Events</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventList.map((event, index) => (
              <div
                key={index}
                className="bg-black/40 border border-purple-800 rounded-2xl p-4 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition"
              >
                <img
                  src={
                    event.image?.startsWith("http")
                      ? event.image
                      : `${API_URL}/uploads/${event.image}`
                  }
                  alt="Event"
                  className="w-full h-40 object-cover rounded-lg mb-3 border border-purple-600"
                />
                <h4 className="text-xl font-semibold text-purple-300">{event.name}</h4>
                <p className="text-sm text-gray-300">{event.date}</p>
                <p className="mt-2 text-gray-400 line-clamp-3">{event.description}</p>
                <p className="text-sm mt-2 text-purple-400 font-medium">{event.location}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Floating Button */}
      <button
        onClick={() => setIsFeedbackOpen(true)}
        className="fixed bottom-6 right-6 bg-purple-700 hover:bg-purple-800 text-white p-4 rounded-full shadow-lg hover:scale-110 transition flex items-center justify-center"
      >
        <MessageSquare size={24} />
      </button>

      {/* Feedback Modal */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 to-purple-950 p-6 rounded-2xl w-96 shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-purple-700 animate-fadeIn">
            <h3 className="text-2xl font-bold mb-4 text-purple-300">We value your feedback 💬</h3>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Write your feedback..."
              className="w-full h-32 p-3 rounded-lg border border-purple-700 bg-transparent text-white focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsFeedbackOpen(false)}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                className="px-4 py-2 bg-purple-700 rounded-lg hover:bg-purple-800 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
