const siteRouter = require("./site.route");
const userRouter = require("./user.route");
const profileRouter = require("./profile.route");
const orderRouter = require("./order.route");
const productRouter = require("./product.route");
const CustomErr = require("../helpers/custom-error");
const authRoutes = require("./auth.route");
const productController = require("../controllers/product.controller");

function route(app) {
  const categoryTreeMiddleware = async (req, res, next) => {
    res.locals.categoryTree = await productController.getCategoryTree();
    next();
  };
  app.use(categoryTreeMiddleware);

  // Định nghĩa các route theo tài nguyên
  app.use("/", siteRouter);
  app.use("/user", userRouter);
  app.use("/profile", profileRouter);
  app.use("/order", orderRouter);
  app.use("/product", productRouter);
  app.use("/auth", authRoutes);

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
