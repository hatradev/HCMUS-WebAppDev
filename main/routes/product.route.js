const express = require("express");
const productController = require("../controllers/product.controller");

const router = express.Router();

router.use((req, res, next) => {
    if (req.cookies && req.cookies.obj){
     return next();
    }
     res.redirect('/user/signin');
 })
 
router.get("/all", productController.showAllProduct);
router.get("/:productId", productController.showSpecificProduct);
router.delete("/cart/:id", productController.deleteFromCart);
// router.post('/cart/updateQuantity', productController.updateCartQuantity);
// router.post('/update-cart-quantity/:id', productController.updateCartQuantity);
router.post("/cart/update", productController.updateQuantityInCart);

router.get("/api/filter-products", productController.filterProducts);

module.exports = router;
