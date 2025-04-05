document.addEventListener('DOMContentLoaded', async () => {
    const buttons = document.querySelectorAll('.product-main__button--favorite');

    for (const button of buttons) {
        const productId = button.dataset.productId;
        const response = await fetch(`/favorites/${productId}`);
        const result = await response.json();

        const heartOutline = button.querySelector('.heart-outline');
        const heartFill = button.querySelector('.heart-fill');

        if (result.inFavorites) {
            heartOutline.style.display = 'none';
            heartFill.style.display = 'inline';
        } else {
            heartOutline.style.display = 'inline';
            heartFill.style.display = 'none';
        }
    }
});

async function toggleFavorite(productId, button) {
    try {
        const response = await fetch(`/favorites/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        const heartOutline = button.querySelector('.heart-outline');
        const heartFill = button.querySelector('.heart-fill');

        if (result.added) {
            heartOutline.style.display = 'none';
            heartFill.style.display = 'inline';
        } else {
            heartOutline.style.display = 'inline';
            heartFill.style.display = 'none';
        }

        updateFavoritesCount();
    } catch (error) {
        console.error('Ошибка при добавлении в избранное:', error);
    }
}

async function updateFavoritesCount() {
    try {
        const response = await fetch('/favorites/count');
        const data = await response.json();
        const countElement = document.querySelector('.favorites-count');

        if (data.count > 0) {
            countElement.textContent = data.count;
            countElement.style.display = 'inline';
        } else {
            countElement.style.display = 'none';
        }
    } catch (error) {
        console.error('Ошибка при обновлении счетчика:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateFavoritesCount();
});
