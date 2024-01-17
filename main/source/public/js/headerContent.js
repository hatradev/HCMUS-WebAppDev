import { initFetchProducts } from './fetchProducts.js';

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.search-bar');

    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission
            initFetchProducts();
        });
    }
});