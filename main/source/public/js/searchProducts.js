import fetchProducts from './fetchProducts.js';

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

    currentState.mode = 'search';
    currentState.searchQuery = keyword;
    currentState.page = 1;

    fetchProducts();
}