const Product = require('../models/product.model');
const Category = require('../models/category.model');

class productController {
  // Method to display all products
  showAllProduct = async (req, res, next) => {
    try {
      // Retrieve all products from the database
      const products = await Product.find().lean();
  
      // Retrieve all categories from the database
      const categoriesWithCounts = await Category.find().lean();
  
      // Count the number of products in each main category and subcategory
      for (const category of categoriesWithCounts) {
        // Initialize total count for the category
        let totalCategoryCount = 0;
  
        // Count products in the main category
        const mainCategoryCount = await Product.countDocuments({ mainCategory: category._id });
        category.count = mainCategoryCount;
  
        // If subcategories exist, count products in each subcategory
        if (category.subcategories && category.subcategories.length > 0) {
          for (const subcategory of category.subcategories) {
            const subcategoryCount = await Product.countDocuments({
              subcategory: subcategory.name // Assuming the subcategory field is a string that matches subcategory name
            });
            subcategory.count = subcategoryCount; // Set the count for the subcategory
            // totalCategoryCount += subcategoryCount; // Add to the total count for the main category
          }
        }
      }
  
      // console.log('categoriesWithCounts: ', categoriesWithCounts);
  
      // Now pass products and categories with counts to your template
      res.render("all-product", { products, categories: categoriesWithCounts });
    } catch (err) {
      // Pass the error to the error handling middleware
      next(err);
    }
  };  

  showSpecificProduct = async (req, res, next) => {
    try {
      // Extract productId from request parameters
      const { productId } = req.params;
  
      // Find the specific product by its _id
      const product = await Product.findById(productId).lean();
  
      // If no product is found, handle the 404 case
      if (!product) {
        res.status(404).send('Product not found');
        return;
      }

      // console.log('product: ', product);
  
      // If a product is found, send it to the front-end or handle it as needed
      res.render("specific-product", { product }); // Adjust the view as per your setup
    } catch (err) {
      // If an error occurs, log it and pass it to the error handling middleware
      console.error(err);
      next(err);
    }
  };
}

// Export an instance of the controller
module.exports = new productController();
