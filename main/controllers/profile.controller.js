const User = require("../models/account.model");

class profileController {
  // [GET] /
  getProfile = async (req, res, next) => {
    try {
      // console.log(req.cookies);
      const user = req.cookies.obj.user;
      const lastname = user.lastname,
        firstname = user.firstname,
        phone = user.phone,
        email = user.email,
        provinces = user.provinces,
        district = user.district,
        detailAddress = user.detailAddress;
      res.render("profile", {
        lastname,
        firstname,
        phone,
        email,
        provinces,
        district,
        detailAddress,
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
        calc_shipping_provinces,
        calc_shipping_district,
        inputAddress,
        inputPhoneNumber,
      } = req.body;
      await User.updateOne(
        { email: inputEmail },
        {
          firstname: inputFName,
          lastname: inputLName,
          email: inputEmail,
          provinces: calc_shipping_provinces,
          district: calc_shipping_district,
          detailAddress: inputAddress,
          phone: inputPhoneNumber,
        }
      );
      res.redirect("/profile");
      console.log("update information successfully");
    } catch (err) {
      next(err);
    }
  };

  // changePassword = async (req, res, next) => {
  //   try {
  //     const { inputOldPw, inputNewPw } = req.body;
  //     const checkOldPw = await bcrypt.compare(
  //       req.cookies.obj.user.password,
  //       user.password
  //     );   
  //     const salt = await bcrypt.genSalt(10);
  //     const hashedPw = await bcrypt.hash(inputNewPw, salt);
  //     await User.updateOne(
  //       { _id: req.cookies.obj.user._id },
  //       {
  //         password: hashedPw
  //       }
  //     );
  //     res.redirect("/profile");
  //     console.log("change password successfully");
  //   } catch (err) {
  //     next(err);
  //   }
  // };
  
}

module.exports = new profileController();
