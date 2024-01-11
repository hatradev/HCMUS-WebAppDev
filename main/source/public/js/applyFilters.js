function selectCategory(categoryId, event) {
    event.preventDefault(); // Prevent the default anchor behavior

    // Update hidden input value with the selected category ID
    document.getElementById('selectedCategory').value = categoryId;

    // Update the displayed category name
    // document.getElementById('selectedCategoryName').innerText = event.currentTarget.innerText;

    // Remove the 'selected-category' class from all category links
    document.querySelectorAll('.category-tree a').forEach(cat => {
        cat.classList.remove('selected-category');
    });

    // Add the 'selected-category' class to the clicked category link
    event.currentTarget.classList.add('selected-category');
    // console.log(event.currentTarget.classList);
}

function applyFilters(event) {
    event.preventDefault(); // Prevent the default anchor behavior

    const selectedCategory = document.getElementById('selectedCategory').value;
    const minPrice = document.getElementById('price_form').getAttribute('data-size');
    const maxPrice = document.getElementById('price_to').getAttribute('data-size');

    // Construct the URL for the API request
    const url = `/product/api/filter-products?category=${selectedCategory}&minPrice=${minPrice}&maxPrice=${maxPrice}`;

    fetch(url)
        .then(response => response.json())
        .then(products => {
            const productsContainer = document.querySelector('.trend-row');
            productsContainer.innerHTML = ''; // Clear existing products

            products.forEach(product => {
                // console.log(product);
                const productHtml = `
                    <div class="product-item item${product._id} col-lg-3 col-xl-3" data-psid="${product._id}">
                      <div class="image">
                        ${product.isnew ? '<span class="flag">New</span>' : ''}
                        <a href="/product/${product._id}" title="${product.name}">
                          <img
                            data-sizes="auto"
                            class="lazyautosizes ls-is-cached lazyloaded"
                            src="${product.image[0]}"
                            data-src="${product.image[0]}"
                            alt="${product.name}"
                          />
                        </a>
                      </div>
                      <h3 class="name">
                        <a href="/product/${product._id}" title="${product.name}">
                          ${product.name}
                        </a>
                      </h3>
                      <div class="product-price">
                        <span class="price">${formatCurrency(product.price)}</span>
                      </div>
                    </div>`;
                productsContainer.innerHTML += productHtml;
            });

            if (products.length === 0) {
                productsContainer.innerHTML = '<div class="col-12"><div class="announcement">Không có sản phẩm phù hợp</div></div>';
            }
        })
        .catch(error => {
            console.error('Error fetching filtered products:', error);
        });
}

// Format currency function (client-side version)
function formatCurrency(price) {
    // Implement currency formatting logic as per your requirement
    // For example, to format as a simple comma-separated value:
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
}