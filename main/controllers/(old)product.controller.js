const Product = require("../models/product.model");
const fs = require("fs");
const Evaluate = require("../models/evaluate.model");
const Account = require("../models/account.model");
const Order = require("../models/order.model");

const sequelize = require("sequelize");
const Op = sequelize.Op;

const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../utils/mongoose");
const { formatCurrency } = require("../helpers/handlebars");

var allProducts;

class productController {
  // [GET] product/dashboard
  getDashboard = async (req, res, next) => {
    try {
      const options = { idAccount: req.user.id };
      let income = 0; //
      let order = 0; //
      let stock = 0; //
      let review = 0; //
      let sucOrder = 0; //
      let rating = 0;
      let sumRating = 0;
      let idProductForFindEval = [];
      let cate = [0, 0, 0, 0];
      // Tính toán *******************
      const orders = await Order.find({ idSeller: req.user.id });
      const productAll = await Product.find(options);
      order = orders.length;
      for (let i = 0; i < orders.length; i++) {
        if (orders[i].status == "successful") {
          sucOrder += 1;
          for (const product of orders[i].detail) {
            const productInfo = await Product.findById(product.idProduct);
            income += productInfo.price * product.quantity;
          }
        }
      }
      for (const product of productAll) {
        stock += product.stock;
        if (product.category == "document") cate[0] += product.stock;
        else if (product.category == "uniform") cate[1] += product.stock;
        else if (product.category == "stationery") cate[2] += product.stock;
        else cate[3] += product.stock;
        idProductForFindEval.push({ idProduct: product._id });
      }
      let evaluates = [];
      if (idProductForFindEval?.length > 0) {
        evaluates = await Evaluate.find({ $or: idProductForFindEval });
      }
      stock = productAll.reduce((acc, product) => acc + product.stock, 0);
      review = evaluates.length;
      for (let i = 0; i < evaluates.length; i++) {
        sumRating += evaluates[i].rating;
        if (evaluates[i].rating > 0) {
          rating += 1;
        }
      }
      // ****************************************
      res.locals._document = cate[0];
      res.locals._uniform = cate[1];
      res.locals._stationery = cate[2];
      res.locals._other = cate[3];
      res.locals._income = income;
      res.locals._order = order;
      res.locals._stock = stock;
      res.locals._review = review;
      res.locals._sucOrder = sucOrder;
      res.locals._rating = (sumRating / rating).toFixed(1);
      if (isNaN(res.locals._rating)) {
        res.locals._rating = 0;
      }
      res.locals._percent = ((sucOrder / order) * 100).toFixed(0);
      if (isNaN(res.locals._percent)) {
        res.locals._percent = 0;
      }
      res.render("dashboard", {
        convertMoney: (str) => {
          return Number(str).toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          });
        },
        calcPercent: (value, total) => ((value / total) * 100).toFixed(0),
      });
    } catch (err) {
      next(err);
    }
  };

  // [GET] product/manage
  getManage = async (req, res, next) => {
    try {
      let options = {
        idAccount: req.user.id,
        $or: [{ status: "Available" }, { status: "Reported" }],
      };
      // let options = { idAccount: req.user.id, status: "Available" };
      // Tìm kiếm
      let keyword = req.query.keyword || "";
      // Lọc theo loại
      let category = req.query.category || "";
      // Sắp xếp
      let sortBy = req.query.sortBy || "-updatedAt";
      keyword = keyword.trim();
      let originalUrl = req.originalUrl;
      if (keyword != "") {
        const regex = new RegExp(keyword, "i");
        options.name = regex;
      }
      if (category != "") {
        options.category = category;
      }
      // Phân trang
      let page = isNaN(req.query.page)
        ? 1
        : Math.max(1, parseInt(req.query.page));
      const limit = 5;
      // Thực hiện truy vấn
      let products = await Product.find(options)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(sortBy);
      res.locals._keyword = keyword;
      res.locals._category = category;
      res.locals._sortBy = sortBy;
      res.locals._numberOfItems = await Product.find(options).countDocuments();
      res.locals._limit = limit;
      res.locals._currentPage = page;
      res.locals._originalUrl = req.url;
      res.render("manage-product", {
        products: mutipleMongooseToObject(products),
        helpers: {
          isEqual(c1, c2) {
            return c1 == c2;
          },
          convertMoney: (str) => {
            return Number(str).toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            });
          },
        },
      });
    } catch (err) {
      next(err);
    }
  };

  // [GET] product/edit/
  getEditForCreate = (req, res) => {
    res.render("edit-product", {
      helpers: {
        isCategory(c1, c2) {
          return c1 == "Document";
        },
      },
    });
  };

  // [POST] product/edit/save
  createNewProduct = async (req, res, next) => {
    try {
      // Lưu thông tin sản phẩm vào trong database
      const formData = req.body;
      formData.idAccount = req.user.id;
      formData.price = Number(formData.price);
      formData.stock = Number(formData.stock);
      formData.isTrend = Number(formData.isTrend);
      formData.keyword = formData.keyword.split(",");
      formData.keyword = formData.keyword.map((str) => str.trim());
      if (formData.isTrend) {
        formData.status = "Trending";
      }
      formData.isTrend = false;
      if (req.file && !req.fileValidationError) {
        formData.image = req.file.path.replace("source/public", "");
      } else {
        formData.image = "/img/products/default.png";
      }
      const newProduct = new Product(formData);
      await newProduct.save();
      res.render("message/processing-request");
    } catch (err) {
      next(err);
    }
  };

  // [GET] product/edit/:id
  getEditForUpdate = async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      res.render("edit-product", {
        product: mongooseToObject(product),
        helpers: {
          isCategory(c1, c2) {
            return c1 == c2;
          },
        },
        getEditForUpdate: true,
      });
    } catch (err) {
      next(err);
    }
  };

  // [POST] product/edit/save/:id
  updateProduct = async (req, res, next) => {
    try {
      const formData = req.body;
      const product = await Product.findById(req.params.id);
      if (req.file) {
        if (product.image != "/img/products/default.png") {
          fs.unlinkSync(`./source/public${product.image}`);
        }
        formData.image = req.file.path.replace("source/public", "");
      } else if (product.image == "/img/products/default.png") {
        formData.image = "/img/products/default.png";
      }
      formData.status = "Pending";
      await Product.updateOne({ _id: req.params.id }, formData);
      res.render("message/processing-request");
    } catch (err) {
      next(err);
    }
  };

  // [POST] product/delete/:id
  deleteProduct = async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (product.image != "/img/products/default.png") {
        fs.unlinkSync(`./source/public${product.image}`);
      }
      await Product.deleteOne({ _id: req.params.id });
      res.redirect(
        `/product/manage?page=${req.query.page ? req.query.page : ""}`
      );
    } catch (err) {
      next(err);
    }
  };

  // [GET] product/cart
  getCart = async (req, res, next) => {
    try {
      res.json(req.session.cart);
    } catch (err) {
      next(err);
    }
  };

  // [POST] product/cart
  add2Cart = async (req, res, next) => {
    try {
      // Lấy id và quantity sản phẩm gửi từ client
      let id = req.body.id;
      let quantity = parseInt(req.body.quantity);
      let product = await Product.findById(id);
      // Chuyển Mongoose obj thành obj thuần để thêm field quantity
      product = product.toObject();
      // Thêm sản phẩm vào cart của user
      if (product) {
        let isFound = false;
        isFound = req.session.cart.some((ele) => {
          if (ele._id == id) {
            ele.quantity += quantity;
            return true;
          }
        });
        if (!isFound) {
          product.quantity = quantity;
          req.session.cart.push(product);
        }
      }
      res.json(req.session.cart);
    } catch (err) {
      next(err);
    }
  };

  // [DELETE] product/cart
  deleteFromCart = async (req, res, next) => {
    try {
      await req.session.cart.forEach(async (product, idx) => {
        if (product._id == req.params.id) {
          req.session.cart.splice(idx, 1);
          req.user.cart = JSON.parse(JSON.stringify(req.session.cart));
          if (req.user) {
            let account = await Account.findById(req.user._id);
            account.cart = req.user.cart;
            await account.save();
          }
        }
      });
      res.json(req.session.cart);
    } catch (err) {
      next(err);
    }
  };

  // [GET] product/all-product
  showAllProduct = async (req, res, next) => {
    try {
      let page = isNaN(req.query.page)
        ? 1
        : Math.max(1, parseInt(req.query.page));
      const limit = 8;
      const products = await Product.find({
        $or: [{ status: "Available" }, { status: "Reported" }],
      })
        .skip((page - 1) * limit)
        .limit(limit);
      const categories = await Product.aggregate([
        {
          $match: {
            status: { $in: ["Available", "Reported"] },
          },
        },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);
      res.locals._numberOfItems = await Product.find({
        $or: [{ status: "Available" }, { status: "Reported" }],
      }).countDocuments();
      res.locals._limit = limit;
      res.locals._currentPage = page;

      res.locals.categories = categories;
      res.locals.products = mutipleMongooseToObject(products);
      res.render("all-product");
    } catch (error) {
      next(error);
    }
  };

  // [GET] product/all-product/category
  filterProduct = async (req, res, next) => {
    try {
      let page = isNaN(req.query.page)
        ? 1
        : Math.max(1, parseInt(req.query.page));
      const limit = 8;

      const type = req.query.category; //? req.query.category : 0
      const products = await Product.find({
        category: type,
        $or: [{ status: "Available" }, { status: "Reported" }],
      })
        .skip((page - 1) * limit)
        .limit(limit);
      const categories = await Product.aggregate([
        {
          $match: {
            status: { $in: ["Available", "Reported"] },
          },
        },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 }, // Sắp xếp giảm dần dựa trên trường 'count'
        },
      ]);
      res.locals._numberOfItems = await Product.find({
        category: type,
        $or: [{ status: "Available" }, { status: "Reported" }],
      }).countDocuments();
      res.locals._limit = limit;
      res.locals._currentPage = page;

      res.locals.categories = categories;
      res.locals.products = mutipleMongooseToObject(products);

      res.render("all-product");
    } catch (error) {
      next(error);
    }
  };

  // [GET] product/all-product/sort
  sortProduct = async (req, res, next) => {
    try {
      let page = isNaN(req.query.page)
        ? 1
        : Math.max(1, parseInt(req.query.page));
      const limit = 8;

      const type = req.query.sort;
      const order = req.query.order;
      let options = {};
      if (req.query.category) {
        options.category = req.query.category;
      }
      const keyword = req.query.keyword || "";
      if (keyword.trim() != "") {
        const regex = new RegExp(keyword, "i");
        options.name = regex;
      }

      options.$or = [{ status: "Available" }, { status: "Reported" }];

      const products = await Product.find(options)
        .sort({ [type]: order })
        .skip((page - 1) * limit)
        .limit(limit);
      const categories = await Product.aggregate([
        {
          $match: {
            status: { $in: ["Available", "Reported"] },
          },
        },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      res.locals._numberOfItems = await Product.find(options).countDocuments();
      res.locals._limit = limit;
      res.locals._currentPage = page;
      res.locals.categories = categories;
      res.locals.products = mutipleMongooseToObject(products);

      res.render("all-product");
    } catch (error) {
      next(error);
    }
  };

  // [GET] product/all-product/search
  searchProduct = async (req, res, next) => {
    try {
      let page = isNaN(req.query.page)
        ? 1
        : Math.max(1, parseInt(req.query.page));
      const limit = 8;

      const keyword = req.query.keyword || "";
      if (keyword.trim() != "") {
        const regex = new RegExp(keyword, "i");
        const products = await Product.find({
          name: regex,
          $or: [{ status: "Available" }, { status: "Reported" }],
        })
          .skip((page - 1) * limit)
          .limit(limit);

        const categories = await Product.aggregate([
          {
            $match: {
              status: { $in: ["Available", "Reported"] },
            },
          },
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
            },
          },
          {
            $sort: { _id: 1 },
          },
        ]);
        res.locals._numberOfItems = await Product.find({
          name: regex,
          $or: [{ status: "Available" }, { status: "Reported" }],
        }).countDocuments();
        res.locals._limit = limit;
        res.locals._currentPage = page;

        res.locals.categories = categories;
        res.locals.products = mutipleMongooseToObject(products);
        res.render("all-product");
      } else res.redirect("back");
    } catch (error) {
      next(error);
    }
  };

  // [GET] product/specific-product
  showSpecificProduct = async (req, res, next) => {
    try {
      const productId = req.params.id;

      const product = await Product.findOne({ _id: productId });
      const details = product.description.split("\n");
      const evaluates = await Evaluate.find({ idProduct: productId })
        .populate({
          path: "idAccount",
          select: "firstName lastName avatar",
        })
        .sort({ date: -1 });

      const evaNumber = await Evaluate.find({ idProduct: productId })
        .populate({
          path: "idAccount",
          select: "firstName lastName avatar",
        })
        .sort({ date: -1 })
        .countDocuments();
      const ratings = await Evaluate.find({
        idProduct: productId,
        rating: { $ne: 0 },
      }).select("rating");
      const totalRatings = ratings.length;
      const sumRatings = ratings.reduce(
        (sum, rating) => sum + rating.rating,
        0
      );
      const avgRating = sumRatings / totalRatings;

      const related = await Product.aggregate([
        {
          $match: {
            keyword: product.keyword,
          },
        },
        { $limit: 6 },
      ]);

      res.locals.evaNumber = evaNumber;
      res.locals.details = details;
      res.locals.product = mongooseToObject(product);
      res.locals.stars = avgRating;
      res.locals.related = related;
      res.locals.evaluates = mutipleMongooseToObject(evaluates);

      res.render("specific-product", {
        formatCurrency: formatCurrency,
      });
    } catch (error) {
      next(error);
    }
  };

  // [PUT] product/specific-product/:id/report
  reportProduct = async (req, res, next) => {
    try {
      const productId = req.params.id;
      await Product.updateOne(
        { _id: productId },
        { $set: { status: "Reported" } }
      );
      res.redirect("back");
    } catch (error) {
      next(error);
    }
  };

  // [GET] product/full
  getFullProduct = async (req, res, next) => {
    try {
      let page = isNaN(req.query.page)
        ? 1
        : Math.max(1, parseInt(req.query.page));

      const limit = 10;
      const product1 = await Product.find()
        .populate("idAccount")
        .sort({ time: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      const allProducts = mutipleMongooseToObject(product1);

      res.locals._numberOfItems = await Product.find().countDocuments();
      res.locals._limit = limit;
      res.locals._currentPage = page;
      res.render("admin_product_all", {
        products: allProducts,
        numOfProducts: allProducts.length,
      });
    } catch (error) {
      next(error);
    }
  };

  // [GET] product/banned
  getBannedProduct = async (req, res, next) => {
    try {
      let page = isNaN(req.query.page)
        ? 1
        : Math.max(1, parseInt(req.query.page));

      const limit = 10;
      const product1 = await Product.find({ status: "Banned" })
        .populate("idAccount")
        .sort({ time: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      const allProducts = mutipleMongooseToObject(product1);

      res.locals._numberOfItems = await Product.find({
        status: "Banned",
      }).countDocuments();
      res.locals._limit = limit;
      res.locals._currentPage = page;
      res.render("admin_product_banned", {
        products: allProducts,
        numOfProducts: allProducts.length,
      });
    } catch (error) {
      next(error);
    }
  };

  // [GET] reported/pending
  getPendingProduct = async (req, res, next) => {
    try {
      let page = isNaN(req.query.page)
        ? 1
        : Math.max(1, parseInt(req.query.page));

      const limit = 10;
      const product1 = await Product.find({ status: "Pending" })
        .populate("idAccount")
        .sort({ time: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      const allProducts = mutipleMongooseToObject(product1);
      res.locals._numberOfItems = await Product.find({
        status: "Pending",
      }).countDocuments();
      res.locals._limit = limit;
      res.locals._currentPage = page;
      res.render("admin_product_pending", {
        products: allProducts,
        numOfProducts: allProducts.length,
      });
    } catch (error) {
      next(error);
    }
  };

  // [GET] product/reported
  getReportedProduct = async (req, res, next) => {
    try {
      let page = isNaN(req.query.page)
        ? 1
        : Math.max(1, parseInt(req.query.page));

      const limit = 10;
      const product1 = await Product.find({ status: "Reported" })
        .populate("idAccount")
        .sort({ time: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      const allProducts = mutipleMongooseToObject(product1);
      res.locals._numberOfItems = await Product.find({
        status: "Reported",
      }).countDocuments();
      res.locals._limit = limit;
      res.locals._currentPage = page;
      res.render("admin_product_reported", {
        products: allProducts,
        numOfProducts: allProducts.length,
      });
    } catch (error) {
      next(error);
    }
  };

  // [GET] product/trending
  getTrendProduct = async (req, res, next) => {
    try {
      let page = isNaN(req.query.page)
        ? 1
        : Math.max(1, parseInt(req.query.page));

      const limit = 10;
      const product1 = await Product.find({
        $or: [{ status: "Available", isTrend: true }, { status: "Trending" }],
      })
        .populate("idAccount")
        .sort({ time: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      const allProducts = mutipleMongooseToObject(product1);
      res.locals._numberOfItems = await Product.find({
        $or: [{ status: "Available", isTrend: true }, { status: "Trending" }],
      }).countDocuments();
      res.locals._limit = limit;
      res.locals._currentPage = page;
      res.render("admin_product_trending", {
        products: allProducts,
        numOfProducts: allProducts.length,
      });
    } catch (error) {
      next(error);
    }
  };

  // [POST] account/exec-product
  executeProduct = async (req, res, next) => {
    try {
      const product = await Product.findById(req.query.id);
      const type = req.query.type;
      if (type == "ban" || type == "deny") {
        // ban unban accept deny (request) remove (reported) acptrend denytrend
        product.status = "Banned";
      } else if (type == "unban" || type == "remove" || type == "accept") {
        product.status = "Available";
      } else if (type == "acptrend") {
        product.status = "Available";
        product.isTrend = true;
      } else if (type == "denytrend") {
        product.status = "Pending";
        product.isTrend = false;
      } else {
        product.status = "Available";
      }
      await product.save();
      res.redirect("back");
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new productController();
