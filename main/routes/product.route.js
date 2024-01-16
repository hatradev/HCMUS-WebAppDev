const express = require("express");
const productController = require("../controllers/product.controller");
<<<<<<< Updated upstream

const router = express.Router();

router.use((req, res, next) => {
    if (req.cookies && req.cookies.obj){
     return next();
    }
     res.redirect('/user/signin');
 })
 
router.get("/all", productController.showAllProduct);
=======
const userController = require("../controllers/user.controller");

const router = express.Router();

router.use(userController.checkRole("user"));

router.get("/", productController.renderAllProduct);
>>>>>>> Stashed changes
router.get("/:productId", productController.showSpecificProduct);
router.delete("/cart/:id", productController.deleteFromCart);
// router.post('/cart/updateQuantity', productController.updateCartQuantity);
// router.post('/update-cart-quantity/:id', productController.updateCartQuantity);
router.post("/cart/update", productController.updateQuantityInCart);

<<<<<<< Updated upstream
router.get("/api/filter-products", productController.filterProducts);
=======
router.get("/handle", productController.getHandle);
>>>>>>> Stashed changes

module.exports = router;
