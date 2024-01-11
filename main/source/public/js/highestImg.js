document.addEventListener("DOMContentLoaded", function() {
    const carouselImages = document.querySelectorAll("#productImageCarousel .carousel-item img");
    let maxHeight = 0;

    // Find the maximum height
    carouselImages.forEach(img => {
        maxHeight = Math.max(maxHeight, img.naturalHeight);
    });

    // Set all images to the maximum height
    carouselImages.forEach(img => {
        img.style.height = maxHeight + "px";
    });
});
