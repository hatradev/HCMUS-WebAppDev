document.addEventListener('DOMContentLoaded', () => {
    const dropdownButton = document.getElementById('dropdownMenuButton1');

    document.getElementById('price-low-high').addEventListener('click', (event) => {
        event.preventDefault();
        handleDropdownSelection('Thấp đến cao', dropdownButton);
    });

    document.getElementById('price-high-low').addEventListener('click', (event) => {
        event.preventDefault();
        handleDropdownSelection('Cao đến thấp', dropdownButton);
    });
});

function handleDropdownSelection(optionText, dropdownButton) {
    // Set the button text to the selected option's text
    dropdownButton.textContent = optionText;

    // Example: Perform sorting based on the selected option
    // sortProducts(optionText); // Function to sort products (to be implemented)
}