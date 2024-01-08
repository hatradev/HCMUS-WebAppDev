class orderController {
  // [GET] /
  getOrderHistory = async (req, res, next) => {
    try {
      res.render("orderHistory", {});
    } catch (err) {
      next(err);
    }
  };
  getOrderDetail = async (req, res, next) => {
    try {
      res.render("orderDetail", {});
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new orderController();
