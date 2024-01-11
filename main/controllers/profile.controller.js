const User = require('../models/account.model');

class profileController {
  // [GET] /
  getProfile = async (req, res, next) => {
    try {
      const userId = req.session.passport.user;
      const user = await User.findOne({_id: userId});
      const lastname = user.lastname,
      firstname = user.firstname,
      phone = user.phone,
      email = user.email,
      provinces = user.provinces,
      district = user.district,
      detailAddress = user.detailAddress;
      res.render("profile", {lastname, firstname, phone, email, provinces, district, detailAddress});
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
  }

  //[POST]
  updateProfile = async (req, res, next) => {
    try {
      const {inputFName, inputLName, inputEmail, calc_shipping_provinces, calc_shipping_district, inputAddress, inputPhoneNumber } = req.body;
      await User.updateOne({email: inputEmail}, 
        {
          firstname: inputFName,
          lastname: inputLName,
          email: inputEmail,
          provinces: calc_shipping_provinces,
          district: calc_shipping_district,
          detailAddress: inputAddress,
          phone: inputPhoneNumber
      });
      res.redirect('/profile');
      console.log('update information successfully')
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new profileController();
