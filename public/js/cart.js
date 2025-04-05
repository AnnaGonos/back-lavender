document.addEventListener('DOMContentLoaded', () => {
    const deliveryRadios = document.querySelectorAll('input[name="deliveryType"]');
    const totalSumElement = document.getElementById('total-sum');
    const deliveryCostElement = document.getElementById('delivery-cost');
    const finalTotalElement = document.getElementById('final-total');
    const finalTotalInput = document.getElementById('final-total-input');

    if (!totalSumElement || !deliveryCostElement || !finalTotalElement || !finalTotalInput) {
        console.error('Не найдены необходимые элементы на странице');
        return;
    }

    const originalSum = parseFloat(document.getElementById('original-sum').textContent.replace(/[^0-9.-]+/g, ''));
    const discountAmount = parseFloat(document.getElementById('discount-amount').textContent.replace(/[^0-9.-]+/g, ''));
    const availableBonus = parseFloat(document.getElementById('available-bonus').textContent.replace(',', '.'));
    let spendBonus = 0;

    function calculateDeliveryCost(totalAmount) {
        if (totalAmount < 6000) {
            return 350;
        } else if (totalAmount >= 6000 && totalAmount < 15000) {
            return 300;
        }
        return 0;
    }

    function updateTotalSum() {
        const selectedDeliveryType = document.querySelector('input[name="deliveryType"]:checked').value;
        const totalWithoutBonuses = originalSum - discountAmount;
        const total = totalWithoutBonuses - spendBonus;

        let deliveryCost = 0;

        if (selectedDeliveryType === 'courier') {
            deliveryCost = calculateDeliveryCost(total);
        }

        const finalTotal = total + deliveryCost;

        totalSumElement.textContent = total.toFixed(2) + ' ₽';
        deliveryCostElement.textContent = deliveryCost.toFixed(2) + ' ₽';
        finalTotalElement.textContent = finalTotal.toFixed(2) + ' ₽';

        finalTotalInput.value = finalTotal.toFixed(2);
    }

    deliveryRadios.forEach(radio => {
        radio.addEventListener('change', updateTotalSum);
    });

    updateTotalSum();
});