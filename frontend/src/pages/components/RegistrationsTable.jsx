import React from "react";

export default function RegistrationsTable({
  registrations,
  selectedEvent,
  onStatusChange,
  theme,
}) {
  const darkMode = theme === "dark";

  return (
    <div className="registrations-container">
      <style>{`
        .registrations-container {
          padding: 20px;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          background: ${darkMode ? "#1a132b" : "#fff"};
          color: ${darkMode ? "#f3e8ff" : "#1e1e2f"};
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        }

        th, td {
          padding: 14px 18px;
          text-align: left;
          border-bottom: 1px solid ${darkMode ? "#322b50" : "#eee"};
          font-size: 0.95rem;
        }

        th {
          background: ${darkMode ? "#2a2250" : "#f5f3ff"};
          color: ${darkMode ? "#dcd1ff" : "#4b0082"};
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.85rem;
        }

        tr:hover {
          background: ${darkMode ? "rgba(255,255,255,0.05)" : "#faf5ff"};
        }

        .status {
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 8px;
          text-transform: capitalize;
          font-size: 0.85rem;
        }

        .pending {
          background: ${darkMode ? "#3b2d72" : "#ede9fe"};
          color: ${darkMode ? "#f5e9ff" : "#6b21a8"};
        }
        .approved {
          background: ${darkMode ? "#065f46" : "#dcfce7"};
          color: ${darkMode ? "#a7f3d0" : "#166534"};
        }
        .rejected {
          background: ${darkMode ? "#7f1d1d" : "#fee2e2"};
          color: ${darkMode ? "#fecaca" : "#991b1b"};
        }

        .action-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          margin-right: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.3s;
        }

        .approve {
          background: linear-gradient(90deg, #16a34a, #22c55e);
          color: white;
        }

        .reject {
          background: linear-gradient(90deg, #dc2626, #ef4444);
          color: white;
        }

        .approve:hover {
          transform: scale(1.05);
          box-shadow: 0 0 10px rgba(34,197,94,0.4);
        }

        .reject:hover {
          transform: scale(1.05);
          box-shadow: 0 0 10px rgba(239,68,68,0.4);
        }

        @media (max-width: 700px) {
          table, th, td {
            font-size: 0.8rem;
          }
          .action-btn {
            padding: 4px 8px;
            font-size: 0.75rem;
          }
        }
      `}</style>

      <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
        {selectedEvent ? `Registrations for Event ID: ${selectedEvent}` : "Registrations"}
      </h2>

      {registrations.length === 0 ? (
        <p style={{ textAlign: "center", opacity: 0.7 }}>
          No registrations found for this event.
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>College</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg, index) => (
              <tr key={reg.id}>
                <td>{index + 1}</td>
                <td>{reg.name || "N/A"}</td>
                <td>{reg.email || "N/A"}</td>
                <td>{reg.college || "N/A"}</td>
                <td>
                  <span className={`status ${reg.status?.toLowerCase() || "pending"}`}>
                    {reg.status || "Pending"}
                  </span>
                </td>
                <td>
                  <button
                    className="action-btn approve"
                    onClick={() => onStatusChange(reg.id, "Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="action-btn reject"
                    onClick={() => onStatusChange(reg.id, "Rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
