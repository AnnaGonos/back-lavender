async function updateCartItem(action, productId) {
    const method = action === 'remove' ? 'DELETE' : 'POST';
    try {
        const response = await fetch(`/cart/${productId}/${action}`, { method });

        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.message) {
                showPopup(errorData.message);
            }
            return;
        }

        const data = await response.json();
        if (data.updated || data.removed) {
            const itemElement = document.querySelector(`[data-product-id="${productId}"]`).closest('.cart__item');

            if (action === 'remove') {
                itemElement.remove();
            } else {
                const quantityElement = itemElement.querySelector('.cart__quantity-count');
                const currentQuantity = parseInt(quantityElement.textContent, 10);

                if (action === 'increase') {
                    quantityElement.textContent = currentQuantity + 1;
                } else if (action === 'decrease') {
                    quantityElement.textContent = currentQuantity - 1;

                    if (currentQuantity - 1 === 0) {
                        itemElement.remove();
                    }
                }
            }

            updateCartCount();
        }
    } catch (error) {
        console.error('Ошибка при обновлении корзины:', error);
    }
}

async function addToCart(productId, button) {
    try {
        const response = await fetch(`/cart/${productId}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.message) {
                showPopup(errorData.message);
            }
            return;
        }

        const parent = button.closest('.product__item, .product-main__container');
        const addButton = parent.querySelector('.product__link--cart-add');
        const inCartButton = parent.querySelector('.product__link--cart-in');

        if (addButton && inCartButton) {
            addButton.style.display = 'none';
            inCartButton.style.display = 'flex';
        }

        updateCartCount();

        showPopup('Товар успешно добавлен в корзину');
    } catch (error) {
        alert(error.message || 'Ошибка при добавлении товара в корзину');
    }
}

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

                    updateCartCount();
                }
            } catch (error) {
                console.error('Ошибка при очистке корзины:', error);
            }
        });
    }
});

async function updateCartCount() {
    try {
        const response = await fetch('/cart/count');
        if (!response.ok) {
            throw new Error('Ошибка при получении количества товаров в корзине');
        }

        const data = await response.json();
        const cartCountElements = document.querySelectorAll('.cart-count');

        if (!cartCountElements.length) {
            console.error('Элементы с классом "cart-count" не найдены');
            return;
        }

        cartCountElements.forEach(cartCountElement => {
            if (data.count > 0) {
                cartCountElement.textContent = data.count;
                cartCountElement.style.display = 'flex';
            } else {
                cartCountElement.textContent = '';
                cartCountElement.style.display = 'none';
            }
        });
    } catch (error) {
        console.error('Ошибка при обновлении счетчика корзины:', error);
    }
}

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

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.increase-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            updateCartItem('increase', productId);
        });
    });

    document.querySelectorAll('.decrease-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            updateCartItem('decrease', productId);
        });
    });

    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            updateCartItem('remove', productId);
        });
    });
});

