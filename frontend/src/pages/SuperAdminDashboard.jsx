import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${API_URL}/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/create-admin`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Admin added successfully!");
      setFormData({ name: "", email: "", password: "", college: "" });
      fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add admin");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          font-family: 'Poppins', sans-serif;
          background: #050009;
          color: #e0d5ff;
        }

        .navbar {
          background: rgba(20, 0, 40, 0.85);
          border-bottom: 1px solid rgba(150, 80, 255, 0.3);
          box-shadow: 0 0 20px rgba(100, 50, 200, 0.2);
          padding: 20px 6%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          backdrop-filter: blur(12px);
        }

        .navbar h1 {
          color: #b084ff;
          font-size: 1.6rem;
          margin: 0;
          font-weight: 600;
        }

        .logout-btn {
          background: linear-gradient(90deg, #a855f7, #7c3aed);
          color: #fff;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: linear-gradient(90deg, #9333ea, #6d28d9);
          box-shadow: 0 0 15px rgba(150, 80, 255, 0.4);
          transform: translateY(-1px);
        }

        .dashboard {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 60px 5%;
          gap: 60px;
          background: radial-gradient(circle at top left, #18002b, #050009 70%);
          min-height: calc(100vh - 90px);
        }

        .glass-card, .admins-list {
          flex: 1;
          background: rgba(15, 0, 30, 0.8);
          border: 1px solid rgba(120, 50, 255, 0.3);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 0 25px rgba(130, 70, 255, 0.2);
          backdrop-filter: blur(18px);
          transition: all 0.3s ease;
        }

        .glass-card:hover, .admins-list:hover {
          border-color: rgba(160, 90, 255, 0.5);
          box-shadow: 0 0 35px rgba(150, 80, 255, 0.35);
        }

        .card-header {
          background: linear-gradient(90deg, #6d28d9, #a855f7);
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
          text-align: center;
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 20px;
          letter-spacing: 0.5px;
          box-shadow: 0 0 12px rgba(150, 80, 255, 0.3);
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 12px;
          color: #eae1ff;
          font-size: 0.95rem;
          outline: none;
          transition: 0.3s;
        }

        input:focus {
          border-color: #9146ff;
          box-shadow: 0 0 12px rgba(150, 80, 255, 0.3);
          background: rgba(255, 255, 255, 0.08);
        }

        button {
          background: linear-gradient(90deg, #6d28d9, #a855f7);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s ease;
          font-size: 1rem;
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 18px rgba(150, 80, 255, 0.4);
        }

        .admins-list {
          overflow-y: auto;
          max-height: 80vh;
        }

        .admin-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 14px;
          transition: 0.3s;
        }

        .admin-card:hover {
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 10px rgba(120, 50, 255, 0.25);
        }

        .admin-card strong {
          color: #d6b3ff;
        }

        .admin-card span {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        @media (max-width: 900px) {
          .dashboard {
            flex-direction: column;
            padding: 40px 8%;
            gap: 40px;
          }
        }
      `}</style>

      {/* Top Navigation */}
      <div className="navbar">
        <div>
          <h1>Super Admin Dashboard</h1>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard">
        {/* Add Admin */}
        <div className="glass-card">
          <div className="card-header">Add College Admin</div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="college"
              placeholder="College Name"
              value={formData.college}
              onChange={handleChange}
              required
            />
            <button type="submit">Create Admin</button>
          </form>
        </div>

        {/* Admins List */}
        <div className="admins-list">
          <div className="card-header">College Admins</div>
          {admins.length === 0 ? (
            <p style={{ textAlign: "center", opacity: 0.6 }}>No admins yet.</p>
          ) : (
            admins.map((admin) => (
              <div className="admin-card" key={admin.id}>
                <strong>{admin.name}</strong> <br />
                {admin.email} <br />
                <span>{admin.college}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
