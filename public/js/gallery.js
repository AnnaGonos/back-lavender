const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentIndex = 0;

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentIndex = index;
        openLightbox();
    });
});

function openLightbox() {
    const currentImage = galleryItems[currentIndex].querySelector('.product-main__gallery-img');
    const currentCaption = galleryItems[currentIndex].querySelector('.gallery-description').textContent;

    lightboxImg.src = currentImage.src;
    lightboxCaption.textContent = currentCaption;
    lightbox.style.display = 'block';
}

closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
});

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox();
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox();
});

lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
        lightbox.style.display = 'none';
    }
});