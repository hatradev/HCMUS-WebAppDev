const User = require("../models/account.model");
const userController = require("../controllers/user.controller");
const bcrypt = require("bcrypt");
const fs = require("fs");
const { join } = require("path");

class profileController {
  // [GET] /
  getProfile = async (req, res, next) => {
    try {
      // console.log(req.cookies);
      const user = await User.findById(req.cookies.user._id);
      let check = false;
      if (user.role === "admin") {
        check = true;
      }
      res.render("profile", {
        lastname: user.lastname,
        firstname: user.firstname,
        phone: user.phone,
        email: user.email,
        address: user.address,
        avatar: user.avatar,
        check,
      });
    } catch (err) {
      next(err);
    }
  };
  getChangePasswordP = async (req, res, next) => {
    try {
      const user = req.cookies.user;
      res.render("changePw", {
        firstname: user.firstname,
        lastname: user.lastname,
        avatar: user.avatar,
      });
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

      const user = await User.findOne({ _id: req.cookies.user._id });
      let avatar;
      if (req.file && req.file.filename) {
        avatar = `/img/avatar/${req.file.filename}`;
      } else {
        avatar = user.avatar;
      }

      let dirPath = join(__dirname, `../source/public${user.avatar}`);
      // console.log(dirPath);
      fs.unlink(dirPath, function (err) {
        if (err) console.log("delete file failed!");
        else console.log("old photo deleted!");
      });
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.cookies.user._id },
        {
          $set: {
            firstname: inputFName,
            lastname: inputLName,
            email: inputEmail,
            address: inputAddress,
            phone: inputPhoneNumber,
            avatar: avatar,
          },
        },
        { new: true }
      );
      const newUser = await User.findById(req.cookies.user._id);

      res.clearCookie("user");
      res.cookie("user", newUser, {
        httpOnly: true,
        secure: false,
        path: "/",
        // sameSite: "strict",
      });
      res.redirect("/profile");
    } catch (err) {
      next(err);
    }
  };

  changePassword = async (req, res, next) => {
    try {
      let user = await User.findById(req.cookies.user._id);
      const { inputOldPw, inputNewPw } = req.body;
      const checkOldPw = await bcrypt.compare(inputOldPw, user.password);
      if (!checkOldPw) {
        return res.render("changePw", {
          oldPwMsg: "Old password is incorrect!",
          inputOldPw,
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPw = await bcrypt.hash(inputNewPw, salt);
      await User.updateOne(
        { _id: user._id },
        {
          password: hashedPw,
        }
      );
      user = await User.findById(req.cookies.user._id);
      res.clearCookie("user");
      res.cookie("user", user, {
        httpOnly: true,
        secure: false,
        path: "/",
        // sameSite: "strict",
      });
      res.render("changePw", { msg: "Thay đổi mật khẩu thành công!" });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new profileController();
