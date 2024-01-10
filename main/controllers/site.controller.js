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
      res.render("home", {});
    } catch (err) {
      next(err);
    }
  };
  // getCart = async (req, res, next) => {
  //   try {
  //     res.render("cart-tmp", {});
  //   } catch (err) {
  //     next(err);
  //   }
  // };
  
  getPayForCart = async (req, res, next) => {
    try {
      // const productId = req.params.id;
      const idUser = "659e6764cf02b39d2cdb32bc";
      const accBuyer = await Account.findOne({ _id: idUser }).populate({
        path: "cart.id_product",
      });

      res.locals.accBuyer = mongooseToObject(accBuyer);

      res.render("cart");
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new siteController();
