const hbs = require("express-handlebars");
const Order = require("../models/order.model");
const Account = require("../models/account.model");
const Product = require("../models/product.model");

const sequelize = require("sequelize");
const Op = sequelize.Op;

const {
  mutipleMongooseToObject,
  mongooseToObject,
} = require("../utils/mongoose");
const Category = require("../models/category.model");

class siteController {
  // [GET] /
  getHome = async (req, res, next) => {
    // console.log(req.cookies.user);
    try {
      // Lấy 8 sản phẩm mới nhất
      let latestProducts = await Product.find().sort({ _id: -1 }).limit(8);

      latestProducts = latestProducts.map((product) => {
        product.pid = product._id;
        product.title = product.name;
        product.p = product.price;
        product.img = product.image[0];
        return product;
      });

      // Lấy 4 sản phẩm đầu tiên
      let firstProducts = await Product.find().limit(4);

      firstProducts = firstProducts.map((product) => {
        product.pid = product._id;
        product.title = product.name;
        product.p = product.price;
        product.img = product.image[0];
        return product;
      });
      res.render("home", { latestProducts, firstProducts });
    } catch (err) {
      next(err);
    }
  };

  getPayForCart = async (req, res, next) => {
    try {
      // const productId = req.params.id;
      // const idUser = "659f8a8c0be458c494290c40";
      const idUser = req.cookies.user._id.toString();
      const accBuyer = await Account.findOne({ _id: idUser }).populate({
        path: "cart.id_product",
      });

      res.locals.accBuyer = mongooseToObject(accBuyer);

      res.render("cart");
    } catch (error) {
      next(error);
    }
  };
  getPayment = async (req, res, next) => {
    try {
      // console.log(req.session.passport);
      // const productId = req.params.id;
      let user = req.cookies.user;
      // console.log(user);
      // const idUser = "659f8a8c0be458c494290c40";
      const idUser = user._id.toString();
      const accBuyer = await Account.findOne({ _id: idUser }).populate({
        path: "cart.id_product",
      });

      const admin = await Account.findOne({ role: "admin" });

      res.locals.accBuyer = mongooseToObject(accBuyer);

      res.render("payment", {idAd: admin._id});
      // res.render("paymentBuyNow");
    } catch (error) {
      next(error);
    }
  };
  // getPaymentBuyNow = async (req, res, next) => {
  //   try {
  //     // const productId = req.params.id;
  //     const idUser = "659f8a8c0be458c494290c40";
  //     const { productId, quantity } = req.body;
  //     const accBuyer = await Account.findOne({ _id: idUser });
  //     const product = await Product.findOne({ _id: productId });

  //     res.locals.accBuyer = mongooseToObject(accBuyer);
  //     res.locals.product = mongooseToObject(product);
  //     res.locals.quantity = quantity;

  //     res.render("paymentBuyNow");
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  getPaymentBuyNow = async (req, res, next) => {
    try {
      // const idUser = "659f8a8c0be458c494290c40";
      const idUser = req.cookies.user._id.toString();
      const productId = req.query.productId;
      const quantity = req.query.quantity;
      const accBuyer = await Account.findOne({ _id: idUser });
      const product = await Product.findOne({ _id: productId });
      const admin = await Account.findOne({ role: "admin" });

      // console.log(idUser, productId, quantity, accBuyer, product);

      res.locals.accBuyer = mongooseToObject(accBuyer);
      res.locals.product = mongooseToObject(product);
      res.locals.quantity = quantity;

      res.render("paymentBuyNow", {idAd: admin._id});
    } catch (error) {
      next(error);
    }
  };
  getDashboard = async (req, res, next) => {
    try {
      const today = new Date();
      const utcToday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
      const firstDayOfMonth = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1));
      const firstDayOfYear = new Date(Date.UTC(today.getFullYear(), 0, 1));
      
      // console.log(utcToday.toISOString(), firstDayOfMonth.toISOString(), firstDayOfYear.toISOString());      
    
       // Log successful orders this month
      // const successfulOrdersThisMonth = await Order.find({
      //   status: 'successful', 
      //   date: { $gte: firstDayOfMonth }
      // });
      // console.log('Successful Orders This Month:', successfulOrdersThisMonth[0].detail);

      // Log successful orders this year
      // const successfulOrdersThisYear = await Order.find({
      //   status: 'successful', 
      //   date: { $gte: firstDayOfYear }
      // });
      // console.log('Successful Orders This Year:', successfulOrdersThisYear);

      // Calculate monthRevenue
      const monthRevenue = await Order.aggregate([
        { $match: { status: 'successful', date: { $gte: firstDayOfMonth } } },
        { $unwind: '$detail' },
        { $lookup: {
            from: 'products', // the collection name in MongoDB for products
            localField: 'detail.idProduct',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        { $unwind: '$productDetails' },
        { $group: {
            _id: null,
            total: { $sum: { $multiply: ['$productDetails.price', '$detail.quantity'] } }
          }
        }
      ]);
    
      // Calculate yearRevenue
      const yearRevenue = await Order.aggregate([
        { $match: { status: 'successful', date: { $gte: firstDayOfYear } } },
        { $unwind: '$detail' },
        { $lookup: {
            from: 'products', // The collection name in MongoDB for products
            localField: 'detail.idProduct',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        { $unwind: '$productDetails' },
        { $group: {
            _id: null,
            total: { $sum: { $multiply: ['$productDetails.price', '$detail.quantity'] } }
          }
        }
      ]);
    
      // Calculate successRate
      const totalCount = await Order.countDocuments();
      const successfulCount = await Order.countDocuments({ status: 'successful' });
      const successRate = Math.ceil(successfulCount / totalCount * 100);
    
      // Calculate noPendingOrder
      const noPendingOrder = await Order.countDocuments({ status: 'pending' });

      res.render("dashboard", { 
        nshowHF: true,
        monthRevenue: monthRevenue[0]?.total || 0,
        yearRevenue: yearRevenue[0]?.total || 0,
        successRate,
        noPendingOrder
      });
    } catch (error) {
      next(error);
    }
  };
  getAuthSystem = async (req, res, next) => {
    // console.log(`https://${process.env.HOST}:${process.env.AUX_PORT}/`);
    res.redirect(`https://${process.env.HOST}:${process.env.AUX_PORT}`);
  };
}

module.exports = new siteController();
