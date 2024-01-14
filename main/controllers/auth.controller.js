require("dotenv").config();
const { request } = require("express");
const User = require("../models/account.model");

const getGoogleUser = async ({ id_token, access_token }) => {
  console.log("getUser: ");
  const rs = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}&alt=json`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    }
  );
  const data = await rs.json();
  return data;
};

const urlGG = process.env.URL_GG;
const access_type = "offline";
const response_type = "code";
const redirect_uri = process.env.GOOGLE_CALLBACK_URL;
const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;
const scope = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

class authController {
  google = (req, res) => {
    const qs = new URLSearchParams({
      access_type,
      response_type,
      redirect_uri,
      client_id: client_id,
      scope: scope.join(" "),
    }).toString();
    res.redirect(`${urlGG}?${qs}`);
  };
  ggAuth = async (req, res, next) => {
    try {
      const code = req.query.code;
      const options = {
        code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: "authorization_code",
      };
      const rs = await fetch("https://oauth2.googleapis.com/token", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
      });
      const response = await rs.json();
      const id_token = response.id_token;
      const access_token = response.access_token;
      const googleUser = await getGoogleUser({ id_token, access_token });
      // console.log(googleUser);

      //save the user to the database
      let user = await User.findOne({ email: googleUser.email });
      if (user) {
        if (!user.avatar) {
          await User.updateOne(
            { _id: user._id },
            { $set: { avatar: googleUser.picture } }
          );
          user = await User.findOne({ email: googleUser.email });
        }
        res.cookie("user", user, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        res.redirect("/");
      }
      else{
        res.render("confirm", {
          lastname: googleUser.given_name,
          firstname: googleUser.family_name,
          email: googleUser.email,
        });
      }
    } catch (err) {
      next(err);
    }
  };
}
module.exports = new authController();
