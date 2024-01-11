const User = require("../models/account.model");

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
      const { inputFirstName, inputLastName, inputEmail, inputPassword } = req.body;
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
      res.redirect('/user/signin');
    } catch (err) {
      next(err);
    }
  };
  Logout = (req, res) => {
    req.logout((err) => {
      if (err) {
        throw err;
      }
    });
    res.redirect("/user/signin");
  };
}

module.exports = new userController();
