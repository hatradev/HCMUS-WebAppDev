const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const methodOverride = require("method-override");
const connectLiveReload = require("connect-livereload");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require("body-parser");
const route = require("../routes/index.route");
const cors = require("cors");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(connectLiveReload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(cors());
app.use(cookieParser());
app.use(session({
  secret: 'your_secret_key', // Thay thế với một chuỗi bí mật của riêng bạn
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true } // Sử dụng 'secure: true' chỉ khi bạn sử dụng HTTPS
}));

// Template engines handlebars
app.engine(
  "hbs",
  hbs.engine({
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));

// Cấu hình file static
app.use("/css", express.static("./public/css"));
app.use("/js", express.static("./public/js"));

// ROUTES INIT
route(app);

module.exports = app;
