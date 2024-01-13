const User = require("../models/account.model");
const userController = require("../controllers/user.controller");
const bcrypt = require('bcrypt');

class profileController {
  // [GET] /
  getProfile = async (req, res, next) => {
    try {
      // console.log(req.cookies);
      const user = await User.findById(req.cookies.user._id) ;
      res.render("profile", {
        lastname: user.lastname,
        firstname: user.firstname,
        phone: user.phone,
        email: user.email,
        detailAddress: user.detailAddress,
      });
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
  };

  //[POST]
  updateProfile = async (req, res, next) => {
    try {
      const {
        inputFName,
        inputLName,
        inputEmail,
        inputAddress,
        inputPhoneNumber,
      } = req.body;
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.cookies.user._id },
        {
          $set: {
            firstname: inputFName,
            lastname: inputLName,
            email: inputEmail,
            detailAddress: inputAddress,
            phone: inputPhoneNumber,
          },
        },
        { new: true } 
      );
      
      res.clearCookie("user");
      res.cookie("user", updatedUser, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.redirect("/profile");
    } catch (err) {
      next(err);
    }
  };

  changePassword = async (req, res, next) => {
    try {
      const user = await User.findById(req.cookies.user._id) ;
      const { inputOldPw, inputNewPw } = req.body;
      const checkOldPw = await bcrypt.compare(
        inputOldPw,
        user.password
      );
      if (!checkOldPw) {
        return res.render('changePw', {oldPwMsg: 'Old password is incorrect!', inputOldPw});
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPw = await bcrypt.hash(inputNewPw, salt);
      await User.updateOne(
        { _id: user._id},
        {
          password: hashedPw
        }
      );
      res.clearCookie("user");
      res.redirect("/user/signin");
      console.log("change password successfully");
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new profileController();
