document.querySelectorAll('.faq__title').forEach((title) => {
    title.addEventListener('click', function() {
        const content = title.nextElementSibling;

        if (content.style.display === 'none' || content.style.display === '') {
            content.style.display = 'flex';
        } else {
            content.style.display = 'none';
        }
    });
});

