const express = require("express");
const productController = require("../controllers/product.controller");
const userController = require("../controllers/user.controller");

const multer = require("multer");
const upload = multer({ dest: "main/source/public/img/products" });

const router = express.Router();

router.get("/handle", productController.getHandle);
router.get("/categories", productController.getCateHandle);

router.get("/", productController.renderAllProduct);
router.get("/:productId", productController.showSpecificProduct);
router.get("/api/products", productController.APIProducts);
router.get("/api/related", productController.APIRelatedProducts);

router.post("/create-category", productController.createCategory);
router.post("/update-category", productController.updateCategory);
router.post("/delete-category", productController.deleteCategory);

router.post("/delete-product", productController.deleteProduct);
router.post("/update-product", productController.updateProduct);
router.post(
  "/create-product",
  upload.array("image", 12),
  productController.createProduct
);

router.use(userController.checkRole("user"));

// router.get("/api/all-products", productController.showAllProduct);
// router.get("/api/filter-products", productController.filterProducts);
// router.get("/api/search-products", productController.searchProducts);

router.delete("/cart/:id", productController.deleteFromCart);
// router.post('/cart/updateQuantity', productController.updateCartQuantity);
// router.post('/update-cart-quantity/:id', productController.updateCartQuantity);
router.post("/cart/update", productController.updateQuantityInCart);
router.post("/cart/add", productController.addToCart);

module.exports = router;
