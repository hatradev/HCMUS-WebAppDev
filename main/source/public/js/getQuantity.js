document.addEventListener("DOMContentLoaded", function () {
    const quantityButtons = document.querySelectorAll(".blk-qty-btn");
    quantityButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        const quantityInput = this.parentNode.querySelector(".product-quantity");
        let currentQuantity = parseInt(quantityInput.value, 10);
        const productId = this.getAttribute("data-id");
  
        // Check if it's a plus or minus button and update the quantity
        if (this.classList.contains("plus")) {
          currentQuantity++;
        } else if (this.classList.contains("minus")) {
          currentQuantity = currentQuantity > 1 ? currentQuantity - 1 : 1;
        }
  
        quantityInput.value = currentQuantity;
        updateQuantityInCart(productId, currentQuantity);
  
        // Now, update the total price for this item
        const priceElement =
          this.closest(".cart-item").querySelector(".product-price");
        const price =
          parseFloat(
            priceElement.innerText.replace(/[^0-9.,]/g, "").replace(",", ".")
          ) || 0;
        const totalPriceElement =
          this.closest(".cart-item").querySelector(".products-price");
        totalPriceElement.innerText = calculateTotalPrice(price, currentQuantity);
      });
    });
  
    removeCartButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const productId = this.getAttribute("data-id");
        deleteProductFromCart(productId, this);
      });
    });
  });
  
  function updateQuantityInCart(productId, newQuantity) {
    fetch("/product/cart/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, newQuantity }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("before success");
        console.log("Success:", data);
        //updateCartUI(productId, newQuantity);
        calculateTotal(); // Tính toán lại tổng giá trị đơn hàng
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  
  async function deleteProductFromCart(productId, buttonElement) {
    try {
      const response = await fetch(`/product/cart/${productId}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        const data = await response.json();
        // Xử lý dữ liệu JSON trả về từ server
        buttonElement.closest(".cart-item").remove();
        calculateTotal();
        // Cập nhật thông tin giỏ hàng nếu cần
      } else {
        // Kiểm tra nếu phản hồi không phải là JSON
        if (response.headers.get("content-type").includes("application/json")) {
          const errorData = await response.json();
          console.error(
            "Error when deleting product from cart",
            errorData.message
          );
          alert("Lỗi khi xóa sản phẩm khỏi giỏ hàng: " + errorData.message);
        } else {
          console.error("Unexpected response from server");
          alert("Lỗi không mong đợi từ server.");
        }
      }
    } catch (error) {
      console.error(
        "There was an error deleting the product from the cart",
        error
      );
      alert("Có lỗi xảy ra khi xóa sản phẩm: " + error.message);
    }
  }
  
  function calculateTotal() {
    let total = 0;
  
    const cartItems = document.querySelectorAll(".cart-item");
  
    cartItems.forEach((item) => {
      const priceText = item
        .querySelector(".products-price")
        .innerText.replace(/[^0-9.,]/g, "")
        .replace(",", ".");
      const quantityText = item.querySelector(".product-quantity").value; // hoặc innerText, tuỳ thuộc vào cấu trúc
  
      const price = parseFloat(priceText) || 0;
      const quantity = parseInt(quantityText, 10) || 0;
      console.log(quantity);
  
      total += price;
      console.log(total);
    });
  
    document.querySelector(".total").innerHTML = `Tổng: ${formatPrice(
      total
    )}<sub>đ</sub>`;
  }
  
  // Hàm formatPrice để định dạng số theo dạng tiền tệ
  function formatPrice(price) {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  
  function calculateTotalPrice(price, quantity) {
    return price * quantity;
  }
  