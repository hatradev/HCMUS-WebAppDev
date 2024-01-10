const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const methodOverride = require("method-override");
// const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const bodyParser = require("body-parser");
const route = require("../routes/index.route");

// const passport = require("../middleware/passport");
require('dotenv').config();

// GOOGLE OAUTH
// const session = require('express-session');
// const passport = require('passport');
const {google} = require('googleapis');
const oauth2Client = new google.auth.OAuth2(
  '420554225529-v2gdq8nue9cq0up7jtsovdecin77cqim.apps.googleusercontent.com',
  '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',
  'http://localhost:3000/auth/google/callback'
);
// const authRoutes = require('../controllers/auth.controller')(oauth2Client);

// const liveReloadServer = livereload.createServer();
const app = express();
// Livereload for automatically refresh browser
// liveReloadServer.server.once("connection", () => {
//   setTimeout(() => {
//     liveReloadServer.refresh("/");
//   }, 100);
// });

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

// Cấu hình sử dụng passport cho việc authentication
// app.use(passport.initialize());
// app.use(passport.session());

// Cấu hình sử dụng flash cho các thông báo đến người dùng
// app.use(flash());

// ROUTES INIT
route(app);

module.exports = app;
