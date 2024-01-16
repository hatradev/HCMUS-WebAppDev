const User = require("../models/account.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

class userController {
  checkRole = (role) => (req, res, next) => {
    if (req.cookies && req.cookies.user && req.cookies.user.role == role) {
      return next();
    }
    res.redirect("/user/signin");
  };

  isLogin = (req, res, next) => {
    if (req.cookies && req.cookies.user) {
      return next();
    }
    res.redirect("/user/signin");
  };

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
      const { lastname, firstname, email, phone, address } = req.query;
      res.render("signUp", { lastname, firstname, email, phone, address });
    } catch (err) {
      next(err);
    }
  };

  //[POST]
  SignUp = async (req, res, next) => {
    try {
      const {
        inputFirstName,
        inputLastName,
        inputEmail,
        inputPassword,
        inputPhoneNumber,
        inputAddress,
      } = req.body;
      const existingUser = await User.findOne({ email: inputEmail });

      if (existingUser) {
        return res.render("signUp", {
          emailMsg: "Email already exists",
          lastname: inputLastName,
          firstname: inputFirstName,
          email: inputEmail,
          phone: inputPhoneNumber,
          address: inputAddress,
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPw = await bcrypt.hash(inputPassword, salt);

      // await newUser.save();
      res.render("confirm", {
        lastname: inputLastName,
        firstname: inputFirstName,
        email: inputEmail,
        phone: inputPhoneNumber,
        address: inputAddress,
        password: hashedPw,
      });
    } catch (err) {
      next(err);
    }
  };

  sendTokenAndSaveUser = async (req, res, next) => {
    try {
      const { lastname, firstname, email, phone, address, password } = req.body;

      //create accessToken
      const newUser = await new User({
        lastname,
        firstname,
        email,
        phone,
        address: address,
      });
      // console.log('newUser:', newUser);
      const accessToken = jwt.sign(
        {
          user: newUser,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "10m" }
      );
      const rs = await fetch(
        `https://localhost:${process.env.AUX_PORT}/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: accessToken }),
        }
      );
      const response = await rs.json();

      console.log("RESPONSE: ", response);

      //save the user to the database
      newUser.password = password;
      newUser.role = "user";
      await newUser.save();
      res.redirect("/user/signin");
    } catch (err) {
      next(err);
    }
  };

  SignIn = async (req, res, next) => {
    try {
      const { inputEmail, inputPassword } = req.body;
      const user = await User.findOne({ email: inputEmail });
      if (!user) {
        return res.render("signIn", {
          emailMsg: "Email is invalid!",
          inputEmail,
          inputPassword,
        });
      }
      const validPassword = await bcrypt.compare(inputPassword, user.password);
      if (!validPassword) {
        return res.render("signIn", {
          pwMsg: "Password is wrong!",
          inputEmail,
          inputPassword,
        });
      }
      res.cookie("user", user, {
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
    res.clearCookie("user");
    res.redirect("/user/signin");
  };
  getHandle = (req, res, next) => {
    try {
      res.render("accounthandle", { nshowHF: true });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new userController();
