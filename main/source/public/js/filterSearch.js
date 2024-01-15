import fetchProducts from './fetchProducts.js';

document.addEventListener('DOMContentLoaded', () => {
    // first load all-product page
    getProducts();

    const filterButton = document.getElementById('filter-btn');
    const searchForm = document.querySelector('.search-bar');

    if (filterButton) {
        filterButton.addEventListener('click', getProducts);
    }

    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission
            getProducts();
        });
    }
});

function getProducts(event) {
    if (event) event.preventDefault(); // Prevent the default behavior if event is present

    // Retrieve filter parameters
    const selectedCategory = document.getElementById('selectedCategory').value;
    const minPrice = document.getElementById('price_form').getAttribute('data-size');
    const maxPrice = document.getElementById('price_to').getAttribute('data-size');

    // Retrieve search query
    const searchInput = document.querySelector('.search-input');
    const searchKeyword = searchInput ? searchInput.value : '';

    // Update currentState with both search and filter parameters
    currentState.filterParams = {
        selectedCategory,
        minPrice,
        maxPrice
    };
    currentState.searchQuery = searchKeyword;
    currentState.page = 1;

    // console.log(currentState);

    fetchProducts(); // This function should now consider both filter and search parameters
}