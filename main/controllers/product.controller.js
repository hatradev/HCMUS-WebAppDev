const mongoose = require("mongoose");
const Product = require("../models/product.model");
const Category = require("../models/category.model");
const Account = require("../models/account.model");

const defaultLimit = 12;

class productController {
  getCategoryTree = async () => {
    // Fetch categories from the database
    const categories = await Category.find().lean();

    // Function to construct a hierarchical tree from categories
    const buildTree = (categories, parentId = null) => {
      return categories
        .filter((cat) => String(cat.parentCategory) === String(parentId))
        .map((cat) => ({ ...cat, children: buildTree(categories, cat._id) }));
    };

    // Construct the hierarchical tree from categories
    return buildTree(categories);
  };

  renderAllProduct = async (req, res, next) => {
    try {
      const categories = await this.getCategoryTree();

      res.render("all-product", {
        categories,
      });
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
      // console.log(product);

      if (!product) {
        res.status(404).send("Product not found");
        return;
      }

      res.render("specific-product", { product });
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  APIRelatedProducts = async (req, res, next) => {
    try {
      const {
        productId,
        page = 1,
        limit = defaultLimit,
      } = req.query;

      // console.log(page);
  
      // console.log(productId);

      const objectId = new mongoose.Types.ObjectId(productId);
      const product = await Product.findById(objectId).lean();
      // console.log(product);
      const currentCategory = await Category.findById(product.category).lean();
      // console.log(currentCategory);
  
      if (!product) {
        res.status(404).send("Product not found");
        return;
      }
  
      let related = [];
      let totalProducts = 0;
      let query = {};
  
      let skip = (page - 1) * limit;
      const calculateSkip = (skip, totalProducts, relatedLength) => {
        skip -= totalProducts - relatedLength;
        if (skip < 0) skip = 0;
        // console.log(skip);
        return skip;
      };
  
      // Find related products in the same category
      // console.log(product.category);
      // console.log(objectId);
      // console.log(skip);
      // console.log(limit);
      query = {
        category: product.category,
        _id: { $ne: objectId },
      }
      related = await Product.find(query)
        .skip(skip)
        .limit(limit)
        .lean();
      totalProducts += await Product.countDocuments(query);
      skip = calculateSkip(skip, totalProducts, related.length);
  
      // If the limit is not reached, continue with child categories
      // console.log(skip - related.length);
      if (related.length < limit) {
        // Fetch child categories
        const childCategories = await Category.find({
          parentCategory: product.category,
        }).lean();

        // console.log(childCategories);
  
        for (const childCategory of childCategories) {
          query = {
            category: childCategory._id,
            _id: { $ne: objectId },
          }
          const skipValue = skip;
          const limitValue = limit - related.length;
          const childProducts = await Product.find(query)
            .skip(skipValue) // Adjust skip based on already fetched products
            .limit(limitValue)
            .lean();
          related = related.concat(childProducts);
          totalProducts += await Product.countDocuments(query);
          skip = calculateSkip(skip, totalProducts, related.length);

          if (related.length >= limit) break;
        }
      }
  
      // console.log(related.length);
      // console.log(totalProducts);

      // Check if more products are needed from sibling categories
      if (related.length < limit && currentCategory.parentCategory) {
        const siblingCategories = await Category.find({
          parentCategory: currentCategory.parentCategory,
          _id: { $ne: currentCategory._id },
        }).lean();
      
        for (const siblingCategory of siblingCategories) {
          query = {
            category: siblingCategory._id,
            _id: { $ne: objectId },
          }
          const skipValue = skip;
          const limitValue = limit - related.length;

          // console.log(skipValue, limitValue);

          const siblingProducts = await Product.find(query)
            .skip(skipValue) // Adjust skip based on already fetched products
            .limit(limitValue)
            .lean();
          related = related.concat(siblingProducts);
          totalProducts += await Product.countDocuments(query);
          skip = calculateSkip(skip, totalProducts, related.length);

          if (related.length >= limit) break;
        }
      }

      // console.log(related.length);
      // console.log(totalProducts);

      // Check if more products are needed from the ancestor category
      if (related.length < limit && currentCategory.parentCategory) {
        query = {
          category: currentCategory.parentCategory,
          _id: { $ne: objectId },
        }
        const skipValue = skip;
        const limitValue = limit - related.length;
        const ancestorProducts = await Product.find(query)
          .skip(skipValue)
          .limit(limitValue)
          .lean();
        related = related.concat(ancestorProducts);
        totalProducts += await Product.countDocuments(query);
        skip = calculateSkip(skip, totalProducts, related.length);
      }

      // console.log(related.length);
    
      const totalPages = Math.ceil(totalProducts / limit);
  
      const pageNumbers = [];
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push({
          number: i,
          isCurrent: i === parseInt(page),
        });
      }
      const paginationData = {
        pages: pageNumbers,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        hasNextPage: page < totalPages,
        nextPage: page + 1,
      };

      res.json({
        products: related,
        pagination: paginationData,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }  

  // APIRelatedProducts = async (req, res, next) => {
  //   try {
  //     const {
  //       page = 1,
  //       limit = defaultLimit,
  //     } = req.query;

  //     const { productId } = req.params;
  //     const objectId = new mongoose.Types.ObjectId(productId);
  //     const product = await Product.findById(objectId).lean();
  //     const currentCategory = await Category.findById(
  //       product.category
  //     ).lean();

  //     if (!product) {
  //       res.status(404).send("Product not found");
  //       return;
  //     }

  //     let related = [];

  //     // Find related products in the same category
  //     related = await Product.find({
  //       category: product.category,
  //       _id: { $ne: objectId },
  //     })
  //       .limit(limit)
  //       .lean();

  //     // Fetch child categories
  //     const childCategories = await Category.find({
  //       parentCategory: product.category,
  //     }).lean();

  //     for (const childCategory of childCategories) {
  //       const childProducts = await Product.find({
  //         category: childCategory._id,
  //         _id: { $ne: objectId },
  //       })
  //         .limit(limit - related.length)
  //         .lean();

  //       related = related.concat(childProducts);
  //       if (related.length >= limit) break;
  //     }

  //     // Fetch sibling categories if necessary
  //     if (currentCategory.parentCategory) {
  //       const siblingCategories = await Category.find({
  //         parentCategory: currentCategory.parentCategory,
  //         _id: { $ne: currentCategory._id },
  //       }).lean();

  //       for (const siblingCategory of siblingCategories) {
  //         const siblingProducts = await Product.find({
  //           category: siblingCategory._id,
  //           _id: { $ne: objectId },
  //         })
  //           .limit(limit - related.length)
  //           .lean();

  //         related = related.concat(siblingProducts);
  //         if (related.length >= limit) break;
  //       }
  //     }

  //     // Fetch products from the immediate ancestor category if necessary
  //     if (currentCategory && currentCategory.parentCategory) {
  //       const ancestorProducts = await Product.find({
  //         category: currentCategory.parentCategory,
  //         _id: { $ne: objectId },
  //       })
  //         .limit(limit - related.length)
  //         .lean();

  //       related = related.concat(ancestorProducts);
  //     }

  //     const skip = (page - 1) * limit;
  //     const totalProducts = related.length;
  //     const totalPages = Math.ceil(totalProducts / limit);

  //     const pageNumbers = [];
  //     for (let i = 1; i <= totalPages; i++) {
  //       pageNumbers.push({
  //         number: i,
  //         isCurrent: i === parseInt(page),
  //       });
  //     }
  //     const paginationData = {
  //       pages: pageNumbers,
  //       hasPreviousPage: page > 1,
  //       previousPage: page - 1,
  //       hasNextPage: page < totalPages,
  //       nextPage: page + 1,
  //     };

  //     res.json({
  //       products: related,
  //       pagination: paginationData,
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     next(err);
  //   }
  // }

  getAllDescendantCategoryIds = async (parentCategoryId) => {
    const categoriesToProcess = [parentCategoryId];
    const allCategoryIds = new Set();

    while (categoriesToProcess.length > 0) {
      const currentCategoryId = categoriesToProcess.pop();
      allCategoryIds.add(currentCategoryId);

      const childCategories = await Category.find({
        parentCategory: currentCategoryId,
      }).lean();
      childCategories.forEach((cat) =>
        categoriesToProcess.push(cat._id.toString())
      );
    }

    return Array.from(allCategoryIds);
  };

  // showAllProduct = async (req, res, next) => {
  //   try {
  //     const page = parseInt(req.query.page) || 1;
  //     const limit = parseInt(req.query.limit) || defaultLimit;
  //     const skip = (page - 1) * limit;

  //     // Fetch total number of products
  //     const totalProducts = await Product.countDocuments();

  //     const products = await Product.find().skip(skip).limit(limit).lean();

  //     // Calculate total pages
  //     const totalPages = Math.ceil(totalProducts / limit);

  //     const pageNumbers = [];
  //     for (let i = 1; i <= totalPages; i++) {
  //       pageNumbers.push({
  //         number: i,
  //         isCurrent: i === page,
  //       });
  //     }

  //     const paginationData = {
  //       pages: pageNumbers,
  //       hasPreviousPage: page > 1,
  //       previousPage: page - 1,
  //       hasNextPage: page < totalPages,
  //       nextPage: page + 1,
  //     };

  //     res.json({
  //       products,
  //       pagination: paginationData,
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     next(err);
  //   }
  // };

  APIProducts = async (req, res) => {
    try {
      const {
        keyword,
        category,
        minPrice,
        maxPrice,
        sortOrder,
        page = 1,
        limit = defaultLimit,
      } = req.query;

      let query = {};

      if (keyword) {
        query.name = { $regex: keyword, $options: "i" }; // Case-insensitive search
      }
      if (category) {
        const allCategoryIds = await this.getAllDescendantCategoryIds(category);
        query.category = { $in: allCategoryIds };
      }
      if (minPrice) {
        query.price = { ...query.price, $gte: parseFloat(minPrice) };
      }
      if (maxPrice) {
        query.price = { ...query.price, $lte: parseFloat(maxPrice) };
      }

      const skip = (page - 1) * limit;
      const totalProducts = await Product.countDocuments(query);
      const totalPages = Math.ceil(totalProducts / limit);

      // Sorting logic
      let sortQuery = {};
      if (sortOrder === 'low-to-high') {
        sortQuery.price = 1; // Ascending order
      } else if (sortOrder === 'high-to-low') {
        sortQuery.price = -1; // Descending order
      }

      // console.log(sortQuery);

      const filteredProducts = await Product.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean();

      const pageNumbers = [];
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push({
          number: i,
          isCurrent: i === parseInt(page),
        });
      }
      const paginationData = {
        pages: pageNumbers,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        hasNextPage: page < totalPages,
        nextPage: page + 1,
      };

      res.json({
        products: filteredProducts,
        pagination: paginationData,
      });
    } catch (error) {
      console.error("Error in filterProducts:", error);
      res.status(500).send("Server error");
    }
  };

  // searchProducts = async (req, res) => {
  //   try {
  //     const { keyword, page = 1, limit = defaultLimit } = req.query;
  //     const skip = (page - 1) * limit;

  //     const searchQuery = {
  //       name: { $regex: keyword, $options: "i" }, // Case-insensitive search
  //     };

  //     const totalProducts = await Product.countDocuments(searchQuery);
  //     const totalPages = Math.ceil(totalProducts / limit);

  //     const products = await Product.find(searchQuery)
  //       .skip(skip)
  //       .limit(limit)
  //       .lean();

  //     // Create page numbers array
  //     const pageNumbers = [];
  //     for (let i = 1; i <= totalPages; i++) {
  //       pageNumbers.push({
  //         number: i,
  //         isCurrent: i === parseInt(page),
  //       });
  //     }

  //     const paginationData = {
  //       pages: pageNumbers,
  //       hasPreviousPage: page > 1,
  //       previousPage: page - 1,
  //       hasNextPage: page < totalPages,
  //       nextPage: page + 1,
  //     };

  //     res.json({
  //       products,
  //       pagination: paginationData,
  //     });
  //   } catch (error) {
  //     console.error("Error:", error);
  //     res.status(500).send("Server error");
  //   }
  // };

  deleteFromCart = async (req, res, next) => {
    try {
      // const accountId = req.user._id; // hoặc lấy từ session hoặc JWT
      // const accountId = "659f8a8c0be458c494290c40"; // hoặc lấy từ session hoặc JWT
      const accountId = req.cookies.user._id.toString();
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
      // const accountId = "659f8a8c0be458c494290c40"; // Hoặc lấy từ session hoặc JWT
      const accountId = req.cookies.user._id.toString();
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

  addToCart = async (req, res, next) => {
    try {
      // Assuming the user's ID is obtained from the session or a JWT token
      // const accountId = req.user._id; // Replace with your session or JWT token logic
      // const accountId = "659f8a8c0be458c494290c40";
      const accountId = req.cookies.user._id.toString();
      const { productId, quantity } = req.body;
      // console.log("check accID id");
      // console.log(accountId);
      // console.log("end check accID id");
      if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Invalid product ID format" });
      }

      if (!productId || quantity <= 0) {
        return res
          .status(400)
          .json({ message: "Invalid product ID or quantity" });
      }

      const account = await Account.findById(accountId);

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      // Check if the product already exists in the cart
      const productIndex = account.cart.findIndex(
        (item) => item.id_product.toString() === productId
      );

      if (productIndex > -1) {
        // Update quantity if product already in cart
        account.cart[productIndex].quantity += quantity;
      } else {
        // Add new product to cart
        const ObjectId = mongoose.Types.ObjectId;
        // account.cart.push({ id_product: productId, quantity });
        account.cart.push({ id_product: new ObjectId(productId), quantity });
      }

      // Save the updated account
      await account.save();

      res.json({
        message: "Product added to cart successfully",
        cart: account.cart,
      });
    } catch (err) {
      console.error("Error adding product to cart:", err);
      res
        .status(500)
        .json({ message: "An error occurred", error: err.message });
    }
  };
}

// Export an instance of the controller
// Export an instance of the controller
module.exports = new productController();
