import React from "react";

export default function Sidebar({ tab, setTab, handleSignOut }) {
  return (
    <div className="sidebar">
      <div>
        <h2>🎉 Dashboard</h2>
        <button
          className={tab === "events" ? "active" : ""}
          onClick={() => setTab("events")}
        >
          📅 Events
        </button>
        <button
          className={tab === "registrations" ? "active" : ""}
          onClick={() => setTab("registrations")}
        >
          📝 Registrations
        </button>
        <button
          className={tab === "feedback" ? "active" : ""}
          onClick={() => setTab("feedback")}
        >
          💬 Feedback
        </button>
      </div>
      <button className="signout" onClick={handleSignOut}>
        🚪 Sign Out
      </button>
    </div>
  );
}
