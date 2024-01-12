const User = require("../models/account.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");

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
        detailAddress: address,
      });
      // console.log('newUser:', newUser);
      const accessToken = jwt.sign(
        {
          user: newUser,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "10m" }
      );

      //save the user to the database
      newUser.password = password;
      newUser.role = "user";
      await newUser.save();

      // const response = await axios.post(`https://localhost:${process.env.AUX_PORT}/`, {accessToken});
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
