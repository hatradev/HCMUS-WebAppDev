const express = require("express");
const orderController = require("../controllers/order.controller");
const userController = require('../controllers/user.controller');

const router = express.Router();
router.use(userController.checkRole('user'));

router.get("/index", orderController.getOrderHistory);
router.get("/detail", orderController.getOrderDetail);
router.post("/CreatAndSendToken", orderController.CreateOrderForCartAndSendToken);
router.post("/continuePayment", orderController.ContinueToPay);
router.post("/cancelOrder", orderController.cancelOrder);
router.post("/CreatAndSendTokenForBuyNow", orderController.CreateOrderForBuyNowAndSendToken);
// router.post("/authenticate", orderController.authenticatePassword);

module.exports = router;
