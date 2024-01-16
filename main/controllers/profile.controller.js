const User = require("../models/account.model");
const userController = require("../controllers/user.controller");
const bcrypt = require('bcrypt');

class profileController {
  // [GET] /
  getProfile = async (req, res, next) => {
    try {
      // console.log(req.cookies);
      const user = await User.findById(req.cookies.user._id) ;
      console.log(user);
      res.render("profile", {
        lastname: user.lastname,
        firstname: user.firstname,
        phone: user.phone,
        email: user.email,
        address: user.address,
        avatar: user.avatar || "",
      });
      
    } catch (err) {
      next(err);
    }
  };
  getChangePasswordP = async (req, res, next) => {
    try {
      const user = req.cookies.user;
      res.render("changePw", {firstname: user.firstname, lastname: user.lastname});
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
            address: inputAddress,
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
      let user = await User.findById(req.cookies.user._id) ;
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
      user = await User.findById(req.cookies.user._id);
      res.render('changePw', {msg: 'Change password successfully!'});
      console.log("change password successfully");
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new profileController();
