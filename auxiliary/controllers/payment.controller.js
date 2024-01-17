const account = require("../models/account.model");
const Hist = require("../models/history.model");
const jwt = require("jsonwebtoken");

// const bcrypt = require('bcrypt');

class paymentControllers {
  // [GET] /
  getPayment = async (req, res, next) => {
    try {
      // console.log("QUERY: ", req.query);
      // console.log("BODY: ", req);
      // res.send("error");
      if (JSON.stringify(req.query) !== "{}") {
        // console.log(req.isAuthenticated())
        // Lấy token từ query string
        console.log("Check received query data last: ", req.query);
        const token = req.query.token;
        console.log(token);
        console.log("NOT TOKEN");
        console.log(!token);

        if (!token) {
          console.log(1);
          return res.status(400).json({ error: "No token provided" });
        }

        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
        console.log("check AUX last");
        console.log(decoded);
        console.log("end check AUX last");

        res.render("payment", {
          order: decoded.order,
          totalPrice: decoded.totalPrice,
          idAd: decoded.idAdmin,
        });
      } else {
        res.send("BUG");
      }
    } catch (error) {
      // Xử lý lỗi giải mã JWT hoặc lỗi khác
      next(error);
    }
  };
  postPayment = async (req, res, next) => {
    try {
      // Giải mã JWT
      const token = req.body.token;
      if (!token) {
        return { error: "POST No token provided" };
      } else {
        res.redirect(`/getPayment?token=${encodeURIComponent(token)}`);

        // // res.redirect(redirectUrl);
        // fetch(redirectUrl).then(response => {
        //   if (!response.ok) {
        //     throw new Error('Network response was not ok');
        //   }
        //   return response.json();
        // })
        // .then(data => {
        //   console.log(data);
        // })
        // .catch(error => {
        //   console.error('There has been a problem with your fetch operation:', error);
        // });
      }

      // const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
      // const responseData = { success: "successfully sending order", orderData: decoded };
      // Gửi phản hồi
      // res.json(responseData);
    } catch (error) {
      // Xử lý lỗi JWT hoặc lỗi khác
      next(error);
    }
  };
  paymentAuthenticate = async (req, res, next) => {
    try {
      console.log("check query");
      console.log(req.query.idaccount);
      console.log("end check query");
      res.render("authenticationPage", {
        accountID: req.query.idaccount,
        totalPrice: req.query.total,
        idOrder: req.query.idorder,
        idAdmin: req.query.idadmin,
      }); // Giả sử 'paymentPage' là tên template
    } catch (error) {
      res.status(500).send("Lỗi xử lý trang");
    }
  };
  paymentRefund = async (req, res, next) => {
    try {
      // Giải mã JWT
      const token = req.body.token;
      if (!token) {
        return res.status(400).json({ error: "No token provided" });
      }

      console.log("Do refund");
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
      // const user = await User.findById(decoded.idAccount);
      // const user = await account.findById(decoded.order.idaccount);
      const user = await account.findOne({ buyid: decoded.order.idaccount });
      const admin = await account.findOne({ buyid: decoded.idAdmin });
      // const validPassword = await bcrypt.compare(decoded.pw, user.password);
      const responseData = { success: "successfully", acc: user };
      // Xóa giỏ hàng sau khi tạo đơn hàng
      user.balance = user.balance + decoded.totalPrice;
      admin.balance = admin.balance - decoded.totalPrice;
      await user.save();
      await admin.save();

      res.json(responseData);
    } catch (error) {
      // Xử lý lỗi JWT hoặc lỗi khác
      next(error);
    }
  };
  paymentProcess = async (req, res, next) => {
    try {
      const total = req.body.total; // Lấy tổng tiền từ form
      const password = req.body.password; // Lấy mật khẩu từ form
      const idAcc = req.body.accountID; // Lấy mật khẩu từ form
      const idOrder = req.body.orderID; // Lấy mật khẩu từ form
      const idAdmin = req.body.idAdmin; // Lấy mật khẩu từ form
      // const user = await account.findById(idAcc);
      console.log(idAcc);
      const user = await account.findOne({ buyid: idAcc });
      const admin = await account.findOne({ buyid: idAdmin });
      console.log("check balance type");
      console.log(typeof admin.balance);
      console.log("end check balance type");
      const accessToken = jwt.sign(
        {
          pw: password,
          idAccount: idAcc,
          totalPrice: total,
          idorder: idOrder,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "10m" }
      );

      const rs = await fetch(
        `http://${process.env.HOST}:${process.env.MAIN_PORT}/user/authenticate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: accessToken }),
        }
      );
      const response = await rs.json();

      console.log("RESPONSE: ", response);
      if (response.validPw && user.balance >= total) {
        user.balance = user.balance - total;
        admin.balance = Number(admin.balance) + Number(total);
        await user.save();
        await admin.save();

        console.log("check balance admin");
        console.log(typeof total);
        console.log("end check balance admin");
        console.log("check balance user");
        console.log(user);
        console.log("end check balance user");
        const r = await fetch(
          `http://${process.env.HOST}:${process.env.MAIN_PORT}/user/paymentSuccess`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: accessToken }),
          }
        );
        const response2 = await r.json();
        // res.json(response2);
        res.redirect(
          `http://${process.env.HOST}:${
            process.env.MAIN_PORT
          }/order/detail?id=${encodeURIComponent(
            idOrder
          )}&err=${encodeURIComponent("none-err")}`
        );
      } else if (!response.validPw) {
        res.redirect(
          `http://${process.env.HOST}:${
            process.env.MAIN_PORT
          }/order/detail?id=${encodeURIComponent(
            idOrder
          )}&err=${encodeURIComponent("wrong-password")}`
        );
      } else {
        // res.redirect(`/order/inValidBalance?id=${encodeURIComponent(idOrder)}`);
        res.redirect(
          `http://${process.env.HOST}:${
            process.env.MAIN_PORT
          }/order/detail?id=${encodeURIComponent(
            idOrder
          )}&err=${encodeURIComponent("not-enough-money")}`
        );
      }

      // res.json(response);
      // res.render(response)
      // res.json(response);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new paymentControllers();
