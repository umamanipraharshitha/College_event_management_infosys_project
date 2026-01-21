const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: "127.0.0.1",   
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME || "college_event_hub",
  port: 3305,
  socketPath: undefined,    
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    return;
  }
  console.log(" MySQL connected...");
});

module.exports = db;
