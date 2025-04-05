let currentAction = null;

function openModal(action) {
    currentAction = action;
    const modalMessage = document.querySelector('.modal-message');

    if (action === 'delete') {
        modalMessage.textContent = 'Подтвердите удаление товара';
    }

    document.getElementById('confirmation-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('confirmation-modal').style.display = 'none';
    currentAction = null;
}

function confirmAction() {
    try {
        if (currentAction === 'delete') {
            const deleteForm = document.getElementById('delete-form');
            if (!deleteForm) throw new Error('Форма удаления не найдена');
            deleteForm.submit();
        }
    } catch (error) {
        console.error('Ошибка при подтверждении действия:', error);
    } finally {
        closeModal();
    }
}