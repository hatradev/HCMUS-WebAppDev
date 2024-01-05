class productController {
    displayAll = async (req, res, next) => {
      // console.log("displayAll");
      try {
        res.render("all-product", {});
      } catch (err) {
        next(err);
      }
    };
    displaySpecific = async (req, res, next) => {
      try {
        res.render("specific-product", {});
      } catch (err) {
        next(err);
      }
    };
  }
  
  module.exports = new productController();