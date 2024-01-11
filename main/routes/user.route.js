const express = require("express");
const userController = require("../controllers/user.controller");
const passport = require("passport");

const router = express.Router();
router.get("/signin", userController.getSignInP);
router.get("/signup", userController.getSignUpP);

router.post("/signup", userController.SignUp);
router.post("/signin",
  passport.authenticate("myStrategy", {
    failureRedirect: "/user/signin",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

router.get("/logout", userController.Logout);

module.exports = router;
