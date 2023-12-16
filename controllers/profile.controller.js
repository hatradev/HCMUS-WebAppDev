class profileController {
  // [GET] /
  getProfile = async (req, res, next) => {
    try {
      res.render("profile", {});
    } catch (err) {
      next(err);
    }
  };
  getChangePasswordP = async (req, res, next) => {
    try {
      res.render("changePw", {});
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new profileController();
