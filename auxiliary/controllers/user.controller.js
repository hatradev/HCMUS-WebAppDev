const account = require("../models/account.model");
const jwt = require("jsonwebtoken");
// const bcrypt = require('bcrypt');

class userController {
  // [POST] /signup
  signUp = async (req, res, next) => {
    try {
      const responseData = { success: false };
      if (req.body && req.body.token) {
        const token = req.body.token;
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
        console.log(decoded);
        const newAccount = new account({
          buyid: decoded._id,
          balance: 1000000,
        });

        // Save the new account to the database
        await newAccount.save();
        responseData.success = true;
      }
      // Gửi phản hồi
      res.json(responseData);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new userController();
