const account = require("../models/account.model");
const CustomErr = require("../helpers/custom-error");

function route(app) {
  // Định nghĩa các route theo tài nguyên
  app.get("/", async (req, res) => {
    let user = await account.find({});
    if (user) {
      console.log(user);
    } else {
      console.log("fail");
    }
    res.render("home");
  });

  app.post("/signup", async (req, res, next) => {
    try {
      const responseData = { success: true };
      // Gửi phản hồi
      res.json(responseData);
    } catch (error) {
      next(error);
    }
  });

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
