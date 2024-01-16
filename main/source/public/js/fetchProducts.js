import renderProducts from './renderProducts.js';
import updatePagination from './updatePagination.js';

function fetchProducts() {
    let url = '';
    // console.log(currentState.mode);
    switch (currentState.mode) {
        case 'search':
            url = `/product/api/search-products?keyword=${encodeURIComponent(currentState.searchQuery)}&page=${currentState.page}`;
            break;
        case 'filter':
            url = '/product/api/filter-products?';
            let params = [];
            // Add filter parameters to the URL
            const { selectedCategory, minPrice, maxPrice } = currentState.filterParams;
            if (selectedCategory) params.push(`category=${encodeURIComponent(selectedCategory)}`);
            if (minPrice !== undefined) params.push(`minPrice=${encodeURIComponent(minPrice)}`);
            if (maxPrice !== undefined) params.push(`maxPrice=${encodeURIComponent(maxPrice)}`);
            // Add pagination parameter
            params.push(`page=${currentState.page}`);
            // Construct the final URL
            url += params.join('&');
            break;
        default:
            url = `/product/api/all-products?page=${currentState.page}`; // Adjust this URL as needed
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            renderProducts(data.products);
            updatePagination(data.pagination);
        })
        .catch(error => console.error('Error:', error));
}

export default fetchProducts;