
import express from "express";
import { addProducts, analyzeStock, fetchProducts, simulateSpike } from "./controllers/storeController.js";

const storeRoute = express.Router();

// Get Products Report Route
storeRoute.get("/report", analyzeStock);
// Simulate spike route
storeRoute.post("/simulate", simulateSpike);

// Get Products List
storeRoute.get("/products", fetchProducts);
// Add New Product Route
storeRoute.post("/addProducts", addProducts);

export default storeRoute;
