require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const handleLog = require("./middleware/log");
const userRoutes = require('./routes/user_routes');
const { checkBlockedIp } = require("./middleware/blockIps");
const port = process.env.PORT || process.env.port || 8000;
const path = require("path");
const fs = require("fs");

app.set('trust proxy', true);

// middlewares
app.use(express.json());

// CORS configuration without credentials
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization', 
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    credentials: false, // Explicitly disable credentials
    optionsSuccessStatus: 200
}));

app.use(express.urlencoded({ extended: true }));

// Add a health check route before other routes
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString()
    });
});

// Add root route BEFORE the general middleware
app.get('/', (req, res) => {
    console.log('Root route accessed');
    res.status(200).json({
        success: true,
        message: "CloudBouncer Backend API is running successfully",
        version: "1.0.0",
        timestamp: new Date().toISOString()
    });
});

// Add a simple test route
app.get('/test', (req, res) => {
    console.log('Test route accessed');
    res.status(200).json({
        success: true,
        message: "Test endpoint working",
        timestamp: new Date().toISOString()
    });
});

// Apply routes middleware after specific routes
app.use("/", handleLog, userRoutes);

// Catch-all route for debugging
app.use('*', (req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
