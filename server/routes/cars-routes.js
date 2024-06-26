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

db.connect((error) => {
  if (error) {
    console.error("Database connection failed:", error.stack);
    return;
  }
  console.log("cars-routes.js connected to database.");
});

const getAllQuery = "SELECT * FROM cars";
const getById = "SELECT * FROM cars WHERE id = ?";
const insertQuery = "INSERT INTO cars SET ?";
const updateQuery = "UPDATE cars SET ? WHERE id = ?";
const deleteQuery = "DELETE FROM cars WHERE id = ?";

router.get("/cars", (req, res) => {
  let returnResult;
  db.query(getAllQuery, (error, results) => {
    try {
      if (error) {
        throw error;
      }
      if (results.length === 0) {
        returnResult = res.status(404).json({ error: "Not found" });
      } else {
        returnResult = res.status(200).json(results);
      }
    } catch (error) {
      returnResult = res.status(500).json({ error: error.message });
    }
    return returnResult;
  });
});

router.get("/cars/:id", (req, res) => {
  let returnResult;
  const { id } = req.params;
  db.query(getById, [id], (error, result) => {
    try {
      if (error) {
        throw error;
      }
      if (result.length === 0) {
        returnResult = res.status(404).json({ error: "Not found" });
      } else {
        returnResult = res.status(200).json(result[0]);
      }
    } catch (error) {
      returnResult = res.status(500).json({ error: error.message });
    }
    return returnResult;
  });
});

router.post("/cars", (req, res) => {
  let returnResult;
  const { name, price, quantity } = req.body;
  const car = { name, price, quantity };
  if (car && name && price && quantity) {
    db.query(insertQuery, car, (error, result) => {
      try {
        if (error) {
          throw error;
        }
        if (result && result.insertId) {
          returnResult = res.status(200).json({ id: result.insertId, ...car });
        } else {
          returnResult = res.status(500).json({ error: "Error inserting car" });
        }
      } catch (error) {
        returnResult = res.status(500).json({ error: error.message });
      }
    });
  } else {
    returnResult = res.status(400).json({ error: "Missing required fields" });
  }
  return returnResult;
});

router.put("/cars/:id", (req, res) => {
  let returnResult;
  const { id } = req.params;
  const { name, price, quantity } = req.body;
  const car = { name, price, quantity };
  if (car && name && price && quantity) {
    db.query(updateQuery, [car, id], (error, result) => {
      try {
        if (error) {
          throw error;
        }
        if (result.affectedRows === 0) {
          returnResult = res.status(404).json({ error: "Not found" });
        } else {
          returnResult = res.status(200).json({ id, ...car });
        }
      } catch (error) {
        returnResult = res.status(500).json({ error: error.message });
      }
    });
  } else {
    returnResult = res.status(400).json({ error: "Missing required fields" });
  }
  return returnResult;
});

router.delete("/cars/:id", (req, res) => {
  let returnResult;
  const { id } = req.params;
  db.query(deleteQuery, [id], (error, result) => {
    try {
      if (error) {
        throw error;
      }
      if (result.affectedRows === 0) {
        returnResult = res.status(404).json({ error: "Not found" });
      } else {
        returnResult = res.status(200).json({ message: "Car deleted" });
      }
    } catch (error) {
      returnResult = res.status(500).json({ error: error.message });
    }
  });
  return returnResult;
});

module.exports = router;
