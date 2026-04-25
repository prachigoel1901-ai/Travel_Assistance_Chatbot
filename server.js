const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// ---- Health check (VERY IMPORTANT for Railway) ----
app.get('/health', (req, res) => {
  res.status(200).send("OK");
});

// ---- Root route (must respond fast) ----
app.get('/', (req, res) => {
  res.status(200).send("OK");
});

// ---- Database connection ----
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE, // ✅ correct name
  port: process.env.MYSQLPORT,
  ssl: {
    rejectUnauthorized: false
  }
});

// Connect DB (non-blocking)
db.connect((err) => {
  if (err) {
    console.error("❌ DB connection failed:", err);
  } else {
    console.log("✅ DB connected");
  }
});

// ---- API route ----
app.get('/place', (req, res) => {
  const city = req.query.city;
  const interest = req.query.interest;

  if (!city || !interest) {
    return res.status(400).send("Missing parameters");
  }

  const query = "SELECT * FROM place WHERE city = ? AND category = ?";

  db.query(query, [city, interest], (err, results) => {
    if (err) {
      console.error("❌ Query error:", err);
      return res.status(500).send("Server error");
    }
    res.json(results);
  });
});

// ---- Server ----
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ---- Crash protection ----
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});