const express = require("express");
const orderController = require("../controllers/order.controller");

const router = express.Router();
router.get("/index", orderController.getOrderHistory);
router.get("/detail", orderController.getOrderDetail);

module.exports = router;
