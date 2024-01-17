const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();
router.get("/signin", userController.getSignInP);
router.get("/signup", userController.getSignUpP);
router.get("/forgotPw", userController.forgotPw);

router.post("/update", userController.updateUser);
router.post("/delete", userController.deleteUser);

router.post("/signup", userController.SignUp);
router.post("/signin", userController.SignIn);
router.post("/sendtoken", userController.sendTokenAndSaveUser);
router.post("/authenticate", userController.authenticatePassword);
router.post("/paymentSuccess", userController.paymentSuccess);
router.post("/resetPw", userController.isLogin, userController.resetPw);

router.get("/logout", userController.isLogin, userController.Logout);
router.get("/handle", userController.getHandle);
module.exports = router;
