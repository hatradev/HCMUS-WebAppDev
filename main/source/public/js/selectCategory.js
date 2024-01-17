function selectCategory(categoryId, event) {
  if (event) {
      event.preventDefault(); // Prevent the default anchor behavior
  }

  const selectedElement = event ? event.currentTarget : document.querySelector(`[data-category-id="${categoryId}"]`);

  // Check if the clicked category is already selected
  if (selectedElement && selectedElement.classList.contains('selected-category')) {
      // Deselect the category
      selectedElement.classList.remove('selected-category');
      document.getElementById('selectedCategory').value = '';
  } else {
      // Proceed with selecting the category

      // Remove the 'selected-category' class from all category links
      document.querySelectorAll('.category-tree a').forEach(cat => {
          cat.classList.remove('selected-category');
      });

      document.getElementById('selectedCategory').value = categoryId;

      // Add 'selected-category' class to the clicked category
      if (selectedElement) {
          selectedElement.classList.add('selected-category');
      }
  }
}

// Call selectCategory for the selected category on page load
document.addEventListener("DOMContentLoaded", () => {
  const categoryContainer = document.getElementById("categoryContainer");
  const selectedCategoryId = categoryContainer.getAttribute("data-selected-category");

  if (selectedCategoryId) {
      selectCategory(selectedCategoryId);
  }
});