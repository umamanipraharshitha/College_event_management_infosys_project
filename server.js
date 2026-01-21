require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const db = require("./db");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: "http://localhost:5173", // React frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/ /g, "-");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + safeName);
  }
});
const upload = multer({ storage });
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// JWT authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: "Token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user; // contains id and role from login
    next();
  });
}
function authorizeCollegeAdmin(req, res, next) {
  if (req.user.role !== "college_admin") {
    return res.status(403).json({ error: "Access denied. College admins only." });
  }
  next();
}


app.post("/signup", (req, res) => {
  const { name, email, password, college, role } = req.body;
  if (!name || !email || !password || !college || !role) {
    return res.status(400).json({ error: "All fields required" });
  }

  db.query("SELECT * FROM Users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.length > 0) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();

    db.query(
      "INSERT INTO Users (id, name, email, password, college, role) VALUES (?, ?, ?, ?, ?, ?)",
      [id, name, email, hashedPassword, college, role],
      (err) => {
        if (err) return res.status(500).json({ error: "Insertion error" });
        res.status(201).json({ message: "User registered successfully" });
      }
    );
  });
});
app.get("/verify-token", authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});


app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  db.query("SELECT * FROM Users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.length === 0) return res.status(400).json({ error: "User not found" });

    const user = result[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
  { id: user.id, role: user.role, college_id: user.college }, // add here
  JWT_SECRET,
  { expiresIn: "2h" }
);


    // Return both token and role explicitly
    res.json({
      message: "Login successful",
      token,
      role: user.role,
      id: user.id
    });
  });
});



app.get("/users", authenticateToken,(req, res) => {
  db.query("SELECT id, name, email, college, role FROM Users", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

app.post("/create-admin", authenticateToken, async (req, res) => {
  // ✅ Only superadmin can create another admin
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ error: "Access denied: Only superadmin can create admins" });
  }

  const { name, email, password, college } = req.body;
  const role = "college_admin";

  if (!name || !email || !password || !college)
    return res.status(400).json({ error: "All fields required" });

  try {
    // Check if admin already exists
    const existing = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM Users WHERE email = ?", [email], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (existing.length > 0) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    const id = uuidv4();
    const hashed = await bcrypt.hash(password, 12); // stronger hash

    await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO Users (id, name, email, password, college, role) VALUES (?, ?, ?, ?, ?, ?)",
        [id, name, email, hashed, college, role],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.status(201).json({ message: "College admin created successfully" });
  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).json({ error: "Database or hashing error" });
  }
});

// DELETE a college admin by id
app.delete("/delete-admin/:id", authenticateToken, (req, res) => {
  // ✅ Only superadmin can delete college admins
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ error: "Access denied: Only superadmin can delete admins" });
  }

  const { id } = req.params;

  db.query("DELETE FROM Users WHERE id = ? AND role = 'college_admin'", [id], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.json({ message: "College admin deleted successfully" });
  });
});

// GET all college admins
app.get("/admins", authenticateToken, (req, res) => {
  // ✅ Only superadmin can view all college admins
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ error: "Access denied: Only superadmin can view admins" });
  }

  db.query("SELECT id, name, email, college FROM Users WHERE role = 'college_admin'", (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "No admins found" });
    }
    res.status(200).json(results);
  });
});


app.get("/dashboard",authenticateToken, (req, res) => {
  const { role, id, college_id } = req.query;

  if (role === "college_admin") {
    const collegeId = college_id;

    db.query(
      "SELECT COUNT(*) AS totalEvents FROM Events WHERE college_id = ?",
      [collegeId],
      (err, eventResult) => {
        if (err) return res.status(500).json({ error: "Database error" });

        db.query(
          "SELECT COUNT(*) AS totalRegistrations FROM Registrations r JOIN Events e ON r.event_id = e.id WHERE e.college_id = ?",
          [collegeId],
          (err, regResult) => {
            if (err) return res.status(500).json({ error: "Database error" });

            db.query(
              "SELECT COUNT(*) AS upcomingEvents FROM Events WHERE college_id = ? AND start_date >= NOW()",
              [collegeId],
              (err, upcomingResult) => {
                if (err) return res.status(500).json({ error: "Database error" });

                db.query(
                  "SELECT category, COUNT(*) AS count FROM Events WHERE college_id = ? GROUP BY category",
                  [collegeId],
                  (err, categoryStats) => {
                    if (err) return res.status(500).json({ error: "Database error" });

                    db.query(
                      "SELECT e.title, COUNT(r.id) AS registrations FROM Events e LEFT JOIN Registrations r ON e.id = r.event_id WHERE e.college_id = ? GROUP BY e.id ORDER BY registrations DESC LIMIT 5",
                      [collegeId],
                      (err, topEvents) => {
                        if (err) return res.status(500).json({ error: "Database error" });

                        res.json({
                          role: "college_admin",
                          totalEvents: eventResult[0].totalEvents,
                          totalRegistrations: regResult[0].totalRegistrations,
                          upcomingEvents: upcomingResult[0].upcomingEvents,
                          eventsByCategory: categoryStats,
                          topEventsByRegistration: topEvents,
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );

  } else if (role === "student") {
    db.query(
      "SELECT COUNT(*) AS registeredEvents FROM Registrations WHERE user_id = ?",
      [id],
      (err, regResult) => {
        if (err) return res.status(500).json({ error: "Database error" });

        db.query(
          "SELECT e.id, e.title, e.start_date, e.end_date FROM Events e JOIN Registrations r ON e.id = r.event_id WHERE r.user_id = ?",
          [id],
          (err, events) => {
            if (err) return res.status(500).json({ error: "Database error" });

            res.json({
              role: "student",
              registeredEvents: regResult[0].registeredEvents,
              upcomingEvents: events,
            });
          }
        );
      }
    );

  }  else if (role === "superadmin") {
  // ✅ Superadmin dashboard
  db.query(
    "SELECT COUNT(*) AS totalColleges FROM Users WHERE role = 'college_admin'",
    (err, collegeAdmins) => {
      if (err) return res.status(500).json({ error: "Database error" });

      db.query(
        "SELECT COUNT(*) AS totalStudents FROM Users WHERE role = 'student'",
        (err, students) => {
          if (err) return res.status(500).json({ error: "Database error" });

          db.query("SELECT COUNT(*) AS totalEvents FROM Events", (err, events) => {
            if (err) return res.status(500).json({ error: "Database error" });

            // ✅ Get top 5 colleges by number of events
            const topCollegesQuery = `
              SELECT u.college, COUNT(e.id) AS events
              FROM Events e
              JOIN Users u ON e.college_id = u.id
              WHERE u.role = 'college_admin'
              GROUP BY u.college
              ORDER BY events DESC
              LIMIT 5
            `;

            db.query(topCollegesQuery, (err, topColleges) => {
              if (err) return res.status(500).json({ error: "Database error" });

              res.json({
                role: "superadmin",
                totalColleges: collegeAdmins[0].totalColleges,
                totalStudents: students[0].totalStudents,
                totalEvents: events[0].totalEvents,
                topCollegesByEvents: topColleges,
              });
            });
          });
        }
      );
    }
  );
}
else {
    res.status(400).json({ error: "Invalid role" });
  }
});

app.post("/events", authenticateToken, upload.single("image"), (req, res) => {
  if (req.user.role !== "college_admin")
    return res.status(403).json({ error: "Unauthorized" });

  const { title, description, category, location, start_date, end_date } = req.body;
  const id = uuidv4();
  const college_id = req.user.college_id;

  // Since column name is image_url, match it here
  const image_url = req.file ? "/uploads/" + req.file.filename : "";

  db.query(
    "INSERT INTO Events (id, college_id, title, description, category, location, start_date, end_date, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, college_id, title, description, category, location, start_date, end_date, image_url],
    (err) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({
        message: "Event created successfully",
        eventId: id,
        image_url,
      });
    }
  );
});


app.post("/register",authenticateToken, (req, res) => {
  const { event_id, user_id, status } = req.body;
  if (!event_id || !user_id) return res.status(400).json({ error: "Event ID and User ID required" });

  const id = uuidv4();

  db.query(
    "INSERT INTO Registrations (id, event_id, user_id, status) VALUES (?, ?, ?, ?)",
    [id, event_id, user_id, status || "pending"],
    (err) => {
      if (err) {
        console.log(err);  // <-- Log the exact DB error
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ message: "User registered for event successfully", registrationId: id });
    }
  );
});
// UPDATE an Event
// Example for updating event
app.put("/events/:id", authenticateToken, upload.single("image"), (req, res) => {
  if (req.user.role !== "college_admin") return res.status(403).json({ error: "Access denied: Only college admins can update events" });
  const { id } = req.params;
  const { title, description, category, location, start_date, end_date } = req.body;
  const college_id = req.user.college_id;
  let query = "UPDATE Events SET title = ?, description = ?, category = ?, location = ?, start_date = ?, end_date = ?";
  const params = [title, description, category, location, start_date, end_date];
  if (req.file) {
    query += ", image_url = ?";
    params.push("/uploads/" + req.file.filename);
  }
  query += " WHERE id = ? AND college_id = ?";
  params.push(id, college_id);
  db.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Event not found or unauthorized" });
    res.json({ message: "Event updated successfully" });
  });
});

// GET all registrations for a student with event details
app.get("/registrations/student/:user_id", authenticateToken, (req, res) => {
  const { user_id } = req.params;

  // Ensure user can only access their own registrations unless admin
  if (req.user.role === "student" && req.user.id !== user_id) {
    return res.status(403).json({ error: "Access denied" });
  }

  const query = `
    SELECT 
      r.id AS registration_id,
      r.status,
      r.timestamp,
      e.id AS event_id,
      e.title AS event_title,
      e.description,
      e.category AS event_category,
      e.location,
      e.start_date,
      e.end_date,
      e.college_id
    FROM Registrations r
    JOIN Events e ON r.event_id = e.id
    WHERE r.user_id = ?
    ORDER BY r.timestamp ASC
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) return res.status(404).json({ message: "No registrations found for this student" });

    res.status(200).json(results);
  });
});

// DELETE an Event
app.delete("/events/:id", authenticateToken, (req, res) => {
  if (req.user.role !== "college_admin") return res.status(403).json({ error: "Unauthorized" });

  const { id } = req.params;
  const college_id = req.user.college_id;

  db.query(
    "DELETE FROM Events WHERE id=? AND college_id=?",
    [id, college_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Event not found or unauthorized" });
      res.json({ message: "Event deleted successfully" });
    }
  );
});
app.get("/events/my-college", authenticateToken, (req, res) => {
  if (req.user.role !== "college_admin") return res.status(403).json({ error: "Unauthorized" });

  const college_id = req.user.college_id;

  db.query("SELECT * FROM Events WHERE college_id=? ORDER BY start_date ASC", [college_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

app.get("/events", authenticateToken, (req, res) => {
  db.query("SELECT * FROM Events ORDER BY start_date ASC", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// GET /events/category/:category
app.get("/events/category/:category",authenticateToken, (req, res) => {
  const { category } = req.params;

  db.query(
    "SELECT * FROM Events WHERE category = ? ORDER BY start_date ASC",
    [category],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0)
        return res.status(404).json({ message: "No events found in this category" });

      res.json(results);
    }
  );
});
// GET /events/date/:date
app.get("/events/date/:date", authenticateToken,(req, res) => {
  const { date } = req.params; // format: YYYY-MM-DD

  db.query(
    "SELECT * FROM Events WHERE DATE(start_date) = ? ORDER BY start_date ASC",
    [date],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0)
        return res.status(404).json({ message: "No events found on this date" });

      res.json(results);
    }
  );
});
// GET /events/college/:college_id
app.get("/events/college/:college_id",authenticateToken, (req, res) => {
  const { college_id } = req.params;

  db.query(
    "SELECT * FROM Events WHERE college_id = ? ORDER BY start_date ASC",
    [college_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length === 0)
        return res.status(404).json({ message: "No events found for this college" });

      res.json(results);
    }
  );
});
app.post("/feedback", (req, res) => {
  const { event_id, user_id, rating, comment } = req.body;

  if (!event_id || !user_id || !rating)
    return res.status(400).json({ error: "Event ID, User ID, and Rating are required" });

  const id = uuidv4();

  db.query(
    "INSERT INTO Feedback (id, event_id, user_id, rating, comment) VALUES (?, ?, ?, ?, ?)",
    [id, event_id, user_id, rating, comment || ""],
    (err) => {
      if (err) {
        console.error("DB Error:", err);  // <-- Added
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ message: "Feedback submitted successfully", feedbackId: id });
    }
  );
});

// GET all feedback with student name and event name
app.get("/feedback", (req, res) => {
  const query = `
    SELECT 
      f.id AS feedback_id,
      f.comment AS feedback_text,
      f.rating,
      u.name AS student_name,
      e.title AS event_title
    FROM Feedback f
    JOIN Users u ON f.user_id = u.id
    JOIN Events e ON f.event_id = e.id
    ORDER BY f.created_at DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
});


// GET feedback for a specific event with student name
app.get("/feedback/event/:event_id", (req, res) => {
  const { event_id } = req.params;
  const query = `
    SELECT 
      f.id AS feedback_id,
      f.comment AS feedback_text,
      f.rating,
      u.name AS student_name,
      e.title AS event_title
    FROM Feedback f
    JOIN Users u ON f.user_id = u.id
    JOIN Events e ON f.event_id = e.id
    WHERE f.event_id = ?
    ORDER BY f.created_at DESC;
  `;

  db.query(query, [event_id], (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
});



app.post("/logout", (req, res) => {
  res.json({ message: "Logout successful. Please remove token on client side." });
});


app.get("/registrations/all",authenticateToken, authorizeCollegeAdmin,(req, res) => {
  const query = `
    SELECT 
      r.id AS registration_id,
      u.name AS student_name,
      u.email AS student_email,
      e.title AS event_title,
      e.category AS event_category,
      r.status,
      r.timestamp
    FROM Registrations r
    JOIN Users u ON r.user_id = u.id
    JOIN Events e ON r.event_id = e.id
    WHERE r.user_id IS NOT NULL AND r.event_id IS NOT NULL
    ORDER BY r.timestamp DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) return res.status(404).json({ message: "No registrations found" });
    res.status(200).json(results);
  });
});


app.put("/registrations/:id/status",authenticateToken,authorizeCollegeAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log("Updating registration:", id, "with status:", status);

  const validStatuses = ["pending", "approved", "rejected", "completed"];
  if (!validStatuses.includes(status)) {
    console.log("Invalid status:", status);
    return res.status(400).json({ error: "Invalid status value" });
  }

  db.query(
    "UPDATE Registrations SET status = ? WHERE id = ?",
    [status, id],
    (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.affectedRows === 0) {
        console.log("No rows affected for ID:", id);
        return res.status(404).json({ error: "Registration not found" });
      }

      res.json({ message: `Registration status updated to '${status}' successfully` });
    }
  );
});


app.get("/registrations/event/:event_id",authenticateToken,authorizeCollegeAdmin, (req, res) => {
  const { event_id } = req.params;
  const query = `
    SELECT 
      r.id AS registration_id,
      u.name AS student_name,
      u.email AS student_email,
      r.status,
      r.timestamp
    FROM Registrations r
    JOIN Users u ON r.user_id = u.id
    WHERE r.event_id = ?
    ORDER BY r.timestamp DESC;
  `;
  db.query(query, [event_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "No registrations found for this event" });
    res.status(200).json(results);
  });
});


app.get("/registrations/:id",authenticateToken,authorizeCollegeAdmin, (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM Registrations WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.length === 0) return res.status(404).json({ message: "Not found" });
    res.json(result[0]);
  });
});



app.get("/registrations/college/:college_id",authenticateToken,authorizeCollegeAdmin, (req, res) => {
  const { college_id } = req.params;
  const query = `
    SELECT 
      r.id AS registration_id,
      u.name AS student_name,
      u.email AS student_email,
      e.title AS event_title,
      e.category AS event_category,
      r.status,
      r.timestamp
    FROM Registrations r
    JOIN Users u ON r.user_id = u.id
    JOIN Events e ON r.event_id = e.id
    WHERE e.college_id = ?
    ORDER BY r.timestamp DESC;
  `;

  db.query(query, [college_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
