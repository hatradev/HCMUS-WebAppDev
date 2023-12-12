const express = require("express");
const siteController = require("../controllers/site.controller");

const router = express.Router();
router.get("/", siteController.getHome);
router.get("/my-cart", siteController.getCart);

module.exports = router;
