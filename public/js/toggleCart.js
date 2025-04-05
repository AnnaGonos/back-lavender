async function updateCartCount() {
    try {
        const response = await fetch('/cart/count');
        const data = await response.json();

        const cartCountElement = document.getElementById('cart-count');
        if (!cartCountElement) {
            console.error('Элемент с id="cart-count" не найден');
            return;
        }

        if (data.count > 0) {
            cartCountElement.textContent = data.count;
            cartCountElement.style.display = 'flex';
        } else {
            cartCountElement.textContent = '';
            cartCountElement.style.display = 'none';
        }
    } catch (error) {
        console.error('Ошибка при обновлении счетчика корзины:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

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
            throw new Error(errorData.message || 'Ошибка при добавлении товара в корзину');
        }

        const parent = button.closest('.product__item');
        const addButton = parent.querySelector('.product__link--cart-add');
        const inCartButton = parent.querySelector('.product__link--cart-in');

        if (addButton && inCartButton) {
            addButton.style.display = 'none';
            inCartButton.style.display = 'flex';
        }
    } catch (error) {
        alert(error.message);
    }
}

function goToCart(button) {
    window.location.href = '/cart';
}

async function removeFromCart(productId, button) {
    try {
        const response = await fetch(`/cart/${productId}/remove`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при удалении товара из корзины');
        }

        const parent = button.closest('.product__item');
        const addButton = parent.querySelector('.product__link--cart-add');
        const removeButton = parent.querySelector('.product__link--cart-remove');

        if (addButton && removeButton) {
            removeButton.style.display = 'none';
            addButton.style.display = 'inline-block';
        }
    } catch (error) {
        alert(error.message);
    }
}