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
  console.log("purchase-routes.js connected to database.");
});

const addPurchaseQuery = "INSERT INTO purchases SET ?";
const decrementQuery =
  "UPDATE cars SET quantity = quantity - 1 WHERE id = ? AND quantity > 0";

router.post("/cars/buy/:id", (req, res) => {
  let returnResult;
  const { id } = req.params;
  const { car_name, price } = req.body;
  const car = { id_car: id, car_name, price };
  if (id && car_name && price) {
    db.query(addPurchaseQuery, car, (error, result) => {
      try {
        if (error) {
          throw error;
        }
        if (result && result.insertId) {
          returnResult = res.status(200).json({ id: result.insertId, ...car });
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

router.put("/cars/buy/:id", (req, res) => {
  let returnResult;
  const { id } = req.params;
  db.query(decrementQuery, [id], (error, result) => {
    try {
      if (error) {
        throw error;
      }
      if (result.affectedRows === 0) {
        returnResult = res.status(404).json({ error: "Car not found or out of stock" });
      } else {
        returnResult = res.status(200).json({ result });
      }
    } catch (error) {
      returnResult = res.status(500).json({ error: error.message });
    }
  });
  return returnResult;
});

module.exports = router;
