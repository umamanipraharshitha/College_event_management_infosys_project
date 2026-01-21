require("dotenv").config();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const db = require("./db");

(async () => {
  const id = uuidv4();
  const name = "s";
  const email = "s@gmail.com";
  const password = "s";
  const hashedPassword = await bcrypt.hash(password, 10);
  const college = ""; // use empty string instead of null
  const role = "superadmin";

  db.query(
    "INSERT INTO Users (id, name, email, password, college, role) VALUES (?, ?, ?, ?, ?, ?)",
    [id, name, email, hashedPassword, college, role],
    (err) => {
      if (err) {
        console.error("❌ Error creating superadmin:", err);
      } else {
        console.log("✅ Superadmin created successfully!");
      }
      db.end();
    }
  );
})();
