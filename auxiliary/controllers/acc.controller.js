class accController {
  // [GET] /
  displaySignInP = async (req, res, next) => {
    try {
      res.render("signIn", {});
    } catch (err) {
      next(err);
    }
  };
  displaySignUpP = async (req, res, next) => {
    try {
      res.render("signUp", {});
    } catch (err) {
      next(err);
    }
  };
  getProfile = async (req, res, next) => {
    try {
      res.render("profile", {});
    } catch (err) {
      next(err);
    }
  };
  getOrderHistory = async (req, res, next) => {
    try {
      res.render("orderHistory", {});
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new accController();
