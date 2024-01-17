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
  var total = button.getAttribute("data-bs-total");
  var email = button.getAttribute("data-bs-email");
  var pname = button.getAttribute("data-bs-pname").split(";;");
  var price = button
    .getAttribute("data-bs-price")
    .split(";;")
    .map((e) => {
      return parseInt(e);
    });
  var quantity = button
    .getAttribute("data-bs-quantity")
    .split(";;")
    .map((e) => {
      return parseInt(e);
    });
  var sum = button
    .getAttribute("data-bs-sum")
    .split(";;")
    .map((e) => {
      return parseInt(e);
    });

  var cnt = pname.length;

  // Update modal content with extracted values
  var idElement = orderModal.querySelector(".modal-body #id");
  idElement.textContent = id;

  var dateElement = orderModal.querySelector(".modal-body #date");
  dateElement.textContent = new Date(date).toLocaleString();

  var buyerElement = orderModal.querySelector(".modal-body #buyer");
  buyerElement.textContent = buyer;

  var phoneElement = orderModal.querySelector(".modal-body #phoneNum");
  phoneElement.textContent = phone;

  var emailElement = orderModal.querySelector(".modal-body #email");
  emailElement.textContent = email;

  var addressElement = orderModal.querySelector(".modal-body #address");
  addressElement.textContent = address;

  var statusElement = orderModal.querySelector(".modal-body #status");
  statusElement.textContent = status;

  var pElement = orderModal.querySelector(".modal-body #ptable");
  pElement.innerHTML = "";
  for (var i = 0; i < cnt; i++) {
    pElement.innerHTML += `<tr>
    <th scope="row">${pname[i]}</th>
    <td>${price[i]}</td>
    <td>${quantity[i]}</td>
    <td>${sum[i]}</td>
  </tr>`;
  }
  var totalElement = orderModal.querySelector(".modal-body #total");
  totalElement.textContent = `Tổng giá trị đơn hàng: ${total} VNĐ`;
});
