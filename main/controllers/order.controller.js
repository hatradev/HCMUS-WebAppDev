const { request } = require("express");
const Order = require("../models/order.model");
const Product = require("../models/product.model");

class orderController {
  totalPrice = async (arr) => {
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
      let item = await Product.findOne({ _id: arr[i].idProduct });
      total += item.price * arr[i].quantity;
    }
    return total;
  };

  // [GET]
  getOrderHistory = async (req, res, next) => {
    try {
      const user = req.cookies.user;
      let { filter } = req.query;
      if (!filter) filter = "";
      let orders;
      if (filter == "far")
        orders = await Order.find({ idaccount: user._id }).sort({ date: 1 });
      else if (filter == "near")
        orders = await Order.find({ idaccount: user._id }).sort({ date: -1 });
      else if (filter != "")
        orders = await Order.find({ idaccount: user._id, status: filter }).sort({ date: -1 });
      else{
        orders = await Order.find({ idaccount: user._id})
      }
      const arr = [];
      for (let i = 0; i < orders.length; i++) {
        let obj = {
          _id: orders[i]._id,
          date: orders[i].date,
          total: await this.totalPrice(orders[i].detail),
          status: orders[i].status,
        };
        arr.push(obj);
      }
      res.render("orderHistory", {
        firstname: user.firstname,
        lastname: user.lastname,
        orders: arr,
        filter,
      });
    } catch (err) {
      next(err);
    }
  };

  getOrderDetail = async (req, res, next) => {
    try {
      const orderId = req.query.id;
      const order = await Order.findById(orderId);
      const obj = {
        _id: order._id,
        total: 0,
        date: order.date,
        status: order.status,
        message: order.message,
        reason: order.reason,
        cancelledDate: order.cancelledDate,
        paymentDate: order.paymentDate,
      };
      const prds = [];
      for (let i = 0; i < order.detail.length; i++) {
        const item = await Product.findById(order.detail[i].idProduct);
        const prd = {
          _id: item._id,
          name: item.name,
          discription: item.discription,
          image: item.image[0],
          price: item.price,
          quantity: order.detail[i].quantity,
        };
        (prd.total = prd.price * prd.quantity), (obj.total += prd.total);
        prds.push(prd);
      }
      res.render("orderDetail", {
        obj,
        prds,
        lastname: req.cookies.user.lastname,
        firstname: req.cookies.user.firstname,
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new orderController();
