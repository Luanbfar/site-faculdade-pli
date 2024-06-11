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

const getAllQuery = "SELECT * FROM cars";
const getById = "SELECT * FROM cars WHERE id = ?";
const insertQuery = "INSERT INTO cars SET ?";
const updateQuery = "UPDATE cars SET ? WHERE id = ?";
const deleteQuery = "DELETE FROM cars WHERE id = ?";

app.get("/cars", (req, res) => {
  db.query(getAllQuery, (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      res.status(404).json({ error: "Not found" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/cars/:id", (req, res) => {
  const { id } = req.params;
  db.query(getById, [id], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.status(404).json({ error: "Not found" });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

app.post("/cars", (req, res) => {
  const { name, price, quantity } = req.body;
  const car = { name, price, quantity };
  if (car && name && price && quantity) {
    db.query(insertQuery, car, (err, result) => {
      if (err) throw err;
      if (result && result.insertId) {
        res.status(200).json({ id: result.insertId, ...car });
      } else {
        res.status(500).json({ error: "Error inserting car" });
      }
    });
  } else {
    res.status(400).json({ error: "Missing required fields" });
  }
});

app.put("/cars/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;
  const car = { name, price, quantity };
  if (car) {
    db.query(updateQuery, [car, id], (err, result) => {
      if (err) throw err;
      if (result.affectedRows === 0) {
        res.status(404).json({ error: "Not found" });
      } else {
        res.status(200).json({ id, ...car });
      }
    });
  }
});

app.delete("/cars/:id", (req, res) => {
  const { id } = req.params;
  db.query(deleteQuery, [id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Not found" });
    } else {
      res.status(200).json({ message: "Car deleted" });
    }
  });
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
