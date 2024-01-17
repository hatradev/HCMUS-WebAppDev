const express = require("express");
const siteController = require("../controllers/site.controller");
const userController = require("../controllers/user.controller");
const productController = require("../controllers/product.controller");
const router = express.Router();

router.get("/", siteController.getHome);
router.get(
  "/my-cart",
  userController.checkRole("user"),
  siteController.getPayForCart
);
router.get(
  "/payment",
  userController.checkRole("user"),
  siteController.getPayment
);
router.get(
  "/paymentBuyNow",
  userController.checkRole("user"),
  siteController.getPaymentBuyNow
);

router.get(
  "/auth-system",
  userController.checkRole("user"),
  siteController.getAuthSystem
);

router.get("/dashboard", siteController.getDashboard);
router.get("/dashboard/api/chart", siteController.getDailyRevenue);

module.exports = router;
