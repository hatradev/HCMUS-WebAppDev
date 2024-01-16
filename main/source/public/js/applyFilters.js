import fetchProducts from './fetchProducts.js';

document.addEventListener('DOMContentLoaded', () => {
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

    // Update currentState with the new filter parameters
    currentState.filterParams = {
      selectedCategory: selectedCategory,
      minPrice: minPrice,
      maxPrice: maxPrice
    };
    currentState.mode = 'filter'; // Set the mode to 'filter'
    currentState.page = 1; // Reset the page number to 1

    fetchProducts();
}