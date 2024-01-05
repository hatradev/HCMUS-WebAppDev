const account = require("../models/account.model");
const mongoose = require('../helpers/mongoose');

function route(app) {
  // Định nghĩa các route theo tài nguyên
  app.get('/', async (req, res) => {
    let user = await account.find({});
    if (user) {
      console.log(user);
    } else {
      console.log("fail");
    }
    res.json(user);
  })

  // Hai middlewares này phải để cuối để check lỗi
  app.use((req, res, next) => {
    res.status(404).render("error", {
      message: "File not Found",
    });
  });
  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).render("error", {
      message: "Internal Server Error!",
    });
  });
}

module.exports = route;
