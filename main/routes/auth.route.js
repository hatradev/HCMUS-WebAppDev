const express = require("express");
const orderController = require("../controllers/order.controller");
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get("/google/callback", authController.ggCallback);
router.get("/google", authController.ggAuth);

// router.get("/facebook/callback", authController.fbCallback);
// router.get("/facebook", authController.fbAuth);

module.exports = router;