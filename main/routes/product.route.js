const express = require("express");
const productController = require("../controllers/product.controller");

const router = express.Router();
router.get("/all", productController.showAllProduct);
router.get("/:productId", productController.showSpecificProduct);
router.delete("/cart/:id", productController.deleteFromCart);


module.exports = router;