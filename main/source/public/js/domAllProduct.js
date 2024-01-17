import initFetchProducts from './initFetchProducts.js';

document.addEventListener('DOMContentLoaded', () => {
    initFetchProducts();

    const filterButton = document.getElementById('filter-btn');
    const searchForm = document.querySelector('.search-bar');

    if (filterButton) {
        filterButton.addEventListener('click', initFetchProducts);
    }

    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission
            initFetchProducts();
        });
    }
});