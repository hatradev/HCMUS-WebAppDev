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
// const getFacebookUser = async ({ access_token }) => {
//   const rs = await fetch(
//     `https://graph.facebook.com/me?access_token=${access_token}&fields=id,name,email,picture`,
//     {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//       },
//     }
//   );
//   const data = await rs.json();
//   return data;
// };

const gg_scope = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

// const fb_scope = [
//   "email", "public_profile",
// ]

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
          avatar: googleUser.picture,
        });
      }
    } catch (err) {
      next(err);
    }
  };

  //FACEBOOK
  // fbAuth = (req, res) => {
  //   const qs = new URLSearchParams({
  //     client_id: process.env.FACEBOOK_CLIENT_ID,
  //     redirect_uri: process.env.FACEBOOK_CALLBACK_URL,
  //     scope: fb_scope.join(","),
  //   }).toString();
  //   res.redirect(`${process.env.URL_FB}?${qs}`);
  // };

  // fbCallback = async (req, res) => {
  //   const { code } = req.query;
  //   try {
  //     console.log('code', code);
  //     const accessTokenResponse = await fetch(`https://graph.facebook.com/v13.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}&redirect_uri=${process.env.FACEBOOK_CALLBACK_URL}`);
  //     if (!accessTokenResponse.ok) {
  //       throw new Error(`Access token request failed with status: ${accessTokenResponse.status}`);
  //     }
      
  //     const { access_token } = await accessTokenResponse.json();
  //     console.log('at', access_token)
  
  //     const facebookUser = await getFacebookUser({access_token });
  //     console.log('user',facebookUser);
  
  //     //save the user to the database
  //     let user = await User.findOne({ email: facebookUser.email });
  //     if (user) {
  //       if (!user.avatar) {
  //         await User.updateOne(
  //           { _id: user._id },
  //           { $set: { avatar: facebookUser.picture.data.url } }
  //         );
  //         user = await User.findOne({ email: facebookUser.email });
  //       }
  //       res.cookie("user", user, {
  //         httpOnly: true,
  //         secure: false,
  //         path: "/",
  //         sameSite: "strict",
  //       });
  //       res.redirect("/");
  //     }
  //     else{
  //       res.render("confirm", {
  //         lastname: facebookUser.name.split(' ')[0],
  //         firstname: (facebookUser.name.split(' ')).slice(1).join(' '),
  //         email: facebookUser.email,
  //       });
  //     }
  
  //     res.redirect('/');
  //   } catch (error) {
  //     console.error('Error:', error.response.data.error);
  //     res.redirect('/login');
  //   }
  // };
}
module.exports = new authController();