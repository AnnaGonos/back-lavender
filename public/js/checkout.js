document.addEventListener('DOMContentLoaded', () => {
    const checkoutButton = document.getElementById('checkout-button');
    const orderForm = document.getElementById('orders-form');

    checkoutButton.addEventListener('click', () => {
        orderForm.style.display = 'flex';

        window.scrollBy({
            top: 300,
            behavior: 'smooth',
        });
    });
});