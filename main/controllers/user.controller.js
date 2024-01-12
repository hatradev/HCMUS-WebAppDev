const User = require("../models/account.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
<<<<<<< Updated upstream
=======
const axios = require("axios");
require("dotenv").config();
>>>>>>> Stashed changes

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

  //[POST]
  SignUp = async (req, res, next) => {
    try {
<<<<<<< Updated upstream
      const { inputFirstName, inputLastName, inputEmail, inputPassword } = req.body;
=======
      const {
        inputFirstName,
        inputLastName,
        inputEmail,
        inputPassword,
        inputPhoneNumber,
        inputAddress,
      } = req.body;
>>>>>>> Stashed changes
      const existingUser = await User.findOne({ email: inputEmail });

      if (existingUser) {
        return res.render("signUp", { emailMsg: "Email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPw = await bcrypt.hash(inputPassword, salt);
      const newUser = await new User({
        role: "user",
        firstname: inputFirstName,
        lastname: inputLastName,
        email: inputEmail,
        password: hashedPw,
      });
      await newUser.save();
<<<<<<< Updated upstream
      res.redirect('/user/signin');
=======
      res.render("confirm", {
        lastname: newUser.lastname,
        firstname: newUser.firstname,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.detailAddress,
      });
    } catch (err) {
      next(err);
    }
  };
  sendToken = async (req, res, next) => {
    try {
      console.log(req.body.email);
      const user = await User.findOne({ email: req.body.email });
      // console.log(user);
      const accessToken = jwt.sign(
        {
          user: user,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "10m" }
      );
      const apiUrl = `https://localhost:1234/signup?accessToken=${accessToken}`;
      const response = await axios
        .get(apiUrl)
        .then(function (response) {
          // handle success
          console.log(response);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
          // always executed
        });
      res.redirect("/user/signin");
>>>>>>> Stashed changes
    } catch (err) {
      next(err);
    }
  };
  SignIn = async (req, res, next) => {
    try {
      const { inputEmail, inputPassword } = req.body;
      const user = await User.findOne({ email: inputEmail });
      if (!user) {
        return res.render("signIn", { msg: "Email is invalid!" });
      }
      const validPassword = await bcrypt.compare(inputPassword, user.password);
      if (!validPassword) {
        return res.render("signIn", { msg: "Password is invalid!" });
      }
      const obj = {
        accessToken: jwt.sign(
          {
            user: user,
          },
          process.env.JWT_ACCESS_KEY,
          { expiresIn: "10m" }
        ),
        user: user,
      };
      res.cookie("obj", obj, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  };
  Logout = (req, res) => {
    res.clearCookie("obj");
    res.redirect("/user/signin");
  };
}

module.exports = new userController();
