const router = require("express").Router();
const { authenticate } = require("../utilities");
const userControllers = require("../controllers/user_controllers");
const {checkBlockedIp} = require("../middleware/blockIps")

// Previous routes (file-based blocked IPs) - commented out
// router.get("/", checkBlockedIp, userControllers.handleLanding);
// router.get("/blockedIps", userControllers.handleBlockedIps);
// router.post("/login", userControllers.handleLogin);
// router.post("/signup", userControllers.handlSignUp);
// router.get("/get-user", authenticate, userControllers.GetUser);

// New routes (database-based blocked IPs)
router.get("/", checkBlockedIp, userControllers.handleLanding);
router.get("/blockedIps", userControllers.handleBlockedIps);
router.post("/blockedIps", authenticate, userControllers.addBlockedIp);
router.delete("/blockedIps/:ip", authenticate, userControllers.removeBlockedIp);
router.post("/login", userControllers.handleLogin);
router.post("/signup", userControllers.handlSignUp);
router.get("/get-user", authenticate, userControllers.GetUser);

module.exports = router;