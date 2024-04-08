const express = require("express");
const accController = require("../controllers/acc.controller");

const router = express.Router();
router.get("/signin", accController.displaySignInP);
router.get("/signup", accController.displaySignUpP);
router.get("/profile", accController.getProfile);
router.get("/orderHistory", accController.getOrderHistory);

module.exports = router;
