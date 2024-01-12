const express = require("express");
const profileController = require("../controllers/profile.controller");
const userController = require('../controllers/user.controller');

const router = express.Router();

router.use(userController.checkRole('user'));

router.get("/", profileController.getProfile);
router.get("/changepassword", profileController.getChangePasswordP);

router.post("/update", profileController.updateProfile);


module.exports = router;
