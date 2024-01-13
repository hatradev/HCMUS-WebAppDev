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
      if (req.cookies && req.cookies.obj) {
        user = req.cookies.obj.user;
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
      const idUser = "659f66740be458c494290c39";
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
      let user = req.cookies.obj.user;
      // console.log(user);
      const idUser = "659f66740be458c494290c39";
      const accBuyer = await Account.findOne({ _id: idUser }).populate({
        path: "cart.id_product",
      });

      res.locals.accBuyer = mongooseToObject(accBuyer);

      res.render("payment");
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
