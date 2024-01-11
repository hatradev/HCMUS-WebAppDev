function updateRangeSlider(slider) {
    const min = slider.min;
    const max = slider.max;
    const value = slider.value;

    const thumbLeft = document.getElementById('thumbLeft');
    const thumbRight = document.getElementById('thumbRight');

    thumbLeft.style.left = ((value - min) / (max - min) * 100) + '%';
    thumbRight.style.right = (100 - (value - min) / (max - min) * 100) + '%';
}

// Initialize the position of the thumbs
updateRangeSlider(document.getElementById('rangeInput'));