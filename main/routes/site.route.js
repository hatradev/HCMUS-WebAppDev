const express = require("express");
const siteController = require("../controllers/site.controller");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.get(
  "/",
  // (req, res, next) => {
  //   if (req.cookies && req.cookies.obj) {
  //     return next();
  //   }
  //   res.redirect("/user/signin");
  // },
  siteController.getHome
);
router.get("/my-cart", userController.checkRole("user"), siteController.getPayForCart);
router.get("/payment", userController.checkRole("user"), siteController.getPayment);

module.exports = router;
