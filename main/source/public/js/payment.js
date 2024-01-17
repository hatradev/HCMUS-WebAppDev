// Function to calculate and update the subtotal
function updateSubtotal() {
  let subtotal = 0;

  // Select all cart item rows
  const cartItems = document.querySelectorAll(".cartItem");

  // Calculate subtotal
  cartItems.forEach((item) => {
    const priceElement = item.querySelector(".products-price");
    const price =
      parseFloat(
        priceElement.innerText.replace(/\./g, "")
      ) || 0;
    subtotal += price;
  });

  // Update the subtotal display
  const subtotalElement = document.querySelector(
    ".table-checkout tfoot tr:first-child td:last-child"
  );
  subtotalElement.innerText = formatPrice(subtotal) + " đ";
  const primarytotalElement = document.querySelector(
    ".totalPrice"
  );
  primarytotalElement.innerText = formatPrice(subtotal) + " đ";
}

// Function to format the price as a string
function formatPrice(price) {
  return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Call this function to update the subtotal when the page loads
document.addEventListener("DOMContentLoaded", updateSubtotal);

// Optional: If your cart items can be updated dynamically (e.g., changing quantities),
// you should also call updateSubtotal() in those event handlers.
