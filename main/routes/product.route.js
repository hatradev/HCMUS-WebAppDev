const express = require("express");
const productController = require("../controllers/product.controller");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.get("/handle", userController.checkRole("admin"),productController.getHandle);
router.get("/categories", userController.checkRole("admin"), productController.getCateHandle);

router.get("/", productController.renderAllProduct);
router.get("/:productId", productController.showSpecificProduct);
router.get("/api/products", productController.APIProducts);
router.get("/api/related", productController.APIRelatedProducts);

router.post("/create-category", userController.checkRole("admin"), productController.createCategory);
router.post("/update-category", userController.checkRole("admin"), productController.updateCategory);
router.post("/delete-category", userController.checkRole("admin"), productController.deleteCategory);

router.post("/delete-product", userController.checkRole("admin"), productController.deleteProduct);
router.post("/update-product", userController.checkRole("admin"), productController.updateProduct);

router.delete("/cart/:id", userController.isLogin, productController.deleteFromCart);
router.post("/cart/update", userController.isLogin, productController.updateQuantityInCart);
router.post("/cart/add", userController.isLogin, productController.addToCart);

module.exports = router;
