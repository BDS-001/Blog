// --- Imports and Configuration ---
require("dotenv").config();
const express = require("express");
const app = express();


// --- Route Imports ---


// --- Middleware Setup ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---


// --- Server Configuration and Startup ---
const PORT = parseInt(process.env.USE_PORT, 10) || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}/`);
});