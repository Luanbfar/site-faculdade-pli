const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "cars_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to database.");
});

app.get("/api/cars", (req, res) => {
  db.query("SELECT * FROM cars", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get("/api/cars/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM cars WHERE id = ?", [id], (err, result) => {
    if (err) throw err;
    res.json(result[0]);
  });
});

app.post("/api/cars", (req, res) => {
  const { name, price, quantity } = req.body;
  const car = { name, price, quantity };
  db.query("INSERT INTO cars SET ?", car, (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, ...car });
  });
});

app.put("/api/cars/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;
  const car = { name, price, quantity };
  db.query("UPDATE cars SET ? WHERE id = ?", [car, id], (err, result) => {
    if (err) throw err;
    res.json({ id, ...car });
  });
});

app.delete("/api/cars/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM cars WHERE id = ?", [id], (err, result) => {
    if (err) throw err;
    res.json({ message: "Car deleted" });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
