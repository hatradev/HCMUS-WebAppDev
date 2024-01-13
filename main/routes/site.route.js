const express = require("express");
const siteController = require("../controllers/site.controller");

const router = express.Router();

// router.use((req, res, next) => {
//     if (req.cookies && req.cookies.obj){
//      return next();
//     }
//      res.redirect('/user/signin');
//  })

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
router.get(
  "/my-cart",
  (req, res, next) => {
    if (req.cookies && req.cookies.obj) {
      return next();
    }
    res.redirect("/user/signin");
  },
  siteController.getPayForCart
);
router.get(
  "/payment",
  (req, res, next) => {
    if (req.cookies && req.cookies.obj) {
      return next();
    }
    res.redirect("/user/signin");
  },
  siteController.getPayment
);

router.get("/dashboard", siteController.getDashboard);

module.exports = router;
