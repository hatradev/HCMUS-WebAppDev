const siteRouter = require("./site.route");
const userRouter = require("./user.route");
const profileRouter = require("./profile.route");
const orderRouter = require("./order.route");
const productRouter = require("./product.route");

function route(app) {
  // Định nghĩa các route theo tài nguyên
  app.use("/", siteRouter);
  app.use("/user", userRouter);
  app.use("/profile", profileRouter);
  app.use("/order", orderRouter);
  app.use("/product", productRouter);

  // Hai middlewares này phải để cuối để check lỗi
  app.use((req, res, next) => {
    res.status(404).render("error", {
      message: "File not Found",
    });
  });
  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).render("error", {
      message: "Internal Server Error!",
    });
  });
}

module.exports = route;
