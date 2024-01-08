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

  // Method to display a specific product (remains unchanged)
  displaySpecific = async (req, res, next) => {
    try {
      // Your existing logic for a specific product will go here
      res.render("specific-product", {});
    } catch (err) {
      next(err);
    }
  };
}

// Export an instance of the controller
module.exports = new productController();
