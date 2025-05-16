function formatOrderDetails(orderData) {
    return `
        🔔 Тестовый заказ!

        Имя получателя: ${orderData.recipientName}
        Телефон: ${orderData.recipientPhone}
        Тип доставки: ${orderData.deliveryType === 'courier' ? 'Курьерская доставка' : 'Самовывоз'}
        Дата доставки: ${orderData.deliveryDate}
        Интервал доставки: ${orderData.deliveryInterval}
        Адрес доставки: ${orderData.deliveryAddress || 'Не указан'}
        Способ оплаты: ${orderData.paymentMethod === 'CASH' ? 'Наличными' : 'Онлайн'}
        Общая сумма: ${orderData.totalAmount} ₽

        📦 Товары:
        ${orderData.items.map(item => `- ${item.product.name} (${item.quantity} шт.)`).join('\n')}
    `;
}