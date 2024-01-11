function filterProducts() {
    const category = document.getElementById('categorySelect').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;

    const url = `/api/products?category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}`;

    fetch(url)
        .then(response => response.json())
        .then(products => {
            // Clear existing products
            document.getElementById('productsContainer').innerHTML = '';
            
            // Add new products to the page
            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.innerHTML = `<h2>${product.name}</h2><p>${product.price}</p>`;
                document.getElementById('productsContainer').appendChild(productElement);
            });
        })
        .catch(error => console.error('Error:', error));
}