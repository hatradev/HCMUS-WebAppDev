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
      const accBuyer = await Account.findOne({
        _id: req.cookies.user._id,
      }).populate("cart.id_product");

      let totalAmount = 0;
      accBuyer.cart.forEach((cartItem) => {
        totalAmount += cartItem.quantity * cartItem.id_product.price; // Giả sử mỗi item có 'price'
      });

      // Tạo một mảng chi tiết đơn hàng từ giỏ hàng
      const orderDetails = accBuyer.cart.map((cartItem) => ({
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
          idAdmin: req.body.idAdmin,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "10m" }
      );

      // await fetch(
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
      const responseUrl = `https://${process.env.HOST}:${
        process.env.AUX_PORT
      }/payment/getPayment?token=${encodeURIComponent(accessToken)}`;

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
  ContinueToPay = async (req, res, next) => {
    try {
      const id = req.body.orderId;
      // const order = await Order.findById(id)
      const orderFound = await Order.findById(id).populate("detail.idProduct");
      const admin = await Account.findOne({ role: "admin" });
      let totalAmount = 0;
      orderFound.detail.forEach((cartItem) => {
        totalAmount += cartItem.quantity * cartItem.idProduct.price; // Giả sử mỗi item có 'price'
      });

      const accessToken = jwt.sign(
        {
          order: orderFound,
          totalPrice: totalAmount,
          idAdmin: admin._id,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "10m" }
      );

      // await fetch(
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
      const responseUrl = `https://${process.env.HOST}:${
        process.env.AUX_PORT
      }/payment/getPayment?token=${encodeURIComponent(accessToken)}`;
      // console.log("Response URL:", responseUrl);
      // const response = await fetch(responseUrl);
      // const responseData = await response.json();
      // const response = await rs.json();

      // console.log("RESPONSE: ", responseData);
      // Lưu đơn hàng mới
      // const savedOrder = await newOrder.save();

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
  cancelOrder = async (req, res, next) => {
    try {
      const id = req.body.orderId;
      const total = req.body.totalPrice;
      // const order = await Order.findById(id)
      const orderFound = await Order.findById(id).populate("detail.idProduct");
      const admin = await Account.findOne({ role: "admin" });
      let totalAmount = 0;
      orderFound.detail.forEach((cartItem) => {
        totalAmount += cartItem.quantity * cartItem.idProduct.price; // Giả sử mỗi item có 'price'
      });

      const accessToken = jwt.sign(
        {
          order: orderFound,
          totalPrice: totalAmount,
          idAdmin: admin._id,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "10m" }
      );

      // const tokenString = JSON.stringify({ token: accessToken });

      const rs = await fetch(
        `https://${process.env.HOST}:${process.env.AUX_PORT}/payment/refund`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: accessToken }),
        }
      );

      console.log("Waiting response!!");

      const response = await rs.json();

      // console.log("RESPONSE: ", response);
      // await Order.deleteOne({ _id: id });
      // orderFound.status = "cancelled";
      orderFound.status = "cancelled";
      await orderFound.save();

      return res.redirect(`/order/index`);
    } catch (error) {
      next(error);
    }
  };
  CreateOrderForBuyNowAndSendToken = async (req, res, next) => {
    try {
      const accBuyer = await Account.findOne({ _id: req.cookies.user._id });

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

      const orderDetails = [
        {
          idProduct: id,
          quantity: quantityDATA,
        },
      ];

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
          idAdmin: req.body.idAdmin,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "10m" }
      );

      const tokenString = JSON.stringify({ token: accessToken });
      const responseUrl = `https://${process.env.HOST}:${
        process.env.AUX_PORT
      }/payment/getPayment?token=${encodeURIComponent(accessToken)}`;

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
      let { filter } = req.query;
      if (!filter) filter = "";
      let orders;
      if (filter == "far")
        orders = await Order.find({ idaccount: user._id }).sort({ date: 1 });
      else if (filter == "near")
        orders = await Order.find({ idaccount: user._id }).sort({ date: -1 });
      else if (filter != "")
        orders = await Order.find({ idaccount: user._id, status: filter }).sort(
          { date: -1 }
        );
      else {
        orders = await Order.find({ idaccount: user._id });
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
        avatar: user.avatar,
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
      let error = "none";
      if (req.query.err) {
        error = req.query.err;
      }
      // let error = parseInt(req.body.err, 10);
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
        avatar: req.cookies.user.avatar,
        err: error,
      });
    } catch (err) {
      next(err);
    }
  };

  getHandle = async (req, res, next) => {
    try {
      const ordersWithDetails = await Order.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "detail.idProduct",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $unwind: "$detail",
        },
        {
          $unwind: "$productDetails",
        },
        {
          $project: {
            _id: 1,
            idaccount: 1,
            name: 1,
            phone: 1,
            email: 1,
            address: 1,
            message: 1,
            status: 1,
            date: 1,
            reason: 1,
            cancelledDate: 1,
            paymentDate: 1,
            productName: "$productDetails.name",
            productPrice: "$productDetails.price",
            quantity: "$detail.quantity",
          },
        },
        {
          $addFields: {
            totalPrice: { $multiply: ["$productPrice", "$quantity"] },
          },
        },
        {
          $group: {
            _id: "$_id",
            idaccount: { $first: "$idaccount" },
            name: { $first: "$name" },
            phone: { $first: "$phone" },
            email: { $first: "$email" },
            address: { $first: "$address" },
            message: { $first: "$message" },
            status: { $first: "$status" },
            date: { $first: "$date" },
            reason: { $first: "$reason" },
            cancelledDate: { $first: "$cancelledDate" },
            paymentDate: { $first: "$paymentDate" },
            productDetails: {
              $push: {
                name: "$productName",
                price: "$productPrice",
                quantity: "$quantity",
              },
            },
            totalPrice: { $sum: "$totalPrice" },
          },
        },
        {
          $sort: { date: -1 },
        },
      ]);
      ordersWithDetails.map(async (order) => {
        if (order.status === "cancelled") {
          order.status = "Đã bị hủy";
        } else if (order.status === "pending") {
          order.status = "Chờ xử lý";
        } else if (order.status === "paying") {
          order.status = "Chờ thanh toán";
        } else {
          order.status = "Thành công";
        }
        var name = "";
        var price = "";
        var quantity = "";
        var sum = "";
        for (var idx = 0; idx < order.productDetails.length; idx++) {
          name +=
            idx === 0
              ? order.productDetails[idx].name
              : ";;" + order.productDetails[idx].name;
          price +=
            idx === 0
              ? order.productDetails[idx].price.toString()
              : ";;" + order.productDetails[idx].price.toString();
          quantity +=
            idx === 0
              ? order.productDetails[idx].quantity.toString()
              : ";;" + order.productDetails[idx].quantity.toString();
          var times =
            order.productDetails[idx].price *
            order.productDetails[idx].quantity;
          sum += idx === 0 ? times.toString() : ";;" + times.toString();
        }

        order.on = name;
        order.pr = price;
        order.qt = quantity;
        order.sum = sum;
        return order;
      });
      // console.log(ordersWithDetails[0].productDetails);
      res.render("orderhandle", { nshowHF: true, ordersWithDetails });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new orderController();
