require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const handleLog = require("./middleware/log");
const userRoutes = require('./routes/user_routes');
const { checkBlockedIp } = require("./middleware/blockIps");
const port = process.env.port || 8000;
const path = require("path");
const fs = require("fs");

app.set('trust proxy', true);

// middlewares
app.use(express.json());

// Enhanced CORS configuration for production
app.use(
    cors({
        origin: [
            "https://cloud-bouncer.vercel.app",
            "http://localhost:5173",
            "http://localhost:8000",
            "https://cloudbouncer.vercel.app"
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type", 
            "Authorization", 
            "X-Requested-With",
            "Accept",
            "Origin"
        ],
        credentials: true,
        optionsSuccessStatus: 200
    })
);

// Handle preflight requests
app.options('*', cors());

app.use(express.urlencoded({ extended: true }));

// Add a health check route before other routes
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString()
    });
});

app.use("/", handleLog, userRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "CloudBouncer Backend API is running successfully",
        version: "1.0.0",
        endpoints: {
            login: "/login",
            signup: "/signup", 
            blockedIps: "/blockedIps",
            health: "/"
        },
        timestamp: new Date().toISOString()
    })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
