const account = require("../models/account.model");
const CustomErr = require("../helpers/custom-error");
const jwt = require('jsonwebtoken');

function route(app) {
  // Định nghĩa các route theo tài nguyên
  app.get("/", async (req, res) => {
    let user = await account.find({});
    if (user) {
      console.log(user);
    } else {
      console.log("fail");
    }
    res.render("home");
  });

//   app.get('/getPayment', async (req, res) => {
//     try {
//         // Truy xuất dữ liệu từ session hoặc cookie
//         // const order = req.cookies.orderData;
//         const order = req.session.order;
//         console.log("check cookie order");
//         console.log(order);
//         console.log("end check cookie order");

//         // Render trang với dữ liệu
//         res.render("payment", { order });  // Giả sử 'paymentPage' là tên template
//     } catch (error) {
//         res.status(500).send("Lỗi xử lý trang");
//     }
// });

  

  

  app.post("/signup", async (req, res, next) => {
    try {
      const responseData = { success: true, data: req.body };
      // Gửi phản hồi
      res.json(responseData);
    } catch (error) {
      next(error);
    }
  });


  app.post("/payment", async (req, res, next) => {
      try {
        // Giải mã JWT
        const token = req.body.token;
        if (!token) {
          return { error: "POST No token provided" };
        }
        else {
          res.redirect(`/getPayment?token=${encodeURIComponent(token)}`);
          // const redirectUrl = `https://localhost:1234/getPayment?token=${encodeURIComponent(token)}`;
          // // res.redirect(redirectUrl);
          // fetch(redirectUrl).then(response => {
          //   if (!response.ok) {
          //     throw new Error('Network response was not ok');
          //   }
          //   return response.json();
          // })
          // .then(data => {
          //   console.log(data);
          // })
          // .catch(error => {
          //   console.error('There has been a problem with your fetch operation:', error);
          // });
        }

        // const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
        // const responseData = { success: "successfully sending order", orderData: decoded };
        // Gửi phản hồi
        // res.json(responseData);
        // res.redirect('https://localhost:1234/getPayment');
        
      } catch (error) {
        // Xử lý lỗi JWT hoặc lỗi khác
        next(error);
      }
  });

  app.get("/getPayment", async (req, res, next) => {
    try {
        // console.log("QUERY: ", req.query);
        // console.log("BODY: ", req);
        // res.send("error");
        if (JSON.stringify(req.query) !== '{}') {
          // console.log(req.isAuthenticated())
          // Lấy token từ query string
          console.log("Check received query data last: ", req.query);
          const token = req.query.token;
          console.log(token);
          console.log("NOT TOKEN");
          console.log(!token);

          if (!token) {
              console.log(1);
              return res.status(400).json({ error: "No token provided" });
          }

          // Giải mã token
          const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
          console.log("check AUX last");
          console.log(decoded);
          console.log("end check AUX last");
          
          res.render("payment", {order: decoded.order, totalPrice: decoded.totalPrice});
        } else {
          res.send("BUG");
        }
    } catch (error) {
        // Xử lý lỗi giải mã JWT hoặc lỗi khác
        next(error);
    } 
});

 
  // app.get("/getPayment", async (req, res, next) => {
  //     try {
  //       console.log("Received query data: ", req.query);
  //       if (!req.query) {
  //         return res.status(400).json({ error: "No data provided" });
  //     }

  //     // Phân tích dữ liệu JSON
  //     const parsedData = JSON.parse(decodeURIComponent(req.query.data));
  //     if (!parsedData.token) {
  //         return res.status(400).json({ error: "Token not found in data" });
  //     }

  //     const decoded = jwt.verify(parsedData.token, process.env.JWT_ACCESS_KEY);

  //       const responseData = { success: "successfully sending order", orderData: decoded };
  //       // Gửi phản hồi
  //       console.log("check AUX last");
  //       console.log(decoded);
  //       console.log("end check AUX last");
  //       res.render("payment");
  //       // res.json(responseData);
  //       // res.redirect('https://localhost:1234/getPayment');
  //     } catch (error) {
  //       // Xử lý lỗi JWT hoặc lỗi khác
  //       next(error);
  //     }
  // });



  // Hai middlewares này phải để cuối để check lỗi
  app.use((req, res, next) => {
    res.status(404).render("error", {
      code: 404,
      msg: "Page not found",
      description: "The page you're looking for doesn't exist",
      nshowHF: true,
    });
  });
  app.use((error, req, res, next) => {
    const statusCode = error instanceof CustomErr ? error.statusCode : 500;
    res.status(statusCode).render("error", {
      code: statusCode,
      msg: "Server error",
      description: error.message,
      nshowHF: true,
    });
  });
}

module.exports = route;
