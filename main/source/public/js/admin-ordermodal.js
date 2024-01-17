var orderModal = document.getElementById("orderModal");
orderModal.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  var button = event.relatedTarget;

  // Extract info from data-bs-* attributes
  var id = button.getAttribute("data-bs-id");
  var date = button.getAttribute("data-bs-date");
  var buyer = button.getAttribute("data-bs-buyer");
  var phone = button.getAttribute("data-bs-phone");
  var address = button.getAttribute("data-bs-address");
  var status = button.getAttribute("data-bs-status");
  var detail = button.getAttribute("data-bs-detail");
  console.log(JSON.parse(detail));

  // Update modal content with extracted values
  var idElement = orderModal.querySelector(".modal-body #id");
  idElement.textContent = id;

  var dateElement = orderModal.querySelector(".modal-body #date");
  dateElement.textContent = (new Date(date)).toLocaleString();

  var buyerElement = orderModal.querySelector(".modal-body #buyer");
  buyerElement.textContent = buyer;

  var phoneElement = orderModal.querySelector(".modal-body #phoneNum");
  phoneElement.textContent = phone;

  var addressElement = orderModal.querySelector(".modal-body #address");
  addressElement.textContent = address;

  var statusElement = orderModal.querySelector(".modal-body #status");
  statusElement.textContent = status;

  var productDetails = JSON.parse(detail);
  console.log(productDetails);

// Xóa nội dung cũ của ul
productList.innerHTML = "";

// Duyệt qua mảng sản phẩm và thêm vào danh sách
productDetails.forEach((product, index) => {
    var listItem = document.createElement("li");
    listItem.textContent = `Sản phẩm ${index + 1}: ${product.name} - Số lượng: ${product.quantity}`;
    productList.appendChild(listItem);
});
});
