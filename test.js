const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Harshi@123",
  database: "college_event_hub",
  port: 3305,
  socketPath: undefined
});

db.connect(err => {
  if (err) console.error("❌ Connection failed:", err);
  else console.log("✅ Connected!");
});
