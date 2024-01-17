var categoryModal = document.getElementById("categoryModal");
categoryModal.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  var button = event.relatedTarget;
  // Extract info from data-bs-* attributes

  var create = button.getAttribute("data-bs-do");
  if (create === "create") {
    categoryModal.querySelector(".modal-header .modal-title").textContent =
      "Tạo danh mục mới";
    categoryModal
      .querySelector(".modal-footer #deleteBtn")
      .classList.add("d-none");
    categoryModal.querySelector(".modal-footer #modalsubmit").textContent =
      "Tạo";
    categoryModal.querySelector(".modal-body #updateCategory").action = "/product/create-category";
  } else {
    var name = button.getAttribute("data-bs-name");
    var description = button.getAttribute("data-bs-description");
    var parentName = button.getAttribute("data-bs-parentName");
    var id = button.getAttribute("data-bs-id");

    var nameInput = categoryModal.querySelector(".modal-body #name");
    nameInput.value = name;

    var descriptionInput = categoryModal.querySelector(
      ".modal-body #description"
    );
    descriptionInput.value = description;

    var parentNameInput = categoryModal.querySelector(".modal-body #parentname");
    if (parentName) {
      for (var child of parentNameInput.children) {
        child.selected = false;
        if (child.value === parentName) {
          child.selected = true;
        }
      }
    } else {
      parentNameInput.children[0].selected = true;
    }

    var idInput = categoryModal.querySelector(".modal-body #id");
    idInput.value = id;

  }
});
