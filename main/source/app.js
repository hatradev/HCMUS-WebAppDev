const express = require("express");
const hbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const path = require("path");
const methodOverride = require("method-override");
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const bodyParser = require("body-parser");
const route = require("../routes/index.route");
const AccountModel = require("../models/account.model");

// const passport = require("../middleware/passport");
require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// GOOGLE OAUTH
// const session = require('express-session');
// const passport = require('passport');
// const { google } = require("googleapis");
// const oauth2Client = new google.auth.OAuth2(
//   "420554225529-v2gdq8nue9cq0up7jtsovdecin77cqim.apps.googleusercontent.com",
//   "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",
// );
// const authRoutes = require('../controllers/auth.controller')(oauth2Client);

const liveReloadServer = livereload.createServer();
const app = express();
// Livereload for automatically refresh browser
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(connectLiveReload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

// GOOGLE OAUTH
// // Express session
// app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
// // Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// app.use('/auth', authRoutes);

// Template engines handlebars
app.engine(
  "hbs",
  hbs.engine({
    extname: ".hbs",
    helpers: require("../helpers/handlebars"),
    // helpers: {
    //   formatCurrency: function(value) {
    //     return new Intl.NumberFormat().format(value);
    //   }
    // }
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));

// Middleware to check if user is logged in
app.use((req, res, next) => {
  // Check if the user is authenticated. This is just a placeholder.
  // You need to implement your logic based on your authentication method.
  // For example, checking a JWT token or a session.
  if (req.cookies && req.cookies.user) {
    // console.log("User is logged in");

    res.locals.isLoggedIn = true;
    res.locals._firstName = req.cookies.user.firstname;
    // res.locals._cartNumber = req.cookies.obj.user.cart.reduce(
    //   (accum, product) => accum + product.quantity,
    //   0
    // );
  } else {
    // console.log("User is not logged in");

    res.locals.isLoggedIn = false;
    res.locals._cartNumber = 0;
  }

  next();
});

app.use(async (req, res, next) => {
  if (req.cookies && req.cookies.user) {
    // Giả sử sử dụng req.isAuthenticated() để kiểm tra đăng nhập
    try {
      const user = await AccountModel.findById(req.cookies.user._id); // Lấy thông tin người dùng từ DB
      const cartNumber = user.cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      res.locals._cartNumber = cartNumber;
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.locals._cartNumber = 0;
    }
  } else {
    res.locals._cartNumber = 0;
  }

  next();
});

// Cấu hình sử dụng passport cho việc authentication
// app.use(passport.initialize());
// app.use(passport.session());

// Cấu hình sử dụng flash cho các thông báo đến người dùng
// app.use(flash());

// ROUTES INIT
route(app);

module.exports = app;
