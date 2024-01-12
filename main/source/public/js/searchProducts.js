import renderProducts from './renderProducts.js';
import updatePagination from './updatePagination.js';

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.search-bar');

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission
        // console.log('Search form submitted');

        const searchInput = document.querySelector('.search-input');
        performSearch(searchInput.value);
    });
});

function performSearch(keyword) {
    if (!keyword.trim()) {
        return; // Avoid searching for empty strings
    }

    fetch(`/product/api/search-products?keyword=${encodeURIComponent(keyword)}`)
        .then(response => response.json())
        .then(data => {
            renderProducts(data.products);
  
            updatePagination(data.total, data.page, data.totalPages);
          })
        .catch(error => console.error('Error:', error));
}