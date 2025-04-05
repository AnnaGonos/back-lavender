async function updateCartItem(action, productId) {
    const response = await fetch(`/cart/${productId}/${action}`, { method: 'POST' });
    if (response.ok) {
        location.reload();
    }
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
});