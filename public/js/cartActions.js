async function updateCartCount() {
    const response = await fetch('/cart/count');
    const data = await response.json();
    document.getElementById('cart-count').textContent = data.count || '';
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

document.querySelectorAll('.cart__actions img').forEach(button => {
    button.addEventListener('click', async () => {
        await fetch(`/cart/${button.dataset.productId}`, { method: 'DELETE' });
        updateCartCount();
    });
});