import renderProducts from './renderProducts.js';
import updatePagination from './updatePagination.js';

document.addEventListener('DOMContentLoaded', () => {
  // console.log('DOM loaded. 🥳');

  const filterButton = document.getElementById('filter-btn');
  if (filterButton) {
      filterButton.addEventListener('click', applyFilters);
  }
});

function applyFilters(event) {
    event.preventDefault(); // Prevent the default anchor behavior

    const selectedCategory = document.getElementById('selectedCategory').value;
    const minPrice = document.getElementById('price_form').getAttribute('data-size');
    const maxPrice = document.getElementById('price_to').getAttribute('data-size');

    // Construct the URL for the API request
    const url = `/product/api/filter-products?category=${selectedCategory}&minPrice=${minPrice}&maxPrice=${maxPrice}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
          renderProducts(data.products);

          updatePagination(data.total, data.page, data.totalPages);
        })
        .catch(error => {
            console.error('Error fetching filtered products:', error);
        });
}