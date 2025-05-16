export async function addToCart(productId, button) {
    try {
        const response = await fetch(`/api/${productId}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Ошибка при добавлении товара в корзину');
        }

        const result = await response.json();
        if (result.added) {
            button.style.display = 'none';
            const cartInButton = button.nextElementSibling;
            if (cartInButton) {
                cartInButton.style.display = 'inline-block';
            }
            console.log(`Товар с ID ${productId} успешно добавлен в корзину`);
        }
    } catch (error) {
        console.error(error.message);
        alert('Не удалось добавить товар в корзину. Попробуйте позже.');
    }
}

export function goToCart() {
    console.log('Переход в корзину');
    window.location.href = '/cart';
}