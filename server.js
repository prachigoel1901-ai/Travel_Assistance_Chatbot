const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'metro.proxy.rlwy.net',
  user: 'root',
  password: 'eFxdogvOhjkuqqSuGgzjHzQcVPLjKOmH',
  database: 'railway',
  port: 47432,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect((err) => {
  if (err) {
    console.log("DB connection failed", err);
  } else {
    console.log("DB connected");
  }
});

app.get('/', (req, res) => {
  res.send("API is running");
});

app.get('/place', (req, res) => {
  const city = req.query.city;
  const interest = req.query.interest;

  const query = "SELECT * FROM place WHERE city = ? AND category = ?";
  
  db.query(query, [city, interest], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("error");
    } else {
      res.json(results);
    }
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});