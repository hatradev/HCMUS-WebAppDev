class productController {
    // [GET] /
    displayAll = async (req, res, next) => {
      try {
        res.render("all-product", {});
      } catch (err) {
        next(err);
      }
    };
  }
  
  module.exports = new productController();