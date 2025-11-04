document.addEventListener('DOMContentLoaded', function() {
    // Override flex styles with a more aggressive approach
    function fixGalleryImages() {
        const galleryImages = document.querySelectorAll('.recipe-page figure.gallery-image');
        galleryImages.forEach(function(figure) {
            figure.style.setProperty('display', 'block', 'important');
            figure.style.setProperty('margin', '1rem auto', 'important');
            figure.style.setProperty('flex', 'none', 'important');
            figure.style.setProperty('flex-grow', '0', 'important');
            figure.style.setProperty('flex-basis', 'auto', 'important');
            figure.style.setProperty('flex-shrink', '0', 'important');
            figure.style.setProperty('width', 'auto', 'important');
            figure.style.setProperty('max-width', 'calc(100% - 2rem)', 'important');
            figure.style.setProperty('padding', '0 1rem', 'important');
            figure.style.setProperty('box-sizing', 'border-box', 'important');
            figure.style.setProperty('text-align', 'center', 'important');
        });
    }

    // Run immediately
    fixGalleryImages();

    // Run again after a short delay to catch any JS that might run later
    setTimeout(fixGalleryImages, 100);
    setTimeout(fixGalleryImages, 500);
    setTimeout(fixGalleryImages, 1000);
    setTimeout(fixGalleryImages, 2000);

    // Set up a MutationObserver to catch any future changes
    const observer = new MutationObserver(function(mutations) {
        let shouldFix = false;
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const target = mutation.target;
                if (target.classList.contains('gallery-image')) {
                    shouldFix = true;
                }
            }
        });
        if (shouldFix) {
            setTimeout(fixGalleryImages, 10);
        }
    });

    // Start observing
    const recipePage = document.querySelector('.recipe-page');
    if (recipePage) {
        observer.observe(recipePage, {
            attributes: true,
            attributeFilter: ['style'],
            subtree: true
        });
    }
});