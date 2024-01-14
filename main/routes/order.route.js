const express = require("express");
const orderController = require("../controllers/order.controller");
const userController = require('../controllers/user.controller');

const router = express.Router();
router.use(userController.checkRole('user'));

router.get("/index", orderController.getOrderHistory);
router.get("/detail", orderController.getOrderDetail);
router.post("/CreatAndSendToken", orderController.CreateOrderForCartAndSendToken);

module.exports = router;
