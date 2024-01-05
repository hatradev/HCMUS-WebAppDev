class userController {
  // [GET] /
  getSignInP = async (req, res, next) => {
    try {
      res.render("signIn", {});
    } catch (err) {
      next(err);
    }
  };
  getSignUpP = async (req, res, next) => {
    try {
      res.render("signUp", {});
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new userController();
