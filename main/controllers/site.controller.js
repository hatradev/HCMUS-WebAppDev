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

class siteController {
  // [GET] /
  getHome = async (req, res, next) => {
    try {
      let user = undefined;
      if (req.cookies && req.cookies.user) {
        user = req.cookies.user;
      }
      // console.log(user);
      res.render("home", {});
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
      console.log(user);
      // const idUser = "659f8a8c0be458c494290c40";
      const idUser = user._id.toString();
      const accBuyer = await Account.findOne({ _id: idUser }).populate({
        path: "cart.id_product",
      });

      res.locals.accBuyer = mongooseToObject(accBuyer);

      res.render("payment");
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

      // console.log(idUser, productId, quantity, accBuyer, product);

      res.locals.accBuyer = mongooseToObject(accBuyer);
      res.locals.product = mongooseToObject(product);
      res.locals.quantity = quantity;

      res.render("paymentBuyNow");
    } catch (error) {
      next(error);
    }
  };
  getDashboard = async (req, res, next) => {
    try {
      res.render("dashboard", { nshowHF: true });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new siteController();
