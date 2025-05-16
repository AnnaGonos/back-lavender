function createTestOrder() {
    return {
        recipientName: 'Тестовый Покупатель',
        recipientPhone: '+79991234567',
        deliveryType: 'courier',
        deliveryDate: '2025-04-01',
        deliveryInterval: '12:00-15:00',
        paymentMethod: 'CASH',
        deliveryAddress: 'г. Спб, ул. проспект Маршала-жукова, д. 60',
        totalAmount: 5000,
        items: [
            { product: { name: 'Розы красные' }, quantity: 10 },
            { product: { name: 'Хризантемы белые' }, quantity: 5 },
        ],
    };
}