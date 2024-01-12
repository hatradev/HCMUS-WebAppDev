// Format currency function (client-side version)
function formatCurrency(price) {
  // Implement currency formatting logic as per your requirement
  // For example, to format as a simple comma-separated value:
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
}

function renderProducts(products) {
    const productsContainer = document.querySelector('.trend-row');
    productsContainer.innerHTML = ''; // Clear existing products

    products.forEach(product => {
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
}

export default  renderProducts;