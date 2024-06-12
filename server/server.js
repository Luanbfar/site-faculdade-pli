const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const carsRoutes = require("./routes/cars-routes");
const path = require("path");

const clientPath = path.join(__dirname, "../client");
const frontendPath = path.join(__dirname, "../client/src");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api", carsRoutes);
app.use(express.static(clientPath));
app.use(express.static(frontendPath));

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
