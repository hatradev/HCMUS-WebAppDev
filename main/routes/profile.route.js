const express = require("express");
const profileController = require("../controllers/profile.controller");
const userController = require('../controllers/user.controller');
const multer = require("multer");
const upload = multer({ dest: 'main/source/public/img/avatar' });

const router = express.Router();

router.use(userController.checkRole('user'));

router.get("/", profileController.getProfile);
router.get("/changepassword", profileController.getChangePasswordP);

router.post("/update", upload.single('img'), profileController.updateProfile);
router.post("/changepassword", profileController.changePassword);


module.exports = router;
