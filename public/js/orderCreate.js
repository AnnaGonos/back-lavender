document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event triggered');

    let baseTotal = parseFloat(document.getElementById('totalItemsCost').textContent.replace(/[^0-9.-]+/g, ''));
    let bonusPoints = parseFloat(document.getElementById('availableBonus').textContent.replace(',', '.'));

    console.log('Base Total:', baseTotal);
    console.log('Bonus Points:', bonusPoints);

    const totalItemsCost = document.getElementById('totalItemsCost');
    const deliveryCost = document.getElementById('deliveryCost');
    const finalTotal = document.getElementById('finalTotal');
    const finalTotalInput = document.getElementById('finalTotalInput');

    let deliveryType = 'courier';
    let bonusAction = 'accumulate';

    function calculateDeliveryCost(total) {
        if (deliveryType === 'pickup') return 0;
        if (total >= 15000) return 0;
        if (total >= 7000) return 350;
        return 400;
    }

    function updateTotals() {
        let total = baseTotal;
        let bonusPointsUsed = 0;

        if (bonusAction === 'spend') {
            bonusPointsUsed = Math.min(bonusPoints, baseTotal);
            total = Math.max(total - bonusPointsUsed, 0);
        }

        const delivery = calculateDeliveryCost(total);
        total += delivery;

        console.log('Итоговая сумма:', total.toFixed(2));

        deliveryCost.textContent = `${delivery.toFixed(2)} ₽`;
        finalTotal.textContent = `${total.toFixed(2)} ₽`;
        finalTotalInput.value = total.toFixed(2);
    }

    document.querySelectorAll('input[name="bonusAction"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            console.log('Выбрано действие с бонусами:', event.target.value);
            bonusAction = event.target.value;
            updateTotals();
        });
    });

    document.getElementById('deliveryType').addEventListener('change', (event) => {
        console.log('Выбран тип доставки:', event.target.value);
        deliveryType = event.target.value;

        const deliveryDetails = document.getElementById('deliveryDetails');
        const deliveryAddress = document.getElementById('deliveryAddress');

        if (deliveryType === 'courier') {
            deliveryDetails.style.display = 'flex';
            deliveryAddress.removeAttribute('readonly');
            deliveryAddress.value = '';
        } else if (deliveryType === 'pickup') {
            deliveryDetails.style.display = 'flex';
            deliveryAddress.setAttribute('readonly', true);
            deliveryAddress.value = 'Партизанск, ул.Замараева, д.9';
        }

        updateTotals();
    });

    updateTotals();
});
