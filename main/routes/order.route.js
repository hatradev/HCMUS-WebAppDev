const express = require("express");
const orderController = require("../controllers/order.controller");

const router = express.Router();

router.use((req, res, next) => {
    if (req.cookies && req.cookies.obj){
     return next();
    }
     res.redirect('/user/signin');
 })

router.get("/index", orderController.getOrderHistory);
router.get("/detail", orderController.getOrderDetail);

module.exports = router;
