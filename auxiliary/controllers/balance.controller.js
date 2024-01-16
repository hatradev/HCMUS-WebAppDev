const  Acc = require("../models/account.model");
// const bcrypt = require('bcrypt');

class balanceControllers {
  // [GET] /
  getBalanceP = async (req, res, next) => {
    try {
    //   const user = await User.findById(req.cookies.user._id) ;
      res.render("balance", {
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new balanceControllers();
