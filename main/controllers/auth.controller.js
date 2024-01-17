require("dotenv").config();
const { request } = require("express");
const User = require("../models/account.model");

const getGoogleUser = async ({ id_token, access_token }) => {
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

const gg_scope = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

class authController {
  //GOOGLE
  ggAuth = (req, res) => {
    const qs = new URLSearchParams({
      access_type: "offline",
      response_type: "code",
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      scope: gg_scope.join(" "),
    }).toString();
    res.redirect(`${process.env.URL_GG}?${qs}`);
  };
  ggCallback = async (req, res, next) => {
    try {
      const code = req.query.code;
      const options = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
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
        // console.log(user.avatar);
        if (user.avatar == "/img/avatar/default.png") {
          // console.log("update avatar");
          await User.updateOne(
            { _id: user._id },
            { $set: { avatar: googleUser.picture } }
          );
          user = await User.findOne({ email: googleUser.email });
        }

        // console.log(req.cookies.user);
        // res.clearCookie("user");
        // console.log(req.cookies.user);

        res.cookie("user", user, {
          httpOnly: true,
          secure: false,
          path: "/",
          // sameSite: "strict",
        });

        // console.log(req.cookies.user);

        res.redirect("/");
      }
      else{
        res.render("inputInfor", {
          lastname: googleUser.given_name,
          firstname: googleUser.family_name,
          email: googleUser.email,
          avatar: googleUser.picture,
        });
      }
    } catch (err) {
      next(err);
    }
  };
}
module.exports = new authController();