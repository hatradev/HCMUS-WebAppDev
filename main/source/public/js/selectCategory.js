function selectCategory(categoryId, event) {
    event.preventDefault(); // Prevent the default anchor behavior

    // Update hidden input value with the selected category ID
    document.getElementById('selectedCategory').value = categoryId;

    // Update the displayed category name
    // document.getElementById('selectedCategoryName').innerText = event.currentTarget.innerText;

    // Remove the 'selected-category' class from all category links
    document.querySelectorAll('.category-tree a').forEach(cat => {
        cat.classList.remove('selected-category');
    });

    // Add the 'selected-category' class to the clicked category link
    event.currentTarget.classList.add('selected-category');
    // console.log(event.currentTarget.classList);
}