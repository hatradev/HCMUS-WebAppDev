const account = require("../models/account.model");
const CustomErr = require("../helpers/custom-error");
const jwt = require("jsonwebtoken");
const balanceRouter = require("../routes/balance.route");
const userController = require("../controllers/user.controller");

function route(app) {
  // Định nghĩa các route theo tài nguyên
  app.use("/balance", balanceRouter);
  // app.get("/", async (req, res) => {
  //   let user = await account.find({});
  //   if (user) {
  //     // console.log(user);;
  //     // console.log("success");
  //     res.redirect('/balance')
  //   } else {
  //     console.log("fail");
  //   }
  //   // res.render("home");
  // });

  app.get("/payment/authenticate", async (req, res, next) => {
    try {
      console.log("check query");
      console.log(req.query.idaccount);
      console.log("end check query");
      res.render("authenticationPage", {
        accountID: req.query.idaccount,
        totalPrice: req.query.total,
        idOrder: req.query.idorder,
      }); // Giả sử 'paymentPage' là tên template
    } catch (error) {
      res.status(500).send("Lỗi xử lý trang");
    }
  });
  app.get("/order/invalidPW", async (req, res, next) => {
    try {
      res.render("invalidPW", { idOrder: req.query.id }); // Giả sử 'paymentPage' là tên template
    } catch (error) {
      res.status(500).send("Lỗi xử lý trang");
    }
  });
  app.get("/order/inValidBalance", async (req, res, next) => {
    try {
      res.render("invalidPW", { idOrder: req.query.id }); // Giả sử 'paymentPage' là tên template
    } catch (error) {
      res.status(500).send("Lỗi xử lý trang");
    }
  });

  app.post("/signup", userController.signUp);
  app.post("/process-payment", async (req, res, next) => {
    try {
      const total = req.body.total; // Lấy tổng tiền từ form
      const password = req.body.password; // Lấy mật khẩu từ form
      const idAcc = req.body.accountID; // Lấy mật khẩu từ form
      const idOrder = req.body.orderID; // Lấy mật khẩu từ form
      // const user = await account.findById(idAcc);
      console.log(idAcc);
      const user = await account.findOne({ buyid: idAcc });
      console.log("check balance");
      console.log(user);
      console.log("end check balance");
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
        `http://127.0.0.1:${process.env.MAIN_PORT}/user/authenticate`,
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
        await user.save();
        const r = await fetch(
          `http://127.0.0.1:${process.env.MAIN_PORT}/user/paymentSuccess`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: accessToken }),
          }
        );
        const response2 = await r.json();
        // res.redirect(`http://127.0.0.1:${process.env.MAIN_PORT}/order/index`);
        // res.json(response2);
        res.redirect(
          `http://127.0.0.1:${
            process.env.MAIN_PORT
          }/order/detail?id=${encodeURIComponent(idOrder)}`
        );
      } else if (!response.validPw) {
        res.redirect(
          `http://127.0.0.1:${
            process.env.MAIN_PORT
          }/order/detail?id=${encodeURIComponent(
            idOrder
          )}&err=${encodeURIComponent("wrong-password")}`
        );
      } else {
        // res.redirect(`/order/inValidBalance?id=${encodeURIComponent(idOrder)}`);
        res.redirect(
          `http://127.0.0.1:${
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
  });

  app.post("/payment", async (req, res, next) => {
    try {
      // Giải mã JWT
      const token = req.body.token;
      if (!token) {
        return { error: "POST No token provided" };
      } else {
        res.redirect(`/getPayment?token=${encodeURIComponent(token)}`);
        // const redirectUrl = `https://localhost:1234/getPayment?token=${encodeURIComponent(token)}`;
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
      // res.redirect('https://localhost:1234/getPayment');
    } catch (error) {
      // Xử lý lỗi JWT hoặc lỗi khác
      next(error);
    }
  });
  app.post("/refund", async (req, res, next) => {
    try {
      // Giải mã JWT
      const token = req.body.token;
      if (!token) {
        return res.status(400).json({ error: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
      // const user = await User.findById(decoded.idAccount);
      // const user = await account.findById(decoded.order.idaccount);
      const user = await account.findOne({ buyid: decoded.order.idaccount });
      // const validPassword = await bcrypt.compare(decoded.pw, user.password);
      const responseData = { success: "successfully", acc: user };
      // Xóa giỏ hàng sau khi tạo đơn hàng
      user.balance = user.balance + decoded.totalPrice;
      await user.save();

      res.json(responseData);
    } catch (error) {
      // Xử lý lỗi JWT hoặc lỗi khác
      next(error);
    }
  });

  app.get("/getPayment", async (req, res, next) => {
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
        });
      } else {
        res.send("BUG");
      }
    } catch (error) {
      // Xử lý lỗi giải mã JWT hoặc lỗi khác
      next(error);
    }
  });

  // app.get("/getPayment", async (req, res, next) => {
  //     try {
  //       console.log("Received query data: ", req.query);
  //       if (!req.query) {
  //         return res.status(400).json({ error: "No data provided" });
  //     }

  //     // Phân tích dữ liệu JSON
  //     const parsedData = JSON.parse(decodeURIComponent(req.query.data));
  //     if (!parsedData.token) {
  //         return res.status(400).json({ error: "Token not found in data" });
  //     }

  //     const decoded = jwt.verify(parsedData.token, process.env.JWT_ACCESS_KEY);

  //       const responseData = { success: "successfully sending order", orderData: decoded };
  //       // Gửi phản hồi
  //       console.log("check AUX last");
  //       console.log(decoded);
  //       console.log("end check AUX last");
  //       res.render("payment");
  //       // res.json(responseData);
  //       // res.redirect('https://localhost:1234/getPayment');
  //     } catch (error) {
  //       // Xử lý lỗi JWT hoặc lỗi khác
  //       next(error);
  //     }
  // });

  // Hai middlewares này phải để cuối để check lỗi
  app.use((req, res, next) => {
    res.status(404).render("error", {
      code: 404,
      msg: "Page not found",
      description: "The page you're looking for doesn't exist",
      nshowHF: true,
    });
  });
  app.use((error, req, res, next) => {
    const statusCode = error instanceof CustomErr ? error.statusCode : 500;
    res.status(statusCode).render("error", {
      code: statusCode,
      msg: "Server error",
      description: error.message,
      nshowHF: true,
    });
  });
}

module.exports = route;
