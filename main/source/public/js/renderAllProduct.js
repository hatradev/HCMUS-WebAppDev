import fetchProducts from './fetchProducts.js';

// function loadProducts(page) {
//     fetch(`/product/api/all-products?page=${page}`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             renderProducts(data.products);
//             updatePagination(data.pagination);
//         })
//         .catch(error => {
//             console.error('Error fetching products:', error);
//         });
// }

// Call this function on page load and on pagination click events
document.addEventListener('DOMContentLoaded', () => {
    // console.log('renderAllProduct.js loaded');

    currentState.mode = 'normal';
    currentState.page = 1;
    fetchProducts(); // Load first page on initial load
});
