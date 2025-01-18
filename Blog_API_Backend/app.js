// --- Imports and Configuration ---
require("dotenv").config();
const express = require("express");
const app = express();
require('./config/passport');
const cors = require('cors');
const initRoles = require('./prisma/setup/initRoles')


// --- Route Imports ---
const apiRouter = require('./routes/apiRouterV1')

// --- Middleware Setup ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Routes ---
app.use('/api/v1', apiRouter);

// --- Server Configuration and Startup ---
if (require.main === module) {
    const PORT = parseInt(process.env.USE_PORT, 10) || 3000;
    initRoles().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Visit: http://localhost:${PORT}/`);
        });
    })
    .catch(error => {
        console.error('Failed to initialize roles:', error);
        process.exit(1);
    });
}

module.exports = app