document.addEventListener("DOMContentLoaded", function () {
    const slider = document.getElementById("slider-range");
    const handleLeft = slider.getElementsByClassName("ui-slider-handle")[0];
    const handleRight = slider.getElementsByClassName("ui-slider-handle")[1];
    const range = slider.getElementsByClassName("ui-slider-range")[0];

    const priceFrom = document.getElementById("price_form");
    const priceTo = document.getElementById("price_to");

    const minPrice = priceFrom.getAttribute('data-size');
    const maxPrice = priceTo.getAttribute('data-size');
    // console.log(minPrice, maxPrice);

    // priceFrom.setAttribute('data-size', minPrice.toString());
    // priceTo.setAttribute('data-size', maxPrice.toString());

    // Initialize the handles and range positions
    initializeSlider();

    handleLeft.addEventListener("mousedown", startDragLeft);
    handleRight.addEventListener("mousedown", startDragRight);

    function initializeSlider() {
        // Initialize the left handle position based on min price
        handleLeft.style.left = calculatePositionPercent(minPrice) + "%";

        // Calculate the right handle width as a percentage of the slider width
        let handleWidthPercent = handleRight.offsetWidth / slider.offsetWidth * 100;

        // Initialize the right handle position based on max price, adjusted for handle width
        handleRight.style.left = (calculatePositionPercent(maxPrice) - handleWidthPercent) + "%";

        updateRange();
        updatePriceDisplay();
    }
    function calculatePositionPercent(price) {
        // Calculate the position percentage based on the price
        return ((price - minPrice) / (maxPrice - minPrice)) * 100;
    }
    function updatePriceDisplay() {
        // Update the display for both prices
        priceFrom.textContent = formatPrice(minPrice) + " ₫";
        priceTo.textContent = formatPrice(maxPrice) + " ₫";
    }

    function startDragLeft(e) {
        e.preventDefault();
        document.addEventListener("mousemove", dragLeft);
        document.addEventListener("mouseup", stopDragLeft);
    }

    function startDragRight(e) {
        e.preventDefault();
        document.addEventListener("mousemove", dragRight);
        document.addEventListener("mouseup", stopDragRight);
    }

    function dragLeft(e) {
        e.preventDefault();

        let newLeftPosition = Math.min(
            Math.max((e.clientX - slider.getBoundingClientRect().left) / slider.offsetWidth * 100, 0), // Constrain to 0%
            parseFloat(handleRight.style.left)
        );
        handleLeft.style.left = newLeftPosition + "%";
        updateRange();
        updatePriceFrom();
    }
    
    function dragRight(e) {
        e.preventDefault();

        // Calculate the percentage of the cursor position within the slider
        let cursorPercent = (e.clientX - slider.getBoundingClientRect().left) / slider.offsetWidth * 100;
    
        // Calculate the width of the handle as a percentage of the slider width
        let handleWidthPercent = handleRight.offsetWidth / slider.offsetWidth * 100;
    
        // Adjust the right position to account for the handle width, ensuring it does not exceed the maximum
        let newRightPosition = Math.min(Math.max(cursorPercent, parseFloat(handleLeft.style.left)), 100 - handleWidthPercent);
    
        handleRight.style.left = newRightPosition + "%";
        updateRange();
        updatePriceTo();
    } 
    
    function updateRange() {
        let leftPercent = parseFloat(handleLeft.style.left);
        let rightPercent = parseFloat(handleRight.style.left);
    
        range.style.left = leftPercent + "%";
        range.style.width = (rightPercent - leftPercent) + "%";
    }

    function stopDragLeft() {
        document.removeEventListener("mousemove", dragLeft);
        document.removeEventListener("mouseup", stopDragLeft);
    }

    function stopDragRight() {
        document.removeEventListener("mousemove", dragRight);
        document.removeEventListener("mouseup", stopDragRight);
    }

    function updatePriceFrom() {
        let percent = parseFloat(handleLeft.style.left) / 100;
        let price = minPrice + percent * (maxPrice - minPrice);
        priceFrom.textContent = formatPrice(price) + " ₫";
        priceFrom.setAttribute('data-size', price.toString()); // Store the price in the data-size attribute
    }

    function updatePriceTo() {
        let handleWidthPercent = handleRight.offsetWidth / slider.offsetWidth * 100;
        let rightPositionPercent = parseFloat(handleRight.style.left);
        let effectiveMaxPosition = 100 - handleWidthPercent;
        let percent = rightPositionPercent / effectiveMaxPosition;
        let price = minPrice + percent * (maxPrice - minPrice);
        priceTo.textContent = formatPrice(price) + " ₫";
        priceTo.setAttribute('data-size', price.toString()); // Store the price in the data-size attribute
    }

    function formatPrice(price) {
        let roundedPrice = Math.round(price); // Round to the nearest whole number
        return roundedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});
