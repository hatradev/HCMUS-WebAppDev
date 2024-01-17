var categoryModal = document.getElementById("categoryModal");
categoryModal.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  var button = event.relatedTarget;
  // Extract info from data-bs-* attributes
  var name = button.getAttribute("data-bs-name");
  console.log(name);
  var lname = button.getAttribute("data-bs-lname");
  var email = button.getAttribute("data-bs-email");
  var phone = button.getAttribute("data-bs-phone");
  var adr = button.getAttribute("data-bs-adr");
  var id = button.getAttribute("data-bs-id");

  var nameInput = categoryModal.querySelector(".modal-body #name");
  nameInput.value = name;

  var lnameInput = categoryModal.querySelector(".modal-body #lastname");
  lnameInput.value = lname;

  var emailInput = categoryModal.querySelector(".modal-body #email");
  emailInput.value = email;

  var phoneInput = categoryModal.querySelector(".modal-body #phone");
  phoneInput.value = phone;

  var adrInput = categoryModal.querySelector(".modal-body #address");
  adrInput.value = adr;

  var idInput = categoryModal.querySelector(".modal-body #id");
  idInput.value = id;
});
