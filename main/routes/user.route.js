const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();
router.get("/signin", userController.getSignInP);
router.get("/signup", userController.getSignUpP);

router.post("/signup", userController.SignUp);
router.post("/signin", userController.SignIn);
router.post('/sendtoken', userController.sendToken);

router.get("/logout", userController.Logout);

router.get("/handle", userController.getHandle);

module.exports = router;
