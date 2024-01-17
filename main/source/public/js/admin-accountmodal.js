var accountModal = document.getElementById("accountModal");
accountModal.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  var button = event.relatedTarget;
  // Extract info from data-bs-* attributes
  var fname = button.getAttribute("data-bs-fname");
  var lname = button.getAttribute("data-bs-lname");
  var email = button.getAttribute("data-bs-email");
  var phone = button.getAttribute("data-bs-phone");
  var adr = button.getAttribute("data-bs-adr");
  var id = button.getAttribute("data-bs-id");

  var fnameInput = accountModal.querySelector(".modal-body #firstname");
  fnameInput.value = fname;

  var lnameInput = accountModal.querySelector(".modal-body #lastname");
  lnameInput.value = lname;

  var emailInput = accountModal.querySelector(".modal-body #email");
  emailInput.value = email;

  var phoneInput = accountModal.querySelector(".modal-body #phone");
  phoneInput.value = phone;

  var adrInput = accountModal.querySelector(".modal-body #address");
  adrInput.value = adr;

  var idInput = accountModal.querySelector(".modal-body #id");
  idInput.value = id;
});
