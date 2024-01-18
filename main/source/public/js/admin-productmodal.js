function newimg(imgsrc) {
  return `<div class="card-preview-img"><button class="btn btn-danger remove-button" onclick="removeImage(this)"><i class="fa-solid fa-x"></i></button><img src="${imgsrc}" value="${imgsrc}" name="image" class="img-thumbnail w-100 h-100 object-fit-contain"/></div>`;
}

function readURL(input) {
  if (input.files) {
    for (var file of input.files) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $("#preview-imgs")[0].innerHTML =
          $("#preview-imgs")[0].innerHTML + newimg(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
}

function removeImage(button) {
  // Lấy container của ảnh (div.card-preview-img) và loại bỏ nó
  var imageContainer = button.closest(".card-preview-img");
  imageContainer.parentNode.removeChild(imageContainer);
}

$(() => {
  $("#nimage").fileinput({
    theme: "fa5",
    showUpload: false,
    previewFileType: "any",
  });

  var productModal = document.getElementById("productModal");
  productModal.addEventListener("show.bs.modal", function (event) {
    // Button that triggered the modal
    var button = event.relatedTarget;
    $("#preview-imgs")[0].innerHTML = "";
    // Extract info from data-bs-* attributes
    var name = button.getAttribute("data-bs-name");
    var description = button.getAttribute("data-bs-description");
    var price = button.getAttribute("data-bs-price");
    var stock = button.getAttribute("data-bs-stock");
    var category = button.getAttribute("data-bs-category");
    var image = button.getAttribute("data-bs-image");
    var id = button.getAttribute("data-bs-id");

    var nameInput = productModal.querySelector(".modal-body #name");
    var descriptionInput = productModal.querySelector(
      ".modal-body #description"
    );
    var stockInput = productModal.querySelector(".modal-body #stock");
    var priceInput = productModal.querySelector(".modal-body #price");
    var categoryInput = productModal.querySelector(".modal-body #category");
    var idInput = productModal.querySelector(".modal-body #id");

    var create = button.getAttribute("data-bs-type");
    console.log(create);
    if (create === "create") {
      productModal.querySelector(".modal-header .modal-title").textContent =
        "Tạo sản phẩm mới";
      productModal
        .querySelector(".modal-footer #deleteBtn")
        .classList.add("d-none");
      productModal.querySelector(".modal-footer #modalsubmit").textContent =
        "Tạo";
      productModal.querySelector(".modal-body #updateProduct").action =
        "/product/create-product";
      nameInput.value = "";

      descriptionInput.value = "";

      stockInput.value = "";

      priceInput.value = "";
      categoryInput.children[0].selected = true;
    } else {
      nameInput.value = name;

      descriptionInput.value = description;

      stockInput.value = stock;

      priceInput.value = price;

      if (category) {
        for (var child of categoryInput.children) {
          child.selected = false;
          if (child.value === category) {
            child.selected = true;
          }
        }
      } else {
        categoryInput.children[0].selected = true;
      }

      idInput.value = id;

      const listImg = image.split(";");
      for (var img of listImg) {
        $("#preview-imgs")[0].innerHTML =
          $("#preview-imgs")[0].innerHTML + newimg(img);
      }
    }
  });
});
