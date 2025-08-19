import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import products from "./data.js";
import { analyzeStock, simulateSpike } from "./controllers/storeController.js";
import storeRoute from "./routes.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../frontend')));

app.use("/store", storeRoute);


app.get("/report", (req, res) => {
    res.json(products.map(product => analyzeStock(product)));
});
app.get("/simulate/1", (req, res) => {
    res.json(simulateSpike(products[0]));
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
