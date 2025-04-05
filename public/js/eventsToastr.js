toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-top-right',
};

const eventSource = new EventSource('/products/events');

eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    toastr.info(data.message, 'Обновление');
};

eventSource.onerror = () => {
    console.error('Ошибка соединения SSE');
};