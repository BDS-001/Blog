// --- Imports and Configuration ---
require("dotenv").config();
const express = require("express");
const app = express();


// --- Route Imports ---
const apiRouter = require('./routes/apiRouterV1')

// --- Middleware Setup ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.use('/api/v1', apiRouter);

// --- Server Configuration and Startup ---
const PORT = parseInt(process.env.USE_PORT, 10) || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}/`);
});