import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Auth from "./pages/Auth";
import "./App.css"

function App() {
  return (
    <Routes>
      {/* Homepage */}
      <Route path="/" element={<Homepage />} />

      {/* Combined Auth (Login & Signup inside same page) */}
      <Route path="/auth" element={<Auth />} />

      {/* Dashboards */}
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />} />

      {/* Fallback */}
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
