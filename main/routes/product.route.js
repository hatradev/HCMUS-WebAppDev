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

module.exports = router;