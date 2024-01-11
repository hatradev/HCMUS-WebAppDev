const express = require("express");
const profileController = require("../controllers/profile.controller");

const router = express.Router();

router.use((req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/user/signin');
})

router.get("/", profileController.getProfile);
router.get("/changepassword", profileController.getChangePasswordP);

router.post("/update", profileController.updateProfile);

module.exports = router;
