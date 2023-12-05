class siteController {
  // [GET] /
  getHome = async (req, res, next) => {
    try {
      res.render("home", {});
    } catch (err) {
      next(err);
    }
  };
  getCart = async (req, res, next) => {
    try {
      res.render("cart", {});
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new siteController();
