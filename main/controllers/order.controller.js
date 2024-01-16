const { request } = require("express");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Account = require("../models/account.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();



class orderController {

  CreateOrderForCartAndSendToken = async (req, res, next) => {
    try {
      const accBuyer = await Account.findOne({ _id: req.cookies.user._id })
        .populate("cart.id_product");
      
      let totalAmount = 0;
      accBuyer.cart.forEach(cartItem => {
          totalAmount += cartItem.quantity * cartItem.id_product.price; // Giả sử mỗi item có 'price'
      });
  
      // Tạo một mảng chi tiết đơn hàng từ giỏ hàng
      const orderDetails = accBuyer.cart.map(cartItem => ({
        idProduct: cartItem.id_product._id,
        quantity: cartItem.quantity,
      }));
  
      // Tạo một đơn đặt hàng mới với tất cả các mặt hàng trong giỏ
      const newOrder = new Order({
        idaccount: accBuyer._id,
        name: accBuyer.lastname,
        phone: accBuyer.phone,
        email: accBuyer.email,
        address: accBuyer.address,
        detail: orderDetails,
        status: "paying",
        // message: req.body.message, // Lấy từ form đầu vào
      });
  
      const accessToken = jwt.sign(
        {
          order: newOrder,
          totalPrice: totalAmount,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "10m" }
      );

      // await fetch(
      //   `https://localhost:${process.env.AUX_PORT}/payment`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ token: accessToken }),
      //   }
      // );
      // if (!accessToken) {
      //   return res.status(500).json({ error: "Failed to create access token" });
      // }
      const tokenString = JSON.stringify({ token: accessToken });
      const responseUrl = `https://localhost:${process.env.AUX_PORT}/getPayment?token=${encodeURIComponent(accessToken)}`;
      // // const responseUrl = `https://localhost:${process.env.AUX_PORT}/getPayment?data=${tokenString}`;
      // // const responseUrl = `https://localhost:${process.env.AUX_PORT}/getPayment?token=${encodeURIComponent(accessToken)}`;
      // console.log("Response URL:", responseUrl);
      // const response = await fetch(responseUrl);
      // const responseData = await response.json();
      // const response = await rs.json();

      // console.log("RESPONSE: ", responseData);
      // Lưu đơn hàng mới
      const savedOrder = await newOrder.save();
  
      // Xóa giỏ hàng sau khi tạo đơn hàng
      // accBuyer.cart = [];
      // await accBuyer.save();
      // console.log("check cart user");
      // // console.log(accBuyer.cart);
      // console.log("end check cart user");
      return res.redirect(responseUrl);
    } catch (error) {
      next(error);
    }
  };
  CreateOrderForBuyNowAndSendToken = async (req, res, next) => {
    try {
      const accBuyer = await Account.findOne({ _id: req.cookies.user._id })
      
      // let totalAmount = req.body.total;
      let totalAmount = parseInt(req.body.total, 10);
      let id = req.body.productID; // ID của sản phẩm
      let quantityDATA = parseInt(req.body.quantity, 10); // Số lượng sản phẩm

      console.log("check body buynow");
      console.log(req.body);
      console.log("end check body buynow");
  
      // Tạo một mảng chi tiết đơn hàng từ giỏ hàng
      // const orderDetails = accBuyer.cart.map(cartItem => ({
      //   idProduct: cartItem.id_product._id,
      //   quantity: cartItem.quantity,
      // }));

      const orderDetails = [{
        idProduct: id,
        quantity: quantityDATA,
      }];

  
      // Tạo một đơn đặt hàng mới với tất cả các mặt hàng trong giỏ
      const newOrder = new Order({
        idaccount: accBuyer._id,
        name: accBuyer.lastname,
        phone: accBuyer.phone,
        email: accBuyer.email,
        address: accBuyer.address,
        detail: orderDetails,
        status: "paying",
        // message: req.body.message, // Lấy từ form đầu vào
      });
  
      const accessToken = jwt.sign(
        {
          order: newOrder,
          totalPrice: totalAmount,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "10m" }
      );

      const tokenString = JSON.stringify({ token: accessToken });
      const responseUrl = `https://localhost:${process.env.AUX_PORT}/getPayment?token=${encodeURIComponent(accessToken)}`;

      // Lưu đơn hàng mới
      const savedOrder = await newOrder.save();

      return res.redirect(responseUrl);
    } catch (error) {
      next(error);
    }
  };

  // authenticatePassword = async (req, res, next) => {
  //   try {
  //     // Giải mã JWT
  //     const token = req.body.token;
  //     if (!token) {
  //       return res.status(400).json({ error: "No token provided" });
  //     }

  //     const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
  //     // Xử lý dữ liệu đơn hàng từ JWT
  //     // Ví dụ: Lưu đơn hàng vào cơ sở dữ liệu
  //     const responseData = { success: "successfully sending order", orderData: decoded };
  //     // const user = await User.findOne({ email: inputEmail });
  //     // const accountId = req.cookies.user._id.toString();
  //     // console.log("check id sent to MAIN");
  //     // console.log(req.cookies.user._id.toString());
  //     // console.log("end check id sent to MAIN");
  //     // // Tìm tài khoản người dùng
  //     // const user = await User.findById(accountId);
  //     // const validPassword = await bcrypt.compare(decoded.pw, user.password);
  //     // console.log("check PW-valid sent to MAIN");
  //     // console.log(validPassword);
  //     // console.log("end check PW-valid sent to MAIN");
  //     // if (validPassword) {
  //     // }
  //     // Gửi phản hồi
  //     res.json(responseData);
  //   } catch (error) {
  //     // Xử lý lỗi JWT hoặc lỗi khác
  //     next(error);
  //   }
  // };
  

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
      const orders = await Order.find({ idaccount: user._id });
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
      });
    } catch (err) {
      next(err);
    }
  };

  getOrderDetail = async (req, res, next) => {
    try {
      const orderId = req.query.id;
      // const error = req.query.err;
      let error = parseInt(req.body.err, 10);
      const order = await Order.findById(orderId);
      const obj = {
        _id: order._id,
        total: 0,
        date: order.date,
        status: order.status,
        message: order.message,
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
        err: error,
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new orderController();
