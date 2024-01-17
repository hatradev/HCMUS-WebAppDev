const account = require("../models/account.model");
const CustomErr = require("../helpers/custom-error");
const jwt = require("jsonwebtoken");
const balanceRouter = require("../routes/balance.route");
const paymentRouter = require("../routes/payment.route");
const userController = require("../controllers/user.controller");

function route(app) {
  // Định nghĩa các route theo tài nguyên
  app.get("/", async (req, res) => {
    let user = await account.find({});
    if (user) {
      // console.log(user);
      res.render("index");
    } else {
      console.log("fail");
    }
    // res.render("home");
  });

  app.use("/payment", paymentRouter);

  // app.get("/payment/authenticate", async (req, res, next) => {

  // });

  app.post("/signup", userController.signUp);
  // app.post("/process-payment", async (req, res, next) => {

  // });

  // app.post("/payment", async (req, res, next) => {
  // });
  // app.post("/refund", async (req, res, next) => {

  // });

  // app.get("/getPayment", async (req, res, next) => {

  // });

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
  //     } catch (error) {
  //       // Xử lý lỗi JWT hoặc lỗi khác
  //       next(error);
  //     }
  // });

  app.use("/balance", balanceRouter);

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
