const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const methodOverride = require("method-override");
const connectLiveReload = require("connect-livereload");
const bodyParser = require("body-parser");
const route = require("../routes/index.route");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(connectLiveReload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

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
