function updateSlider(value, id) {
    var lowerInput = document.getElementById('lower');
    var upperInput = document.getElementById('upper');

    if (id === 'lower') {
        if (parseInt(value) > parseInt(upperInput.value)) {
            lowerInput.value = upperInput.value;
        }
    } else {
        if (parseInt(value) < parseInt(lowerInput.value)) {
            upperInput.value = lowerInput.value;
        }
    }
}