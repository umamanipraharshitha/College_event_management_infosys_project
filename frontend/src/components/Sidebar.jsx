export default function Sidebar({ tab, setTab, handleSignOut }) {
  return (
    <div className="sidebar">
      <div>
        <h2>Admin Panel</h2>
        <button
          className={tab === "create" ? "active" : ""}
          onClick={() => setTab("create")}
        >
          ➕ Create Event
        </button>
        <button
          className={tab === "events" ? "active" : ""}
          onClick={() => setTab("events")}
        >
          📅 Manage Events
        </button>
      
        <button
          className={tab === "feedback" ? "active" : ""}
          onClick={() => setTab("feedback")}
        >
          💬 Feedback
        </button>
      </div>

      <button className="signout" onClick={handleSignOut}>
        Logout
      </button>
    </div>
  );
}
