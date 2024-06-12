const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const bodyParser = require("body-parser");

router.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "apex_db",
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
const decrementQuery =
  "UPDATE cars SET quantity = quantity - 1 WHERE id = ? AND quantity > 0";

router.get("/cars", (req, res) => {
  db.query(getAllQuery, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      res.status(404).json({ error: "Not found" });
    } else {
      res.status(200).json(results);
    }
  });
});

router.get("/cars/:id", (req, res) => {
  const { id } = req.params;
  db.query(getById, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      res.status(404).json({ error: "Not found" });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

router.post("/cars", (req, res) => {
  const { name, price, quantity } = req.body;
  const car = { name, price, quantity };
  if (car && name && price && quantity) {
    db.query(insertQuery, car, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
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

router.put("/cars/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;
  const car = { name, price, quantity };
  if (car) {
    db.query(updateQuery, [car, id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: "Not found" });
      } else {
        res.status(200).json({ id, ...car });
      }
    });
  }
});

router.put("/cars/buy/:id", (req, res) => {
  const { id } = req.params;
  db.query(decrementQuery, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Car not found or out of stock" });
    } else {
      res.status(200).json({ result });
    }
  });
});

router.delete("/cars/:id", (req, res) => {
  const { id } = req.params;
  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Not found" });
    } else {
      res.status(200).json({ message: "Car deleted" });
    }
  });
});

module.exports = router;
