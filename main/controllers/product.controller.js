const mongoose = require("mongoose");
const Product = require("../models/product.model");
const Category = require("../models/category.model");
const Account = require("../models/account.model");

class productController {
  // Method to display all products
  showAllProduct = async (req, res, next) => {
    try {
      const products = await Product.find().lean();
      const categories = await Category.find({ parentCategory: null }).lean(); // Get only main categories

      for (const category of categories) {
        // Count products in the main category
        category.count = await Product.countDocuments({
          category: category._id,
        });

        // Get subcategories of the main category
        const subcategories = await Category.find({
          parentCategory: category._id,
        }).lean();

        // Count products in each subcategory and add to total count
        for (const subcategory of subcategories) {
          const subcategoryCount = await Product.countDocuments({
            category: subcategory._id,
          });
          subcategory.count = subcategoryCount;
          category.count += subcategoryCount;
        }

        category.subcategories = subcategories; // Attach subcategories to the main category
      }

      res.render("all-product", { products, categories });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  showSpecificProduct = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const objectId = new mongoose.Types.ObjectId(productId);
      const product = await Product.findById(objectId).lean();

      if (!product) {
        res.status(404).send("Product not found");
        return;
      }

      let related = [];
      const limit = 6;

      // Find related products in the same category
      related = await Product.find({
        category: product.category,
        _id: { $ne: objectId },
      })
        .limit(limit)
        .lean();

      // Fetch immediate child categories if necessary
      if (related.length < limit) {
        const childCategories = await Category.find({
          parentCategory: product.category,
        }).lean();

        for (const childCategory of childCategories) {
          const childProducts = await Product.find({
            category: childCategory._id,
            _id: { $ne: objectId },
          })
            .limit(limit - related.length)
            .lean();

          related = related.concat(childProducts);
          if (related.length >= limit) break;
        }
      }

      // Fetch sibling categories if necessary
      if (related.length < limit) {
        const currentCategory = await Category.findById(
          product.category
        ).lean();
        if (currentCategory.parentCategory) {
          const siblingCategories = await Category.find({
            parentCategory: currentCategory.parentCategory,
            _id: { $ne: currentCategory._id },
          }).lean();

          for (const siblingCategory of siblingCategories) {
            const siblingProducts = await Product.find({
              category: siblingCategory._id,
              _id: { $ne: objectId },
            })
              .limit(limit - related.length)
              .lean();

            related = related.concat(siblingProducts);
            if (related.length >= limit) break;
          }
        }
      }

      // Fetch products from the immediate ancestor category if necessary
      if (related.length < limit) {
        const currentCategory = await Category.findById(
          product.category
        ).lean();
        if (currentCategory && currentCategory.parentCategory) {
          const ancestorProducts = await Product.find({
            category: currentCategory.parentCategory,
            _id: { $ne: objectId },
          })
            .limit(limit - related.length)
            .lean();

          related = related.concat(ancestorProducts);
        }
      }

      res.render("specific-product", { product, related });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  deleteFromCart = async (req, res, next) => {
    try {
      // const accountId = req.user._id; // hoặc lấy từ session hoặc JWT
      const accountId = "659f66740be458c494290c39"; // hoặc lấy từ session hoặc JWT
      const productId = req.params.id; // ID của sản phẩm cần xóa

      // Tìm tài khoản người dùng
      const account = await Account.findById(accountId);

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      // Xóa sản phẩm khỏi giỏ hàng
      account.cart = account.cart.filter(
        (item) => item.id_product.toString() !== productId
      );

      // Lưu lại thay đổi
      await account.save();

      res.json(account.cart); // Gửi lại giỏ hàng đã cập nhật
    } catch (err) {
      res
        .status(500)
        .json({ message: "An error occurred", error: err.message });
    }
  };

  updateQuantityInCart = async (req, res, next) => {
    try {
      const accountId = "659f66740be458c494290c39"; // Hoặc lấy từ session hoặc JWT
      const { productId, newQuantity } = req.body;

      if (newQuantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      // Tìm tài khoản người dùng và cập nhật số lượng sản phẩm trong giỏ hàng
      // const account = await Account.findOneAndUpdate(
      //   { _id: accountId, "cart.id_product".toString() == productId },
      //   { $set: { "cart.$.quantity": newQuantity } },
      //   { new: true }
      // );

      const account = await Account.findById(accountId);

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      // Find the product in the cart and update its quantity
      let productFound = false;
      account.cart.forEach((item) => {
        if (item.id_product.toString() === productId) {
          item.quantity = newQuantity;
          productFound = true;
        }
      });

      // If product not found in cart, handle appropriately
      if (!productFound) {
        return res.status(404).json({ message: "Product not found in cart" });
      }

      // Save the updated account
      await account.save();

      res.json(account.cart); // Send back the updated cart
    } catch (err) {
      res
        .status(500)
        .json({ message: "An error occurred", error: err.message });
    }
  };

  filterProducts = async (req, res, next) => {
    try {
      const { category, minPrice, maxPrice } = req.query;

      let query = Product.find();

      if (category) {
        query = query.where("category").equals(category);
      }
      if (minPrice) {
        query = query.where("price").gte(minPrice);
      }
      if (maxPrice) {
        query = query.where("price").lte(maxPrice);
      }

      const filteredProducts = await query.lean();
      res.json(filteredProducts);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error filtering products");
    }
  };
}

// Export an instance of the controller
module.exports = new productController();
