var accountModal = document.getElementById("accountModal");
accountModal.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  var button = event.relatedTarget;
  // Extract info from data-bs-* attributes
  var recipient = button.getAttribute("data-bs-whatever");
  var targetAction = button.getAttribute("data-bs-type");
  // If necessary, you could initiate an AJAX request here
  // and then do the updating in a callback.
  //
  // Update the modal's content.
  var modalTitle = accountModal.querySelector(".modal-title");
  var modalBodyInput = accountModal.querySelector(".modal-body input");
  var modalSubmitBtn = accountModal.querySelector("#modalsubmit");

  modalTitle.textContent = "New message to " + recipient;
  modalBodyInput.value = recipient;
  modalSubmitBtn.textContent = targetAction;
});
