// Previous file-based implementation - commented out
// const fs = require('fs');
// const path = require('path');
// 
// // const BLOCKED_IPS_FILE = path.join("TOOL/logs/", 'blocked_ips.json');
// 
// function checkBlockedIp(req, res, next) {
//     let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     
//     if (ip.startsWith("::ffff:")) {
//         ip = ip.replace("::ffff:", "");
//       }
//     
//     fs.readFile("D:/Uploaded/Uploaded/TOOL/logs/blocked_ips.json", 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error reading blocked IPs file:', err);
//             return next();
//         }
// 
//         const blockedIPs = JSON.parse(data);
// 
//         const isBlocked = (blockedIPs.some(blocked => blocked.ip === ip)) ;
//         if(isBlocked){
//             res.json({isBlocked : true});
//         }else {
//             res.json({isBlocked : false});
//         }
// 
//     });
// }
// 
// module.exports = { checkBlockedIp };

// New database-based implementation
const BlockedIp = require('../models/blockedIp.model');

async function checkBlockedIp(req, res, next) {
    try {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        
        if (ip.startsWith("::ffff:")) {
            ip = ip.replace("::ffff:", "");
        }
        
        // Check if IP is blocked in the database
        const blockedIp = await BlockedIp.findOne({ ip: ip, isActive: true });
        
        if (blockedIp) {
            return res.status(403).json({ 
                isBlocked: true, 
                message: `IP ${ip} is blocked since ${blockedIp.blockedAt}`,
                blockedAt: blockedIp.blockedAt
            });
        } else {
            res.json({ isBlocked: false });
        }
        
    } catch (error) {
        console.error('Error checking blocked IP:', error);
        // If there's a database error, allow the request to proceed
        res.json({ isBlocked: false });
    }
}

// Helper function to add an IP to the blocked list
async function addBlockedIp(ip) {
    try {
        const existingBlockedIp = await BlockedIp.findOne({ ip: ip });
        
        if (existingBlockedIp) {
            // Update existing record
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
        
        console.log(`IP ${ip} has been blocked`);
        return true;
    } catch (error) {
        console.error('Error adding blocked IP:', error);
        return false;
    }
}

// Helper function to unblock an IP
async function removeBlockedIp(ip) {
    try {
        await BlockedIp.updateOne(
            { ip: ip },
            { $set: { isActive: false, updatedAt: new Date() } }
        );
        console.log(`IP ${ip} has been unblocked`);
        return true;
    } catch (error) {
        console.error('Error removing blocked IP:', error);
        return false;
    }
}

module.exports = { checkBlockedIp, addBlockedIp, removeBlockedIp };
