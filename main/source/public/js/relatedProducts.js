import renderProducts from './renderProducts.js';
import updatePagination from './updatePagination.js';

document.addEventListener('DOMContentLoaded', () => {
    currentState.mode = 'related';
    currentState.page = 1;
    getRelatedProducts();
});

function getRelatedProducts(event) {
    if (event) event.preventDefault();
    // console.log('getRelatedProducts');

    var productElement = document.getElementById("product-id");
    // console.log(productElement);
    const productId = productElement.getAttribute("data-product-id");
    // console.log(productId);

    // console.log(currentState.page);

    fetch(`/product/api/related?productId=${encodeURIComponent(productId)}&page=${currentState.page}`)
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        renderProducts(data.products);
        updatePagination(data.pagination);
    })
    .catch(error => console.error('Error:', error));
}

export default getRelatedProducts;