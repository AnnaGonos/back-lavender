const eventSource = new EventSource('/orders/updates');

eventSource.onmessage = ({ data }) => {
    console.log('Общее уведомление:', JSON.parse(data));
};

eventSource.addEventListener('ORDER_STATUS_UPDATE', (event) => {
    const data = JSON.parse(event.data);
    console.log('Статус заказа изменен:', data);
    showNotification(`Статус заказа #${data.orderId}: ${statusToText(data.newStatus)}`);
});

