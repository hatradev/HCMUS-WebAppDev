const MIN_GAP_PERCENT = 5; // Minimum gap between the handles as a percentage of the slider width

document.addEventListener("DOMContentLoaded", function () {
    // console.log('mojiUpdateSlider.js loaded');

    const slider = document.getElementById("slider-range");
    const handleLeft = slider.getElementsByClassName("ui-slider-handle")[0];
    const handleRight = slider.getElementsByClassName("ui-slider-handle")[1];
    // console.log(handleLeft, handleRight);
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
    // console.log('mojiUpdateSlider.js loaded');

    // function initializeSlider() {
    //     // Initialize the left handle position based on min price
    //     handleLeft.style.left = calculatePositionPercent(minPrice) + "%";
    
    //     // For the right handle, consider the handle's width for alignment
    //     let rightHandlePercent = calculatePositionPercent(maxPrice);
    //     rightHandlePercent = Math.min(rightHandlePercent, 100 - getHandleWidthPercent());
    //     handleRight.style.left = rightHandlePercent + "%";
    
    //     updateRange();
    //     updatePriceDisplay();
    // }

    function initializeSlider() {
        handleLeft.style.left = calculatePositionPercent(minPrice) + "%";
        handleRight.style.left = calculatePositionPercent(maxPrice) + "%";
    
        updateRange();
        updatePriceDisplay();
    }

    function getHandleWidthPercent() {
        // Assuming the handle and slider elements are correctly referenced
        return handleRight.offsetWidth / slider.offsetWidth * 100;
    }
    function adjustHandlePositionForWidth(handlePositionPercent) {
        const handleWidthPercent = getHandleWidthPercent();
        return Math.min(handlePositionPercent, 100 - handleWidthPercent);
    }
    
    // function calculatePositionPercent(price) {
    //     // Calculate the position percentage based on the price
    //     // Ensure that maxPrice corresponds to 100%
    //     let priceRange = maxPrice - minPrice;
    //     // console.log(priceRange);
    //     let percent = priceRange === 0 ? 0 : ((price - minPrice) / priceRange) * 100
    //     // console.log(percent);

    //     return percent;
    // }

    function calculatePositionPercent(price) {
        let priceRange = maxPrice - minPrice;
        let scaledMax = 94.4853; // New effective maximum percentage
        let percent = priceRange === 0 ? 0 : ((price - minPrice) / priceRange) * scaledMax;

        // console.log(percent);

        return percent;
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
        // console.log('startDragRight');

        document.addEventListener("mousemove", dragRight);
        document.addEventListener("mouseup", stopDragRight);
    }

    // function dragLeft(e) {
    //     e.preventDefault();

    //     let newLeftPosition = Math.min(
    //         Math.max((e.clientX - slider.getBoundingClientRect().left) / slider.offsetWidth * 100, 0), // Constrain to 0%
    //         parseFloat(handleRight.style.left)
    //     );
    //     handleLeft.style.left = newLeftPosition + "%";
    //     updateRange();
    //     updatePriceFrom();
    // }

    // function dragLeft(e) {
    //     e.preventDefault();
    //     // console.log('dragLeft');
    
    //     let newLeftPosition = (e.clientX - slider.getBoundingClientRect().left) / slider.offsetWidth * 100;
    
    //     // Ensure the left handle does not go past the right handle
    //     let maxLeftPosition = parseFloat(handleRight.style.left);
    //     newLeftPosition = Math.min(Math.max(newLeftPosition, 0), maxLeftPosition);
    
    //     handleLeft.style.left = newLeftPosition + "%";
    //     updateRange();
    //     updatePriceFrom();
    // } 

    // function dragLeft(e) {
    //     e.preventDefault();
    
    //     let newLeftPosition = (e.clientX - slider.getBoundingClientRect().left) / slider.offsetWidth * 94.4853;
    //     newLeftPosition = Math.min(Math.max(newLeftPosition, 0), parseFloat(handleRight.style.left));
    
    //     handleLeft.style.left = newLeftPosition + "%";

    //     console.log(handleLeft.style.left);

    //     updateRange();
    //     updatePriceFrom();
    // }

    function dragLeft(e) {
        e.preventDefault();
    
        let newLeftPosition = (e.clientX - slider.getBoundingClientRect().left) / slider.offsetWidth * 94.4853;
    
        // Calculate the maximum left position (left handle cannot exceed right handle minus the gap)
        let maxLeftPosition = parseFloat(handleRight.style.left) - MIN_GAP_PERCENT;
        newLeftPosition = Math.min(Math.max(newLeftPosition, 0), maxLeftPosition);
    
        handleLeft.style.left = newLeftPosition + "%";
        // console.log(handleLeft.style.left);
    
        updateRange();
        updatePriceFrom();
    }
    
    
    // function dragRight(e) {
    //     e.preventDefault();
    //     // console.log('dragRight');
    
    //     let cursorPercent = (e.clientX - slider.getBoundingClientRect().left) / slider.offsetWidth * 100;
    
    //     // Limit the right handle's position based on the left handle's position and the slider's maximum
    //     let maxRightPosition = 100 - getHandleWidthPercent();
    //     cursorPercent = Math.min(Math.max(cursorPercent, parseFloat(handleLeft.style.left)), maxRightPosition);
    
    //     handleRight.style.left = cursorPercent + "%";
    //     console.log(handleRight.style.left);

    //     updateRange();
    //     updatePriceTo();
    // }

    // function dragRight(e) {
    //     e.preventDefault();
    
    //     let cursorPercent = (e.clientX - slider.getBoundingClientRect().left) / slider.offsetWidth * 94.4853;
    //     cursorPercent = Math.min(Math.max(cursorPercent, parseFloat(handleLeft.style.left)), 94.4853);
    
    //     handleRight.style.left = cursorPercent + "%";

    //     // console.log(handleRight.style.left);

    //     updateRange();
    //     updatePriceTo();
    // }

    function dragRight(e) {
        e.preventDefault();
    
        let cursorPercent = (e.clientX - slider.getBoundingClientRect().left) / slider.offsetWidth * 94.4853;
    
        // Calculate the minimum right position (right handle cannot be closer than the gap to the left handle)
        let minRightPosition = parseFloat(handleLeft.style.left) + MIN_GAP_PERCENT;
        cursorPercent = Math.min(Math.max(cursorPercent, minRightPosition), 94.4853);
    
        handleRight.style.left = cursorPercent + "%";
        // console.log(handleRight.style.left);
    
        updateRange();
        updatePriceTo();
    }
    
    
    function updateRange() {
        let leftPercent = parseFloat(handleLeft.style.left);
        let rightPercent = parseFloat(handleRight.style.left);
    
        range.style.left = leftPercent + "%";
        range.style.width = (rightPercent - leftPercent) + "%";
    }

    // function updateRange() {
    //     let leftPercent = parseFloat(handleLeft.style.left);
    //     let rightPercent = parseFloat(handleRight.style.left);
    
    //     // Calculate the width of the range as the difference between the right and left handle positions
    //     let rangeWidth = rightPercent - leftPercent;
    
    //     // Set the range's left position and width
    //     range.style.left = leftPercent + "%";
    //     range.style.width = rangeWidth + "%";
    // }

    function stopDragLeft() {
        document.removeEventListener("mousemove", dragLeft);
        document.removeEventListener("mouseup", stopDragLeft);
    }

    function stopDragRight() {
        document.removeEventListener("mousemove", dragRight);
        document.removeEventListener("mouseup", stopDragRight);
    }

    // function updatePriceFrom() {
    //     let percent = parseFloat(handleLeft.style.left) / 100;
    //     let price = minPrice + percent * (maxPrice - minPrice);
    //     priceFrom.textContent = formatPrice(price) + " ₫";
    //     priceFrom.setAttribute('data-size', price.toString()); // Store the price in the data-size attribute
    // }

    // function updatePriceFrom() {
    //     let leftPositionPercent = parseFloat(handleLeft.style.left) / 100;
    //     let price = minPrice + leftPositionPercent * (maxPrice - minPrice);
    //     price = Math.round(price); // Round to the nearest integer for a more accurate representation
    //     priceFrom.textContent = formatPrice(price) + " ₫";
    //     priceFrom.setAttribute('data-size', price.toString());
    // }    

    function updatePriceFrom() {
        let scaledMax = 94.4853;
        let leftPositionPercent = (parseFloat(handleLeft.style.left) / scaledMax) * 100;
        let price = minPrice + leftPositionPercent * (maxPrice - minPrice) / 100;
        price = Math.round(price); // Round to the nearest integer
        priceFrom.textContent = formatPrice(price) + " ₫";
        priceFrom.setAttribute('data-size', price.toString());
    }

    // function updatePriceTo() {
    //     let rightPositionPercent = parseFloat(handleRight.style.left) / (100 - getHandleWidthPercent()) * 100;
    //     let price = minPrice + rightPositionPercent * (maxPrice - minPrice) / 100;
    //     priceTo.textContent = formatPrice(price) + " ₫";
    //     priceTo.setAttribute('data-size', price.toString());
    // }

    // function updatePriceTo() {
    //     let rightPositionPercent = parseFloat(handleRight.style.left) / 100;
    //     let price = minPrice + rightPositionPercent * (maxPrice - minPrice);
    //     price = Math.round(price); // Round to the nearest integer for a more accurate representation
    //     priceTo.textContent = formatPrice(price) + " ₫";
    //     priceTo.setAttribute('data-size', price.toString());
    // }

    function updatePriceTo() {
        let scaledMax = 94.4853;
        let rightPositionPercent = (parseFloat(handleRight.style.left) / scaledMax) * 100;
        let price = minPrice + rightPositionPercent * (maxPrice - minPrice) / 100;
        price = Math.round(price); // Round to the nearest integer
        priceTo.textContent = formatPrice(price) + " ₫";
        priceTo.setAttribute('data-size', price.toString());
    }

    function formatPrice(price) {
        let roundedPrice = Math.round(price); // Round to the nearest whole number
        return roundedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});
