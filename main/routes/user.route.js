const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();
router.get("/signin", userController.getSignInP);
router.get("/signup", userController.getSignUpP);

router.post("/signup", userController.SignUp);
router.post("/signin", userController.SignIn);
router.post("/sendtoken", userController.sendTokenAndSaveUser);
router.post("/authenticate", userController.authenticatePassword);
router.post("/paymentSuccess", userController.paymentSuccess);

router.get("/logout", userController.isLogin, userController.Logout);

module.exports = router;
