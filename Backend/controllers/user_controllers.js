const User = require("../models/user.model");
const BlockedIp = require("../models/blockedIp.model");
const { checkPassword } = require("../bcrypt");
const jwt = require("jsonwebtoken");
const path = require('path');
const fs = require('fs');

function handleLanding(req, res) {
    res.status(200).json({ "data": "king" })
}

async function handlSignUp(req, res) {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400).json({ error: true, message: "Name is required" });
    }
    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({ error: true, message: "User already exists" });
    }

    const user = new User({ fullName, email, password });
    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful",
    });
};

async function handleLogin(req, res) {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    const userEmail = await User.findOne({ email: email });

    if (!userEmail) {
        return res.status(400).json({ error: true, message: "User not found" });
    }

    const encryptedPassword = userEmail.password;
    const isMatch = await checkPassword(password, encryptedPassword);

    if (userEmail.email == email && isMatch) {
        const user = { user: userEmail };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        });

        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        });
    } else {
        return res.status(400).json({ error: true, message: "Invalid credentials" });
    }
};

// Previous file-based implementation - commented out
// async function handleBlockedIps(req, res) {
//     const filePath = path.join("../../logs", 'blocked_ips.json');
// 
//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             return res.status(500).json({ error: 'Failed to read file' });
//         }
// 
//         try {
//             const jsonData = JSON.parse(data);
//             res.json(jsonData);
//         } catch (parseError) {
//             res.status(500).json({ error: 'Failed to parse JSON' });
//         }
//     });
// }

// New database-based implementation
async function handleBlockedIps(req, res) {
    try {
        // Fetch all active blocked IPs from the database
        const blockedIps = await BlockedIp.find({ isActive: true })
            .sort({ createdAt: -1 }) // Sort by most recent first
            .select('ip blockedAt createdAt updatedAt');

        // Format the response to match expected frontend structure
        const formattedData = blockedIps.map(blockedIp => ({
            ip: blockedIp.ip,
            blockedAt: blockedIp.blockedAt,
            timestamp: blockedIp.createdAt
        }));

        res.status(200).json({
            success: true,
            count: formattedData.length,
            data: formattedData
        });

    } catch (error) {
        console.error('Error fetching blocked IPs from database:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch blocked IPs', 
            message: error.message 
        });
    }
}

async function GetUser(req, res) {
    const { user } = req.user;
    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            Name: user.Name,
            email: isUser.email,
            _id: isUser._id,
        },
        message: "User info",
    });
};

// Add new controller functions for managing blocked IPs
async function addBlockedIp(req, res) {
    try {
        const { ip } = req.body;
        
        if (!ip) {
            return res.status(400).json({ 
                success: false, 
                message: "IP address is required" 
            });
        }
        
        const existingBlockedIp = await BlockedIp.findOne({ ip: ip });
        
        if (existingBlockedIp && existingBlockedIp.isActive) {
            return res.status(409).json({ 
                success: false, 
                message: "IP is already blocked" 
            });
        }
        
        if (existingBlockedIp) {
            // Reactivate existing blocked IP
            await BlockedIp.updateOne(
                { ip: ip },
                {
                    $set: { 
                        isActive: true, 
                        blockedAt: new Date(),
                        updatedAt: new Date()
                    }
                }
            );
        } else {
            // Create new blocked IP record
            const newBlockedIp = new BlockedIp({
                ip: ip,
                blockedAt: new Date()
            });
            
            await newBlockedIp.save();
        }
        
        res.status(201).json({ 
            success: true, 
            message: `IP ${ip} has been blocked successfully` 
        });
        
    } catch (error) {
        console.error('Error adding blocked IP:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to block IP', 
            message: error.message 
        });
    }
}

async function removeBlockedIp(req, res) {
    try {
        const { ip } = req.params;
        
        if (!ip) {
            return res.status(400).json({ 
                success: false, 
                message: "IP address is required" 
            });
        }
        
        const result = await BlockedIp.updateOne(
            { ip: ip, isActive: true },
            { $set: { isActive: false, updatedAt: new Date() } }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Blocked IP not found" 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: `IP ${ip} has been unblocked successfully` 
        });
        
    } catch (error) {
        console.error('Error removing blocked IP:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to unblock IP', 
            message: error.message 
        });
    }
}

module.exports = { handlSignUp, handleLogin, GetUser, handleLanding, handleBlockedIps, addBlockedIp, removeBlockedIp };