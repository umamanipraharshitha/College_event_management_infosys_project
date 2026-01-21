import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/login", formData);
      const { token, role, id } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("id", id);
      if (role === "student") navigate("/user-dashboard");
      else if (role === "college_admin") navigate("/admin-dashboard");
      else if (role === "superadmin") navigate("/superadmin-dashboard");
      else navigate("/");
    } catch (error) {
      alert(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0914",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 540,
          background: "rgba(11, 9, 20, 0.98)",
          borderRadius: 18,
          boxShadow: "0 0 32px 4px #9040ff90",
          padding: "0",
          position: "relative",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {/* Left Panel */}
        <div
          style={{
            flex: 1,
            background: "linear-gradient(135deg,#4f2d7f 62%,#9f48ff 100%)",
            color: "#fff",
            padding: "2.8rem 2.2rem 2.8rem 2.4rem",
            clipPath:
              "polygon(0 0,100% 0,70% 100%,0 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "180px",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "2rem", marginBottom: "0.2rem", letterSpacing: "0.02em" }}>
            WELCOME<br />BACK!
          </div>
          <div style={{ marginTop: ".6rem", fontSize: "1.06rem", color: "#e1d5f9" }}>
            Lorem ipsum, dolor sit amet<br />consectetur adipisicing.
          </div>
        </div>
        {/* Right Panel & Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            flex: 1.1,
            background: "#1c182b",
            padding: "2.5rem 2.2rem 1.5rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "1.6rem", marginBottom: "1.3rem", letterSpacing: "0.02em", color: "#fff" }}>
            Login
          </div>
          <label style={{ fontSize: "1.01rem", color: "#e9e7ef", marginBottom: "0.4rem" }}>
            Username
            <div style={{ position: "relative", marginTop: "0.3rem" }}>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  borderBottom: "2px solid #7754cc",
                  color: "#fff",
                  fontSize: "1.07rem",
                  fontWeight: 500,
                  padding: "0.8rem 2rem 0.8rem 0.7rem",
                  marginBottom: "0.7rem",
                  outline: "none",
                  letterSpacing: "0.01em",
                }}
                autoComplete="username"
              />
              <span style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#b576f7",
                fontSize: "1.20rem",
                pointerEvents: "none"
              }}>👤</span>
            </div>
          </label>
          <label style={{ fontSize: "1.01rem", color: "#e9e7ef", marginBottom: "0.4rem" }}>
            Password
            <div style={{ position: "relative", marginTop: "0.3rem" }}>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  borderBottom: "2px solid #7754cc",
                  color: "#fff",
                  fontSize: "1.07rem",
                  fontWeight: 500,
                  padding: "0.8rem 2rem 0.8rem 0.7rem",
                  marginBottom: "0.7rem",
                  outline: "none",
                  letterSpacing: "0.01em",
                }}
                autoComplete="current-password"
              />
              <span style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#b576f7",
                fontSize: "1.20rem",
                pointerEvents: "none"
              }}>🔒</span>
            </div>
          </label>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.80rem",
              background: "linear-gradient(90deg,#a970f7 0%,#7720ff 100%)",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.08rem",
              border: "none",
              borderRadius: "18px",
              marginTop: "0.7rem",
              boxShadow: "0 0px 14px #6a28bf67",
              cursor: "pointer",
              transition: "background 0.24s",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div style={{ marginTop: "1.5rem", color: "#dddbea", fontSize: "1.04rem", textAlign: "center" }}>
            Don’t have an account?
            <Link
              to="/signup"
              style={{
                color: "#c689fe",
                marginLeft: "1.2rem",
                textDecoration: "underline",
                fontWeight: 700,
              }}
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
