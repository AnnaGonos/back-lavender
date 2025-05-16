document.addEventListener('DOMContentLoaded', () => {
    const clearCartButton = document.getElementById('clear-cart');

    if (clearCartButton) {
        clearCartButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/cart/clear', { method: 'DELETE' });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (errorData.message) {
                        showPopup(errorData.message);
                    }
                    return;
                }

                const data = await response.json();
                if (data.cleared) {
                    const cartList = document.querySelector('.cart__list');
                    cartList.innerHTML = '<p>Корзина пуста.</p>';
                }
            } catch (error) {
                console.error('Ошибка при очистке корзины:', error);
            }
        });
    }
});

function showPopup(message) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup__content">
            <p>${message}</p>
            <span class="popup__close">&times;</span>
        </div>
    `;

    document.body.appendChild(popup);

    const closeButton = popup.querySelector('.popup__close');
    closeButton.addEventListener('click', () => {
        popup.remove();
    });

    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.remove();
        }
    });
}

