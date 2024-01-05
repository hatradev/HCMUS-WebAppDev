const express = require("express");
const productController = require("../controllers/product.controller");

const router = express.Router();
router.get("/all", productController.displayAll);
router.get("/specific", productController.displaySpecific);

module.exports = router;