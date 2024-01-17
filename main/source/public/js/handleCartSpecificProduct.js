document.addEventListener('DOMContentLoaded', function () {
    const addToCartButton = document.getElementById('addToCart');
    const buyNowButton = document.getElementById('addPayNow');
    // Select the increment and decrement buttons
    var incrementButton = document.querySelector('.blk-qty-btn.plus');
    var decrementButton = document.querySelector('.blk-qty-btn.minus');

    // Select the quantity input field
    var quantityInput = document.querySelector('.blk-qty-input');

    // Add click event listener to the increment button
    incrementButton.addEventListener('click', function() {
        var currentQuantity = parseInt(quantityInput.value);
        quantityInput.value = currentQuantity + 1;
    });

    // Add click event listener to the decrement button
    decrementButton.addEventListener('click', function() {
        var currentQuantity = parseInt(quantityInput.value);
        if (currentQuantity > 1) { // Prevents quantity from going below 1
            quantityInput.value = currentQuantity - 1;
        }
    });
    if (addToCartButton) {
        addToCartButton.addEventListener('click', function() {
            const productId = this.getAttribute('data-psid');
            const quantity = parseInt(document.getElementById('quantity').value, 10);
            addToCart(productId, quantity);
        });
    }
    if (buyNowButton) {
        buyNowButton.addEventListener('click', function() {
            const productId = this.getAttribute('data-psid');
            const quantity = parseInt(document.getElementById('quantity').value, 10);
            buyNow(productId, quantity);
        });
    }
});

function addToCart(productId, quantity) {
    fetch('/product/cart/add', {  // Replace with your server's URL endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Product added to cart:', data);
        const cartNumber = data.cart.reduce(
        (accum, product) => accum + product.quantity,
        0
      );
      document.getElementById("lblCartCount").innerText = `${cartNumber}`;
        // Optionally, update the UI to reflect the new cart status
    })
    .catch(error => {
        console.error('Error adding product to cart:', error);
    });
}
function buyNow(productId, quantity) {
    const url = new URL('/paymentBuyNow', window.location.origin);
    url.searchParams.append('productId', productId);
    url.searchParams.append('quantity', quantity);

    window.location.href = url; // Redirects the user to the new URL
}

