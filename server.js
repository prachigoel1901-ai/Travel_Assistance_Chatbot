const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  ssl: {
    rejectUnauthorized: false
  }
});

// Connect to DB
db.connect((err) => {
  if (err) {
    console.error("❌ DB connection failed:", err);
  } else {
    console.log("✅ DB connected");
  }
});

// Home route
app.get('/', (req, res) => {
  res.send("API is running 🚀");
});

// Health check route (for testing)
app.get('/health', (req, res) => {
  res.send("Server is healthy ✅");
});

// API route
app.get('/place', (req, res) => {
  const city = req.query.city;
  const interest = req.query.interest;

  const query = "SELECT * FROM place WHERE city = ? AND category = ?";
  
  db.query(query, [city, interest], (err, results) => {
    if (err) {
      console.error("❌ Query error:", err);
      res.status(500).send("Server error");
    } else {
      res.json(results);
    }
  });
});

// PORT (IMPORTANT FIX)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Crash protection (IMPORTANT)
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});