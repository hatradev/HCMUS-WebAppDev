const express = require("express");
const productController = require("../controllers/product.controller");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.use(userController.checkRole("user"));

router.get("/all", productController.showAllProduct);
router.get("/:productId", productController.showSpecificProduct);

router.get("/api/all-products", productController.showAllProduct);
router.get("/api/filter-products", productController.filterProducts);
router.get("/api/search-products", productController.searchProducts);

router.delete("/cart/:id", productController.deleteFromCart);
// router.post('/cart/updateQuantity', productController.updateCartQuantity);
// router.post('/update-cart-quantity/:id', productController.updateCartQuantity);
router.post("/cart/update", productController.updateQuantityInCart);
router.post("/cart/add", productController.addToCart);

router.get("/handle", productController.getHandle);

module.exports = router;
