// function selectCategory(categoryId, event) {
//     if (event)
//         event.preventDefault(); // Prevent the default anchor behavior

//     console.log(categoryId);

//     // Update hidden input value with the selected category ID
//     document.getElementById('selectedCategory').value = categoryId;

//     // Update the displayed category name
//     // document.getElementById('selectedCategoryName').innerText = event.currentTarget.innerText;

//     // Remove the 'selected-category' class from all category links
//     document.querySelectorAll('.category-tree a').forEach(cat => {
//         cat.classList.remove('selected-category');
//     });

//     // Add the 'selected-category' class to the clicked category link
//     event.currentTarget.classList.add('selected-category');
//     // console.log(event.currentTarget.classList);
// }

function selectCategory(categoryId, event) {
    if (event) {
        event.preventDefault(); // Prevent the default anchor behavior
    }

    document.getElementById('selectedCategory').value = categoryId;

    // Remove the 'selected-category' class from all category links
    document.querySelectorAll('.category-tree a').forEach(cat => {
        cat.classList.remove('selected-category');
    });

    // If event is not provided, find the corresponding element manually
    if (!event) {
        const selectedElement = document.querySelector(`[data-category-id="${categoryId}"]`);
        if (selectedElement) {
            selectedElement.classList.add('selected-category');
        }
    }
    else {
        event.currentTarget.classList.add('selected-category');
    }
}

// Call selectCategory for the selected category on page load
document.addEventListener("DOMContentLoaded", () => {
  const categoryContainer = document.getElementById("categoryContainer");
  const selectedCategoryId = categoryContainer.getAttribute(
    "data-selected-category"
  );
  // console.log(selectedCategoryId);

  if (selectedCategoryId) {
    selectCategory(selectedCategoryId);
  }
});
