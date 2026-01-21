import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    role: "",
  });

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage("");
    setFormData({
      name: "",
      email: "",
      password: "",
      college: "",
      role: "",
    });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? "http://localhost:3000/login"
      : "http://localhost:3000/signup";

    try {
      const res = await axios.post(url, formData);
      if (isLogin) {
        const { token, role, id } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("id", id);

        if (role === "student" || role === "user") navigate("/user-dashboard");
        else if (role === "college_admin") navigate("/admin-dashboard");
        else if (role === "superadmin") navigate("/superadmin-dashboard");
        else navigate("/");
      } else {
        setMessage("Signup successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <>
      {/* Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        body {
          background: linear-gradient(135deg, #0b001a, #0f0613ff, #000000);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .container {
          background: #0b020eff;
          border-radius: 25px;
          box-shadow: 0 0 30px rgba(194, 183, 206, 0.3);
          position: relative;
          overflow: hidden;
          width: 820px;
          max-width: 100%;
          min-height: 480px;
          transition: all 0.6s ease-in-out;
        }

        .container form {
          background-color: #0b010fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 40px;
          height: 100%;
          text-align: center;
        }

        .container h1 {
          color: #c689fe;
          margin-bottom: 10px;
          font-weight: 700;
          font-size: 1.8rem;
        }

        .container p {
          font-size: 14px;
          color: #cfc3e8;
          margin: 20px 0;
        }

        .container span {
          font-size: 12px;
          color: #aaa;
        }

        .container input,
        .container select {
          background-color: #1c1c1c;
          border: 1px solid #462d6dff;
          color: #e6dcff;
          margin: 8px 0;
          padding: 10px 15px;
          font-size: 14px;
          border-radius: 8px;
          width: 100%;
          outline: none;
          transition: border 0.3s;
        }

        .container input:focus,
        .container select:focus {
          border: 1px solid #6c4c99ff;
        }

        .container button {
          background: linear-gradient(135deg, #6e4bbf, #c689fe);
          color: #fff;
          font-size: 13px;
          padding: 10px 45px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          text-transform: uppercase;
          margin-top: 15px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 15px rgba(160, 84, 255, 0.3);
        }

        .container button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(198, 137, 254, 0.4);
        }

        .social-icons {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin: 15px 0;
        }

        .social-icons a {
          border: 1px solid #4c3a64;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          color: #c689fe;
          transition: all 0.3s ease;
        }

        .social-icons a:hover {
          background: #c689fe;
          color: #fff;
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(198, 137, 254, 0.6);
        }

        .form-container {
          position: absolute;
          top: 0;
          height: 100%;
          transition: all 0.6s ease-in-out;
        }

        .sign-in {
          left: 0;
          width: 50%;
          z-index: 2;
        }

        .container.active .sign-in {
          transform: translateX(100%);
        }

        .sign-up {
          left: 0;
          width: 50%;
          opacity: 0;
          z-index: 1;
        }

        .container.active .sign-up {
          transform: translateX(100%);
          opacity: 1;
          z-index: 5;
        }

        .toggle-container {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transition: all 0.6s ease-in-out;
          border-radius: 150px 0 0 100px;
          z-index: 1000;
        }

        .container.active .toggle-container {
          transform: translateX(-100%);
          border-radius: 0 150px 100px 0;
        }

        .toggle {
          background: linear-gradient(to right, #694ea9ff, #653a8eff);
          color: #1a0a23ff;
          position: relative;
          left: -100%;
          width: 200%;
          height: 100%;
          transform: translateX(0);
          transition: all 0.6s ease-in-out;
        }

        .container.active .toggle {
          transform: translateX(50%);
        }

        .toggle-panel {
          position: absolute;
          width: 50%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 30px;
          text-align: center;
          transition: all 0.6s ease-in-out;
        }

        .toggle-panel h1 {
          font-size: 1.8rem;
          color: #3c0e43ff;
        }

        .toggle-panel p {
          color: #f2e6ff;
          font-size: 0.9rem;
          margin: 10px 0 15px;
        }

        .toggle-panel button {
          background: none;
          border: 2px solid #fff;
          padding: 10px 40px;
          border-radius: 8px;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .toggle-panel button:hover {
          background: #fff;
          color: #49376eff;
        }

        .toggle-left {
          transform: translateX(-200%);
        }

        .container.active .toggle-left {
          transform: translateX(0);
        }

        .toggle-right {
          right: 0;
          transform: translateX(0);
        }

        .container.active .toggle-right {
          transform: translateX(200%);
        }

        .message {
          text-align: center;
          color: #9785a7ff;
          margin-top: 10px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* 🌐 Responsive Design */
        @media (max-width: 900px) {
          .container {
            width: 95%;
            min-height: 550px;
          }
        }

        @media (max-width: 768px) {
          body {
            height: auto;
            padding: 40px 0;
          }

          .container {
            width: 90%;
            height: auto;
            display: flex;
            flex-direction: column;
          }

          .form-container,
          .sign-in,
          .sign-up {
            position: relative;
            width: 100%;
            opacity: 1 !important;
            transform: none !important;
          }

          .toggle-container {
            display: none;
          }

          .container form {
            padding: 20px;
          }

          .container h1 {
            font-size: 1.5rem;
          }

          .container input,
          .container select {
            font-size: 13px;
          }

          .container button {
            padding: 10px 35px;
          }

          .message {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .container {
            width: 100%;
            border-radius: 0;
            min-height: 100vh;
            box-shadow: none;
          }

          .container form {
            padding: 20px;
          }

          .container h1 {
            font-size: 1.3rem;
          }

          .container button {
            width: 100%;
            padding: 10px;
          }
        }
      `}</style>

      <div className={`container ${!isLogin ? "active" : ""}`} id="container">
        {/* Signup Form */}
        <div className="form-container sign-up">
          <form onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <span>Use your email for registration</span>
            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              name="college"
              placeholder="College Name"
              value={formData.college}
              onChange={handleChange}
              required
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
            </select>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* Login Form */}
        <div className="form-container sign-in">
          <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            <span>Use your email and password</span>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* Toggle Panels */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your details to continue</p>
              <button onClick={toggleForm}>Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register and start your journey with us</p>
              <button onClick={toggleForm}>Sign Up</button>
            </div>
          </div>
        </div>
        {message && <p className="message">{message}</p>}
      </div>
    </>
  );
};

export default Auth;
