document.addEventListener('DOMContentLoaded', () => {
  const reviewsContainer = document.querySelector('.reviews__content');

  reviewsContainer.addEventListener('click', async (e) => {
    const target = e.target;

    const reviewElement = target.closest('[data-review-id]');
    if (!reviewElement) return;
    const reviewId = reviewElement.dataset.reviewId;

    if (target.dataset.action === 'edit') {
      const response = await fetch(`/reviews/${reviewId}`, { method: 'GET' });
      if (response.ok) {
        const reviewData = await response.json();
        openEditReviewModal(reviewData);
      } else {
        alert('Ошибка при загрузке отзыва');
      }
    }

    if (target.dataset.action === 'delete') {
      const response = await fetch(`/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        reviewElement.remove();
      } else {
        alert('Ошибка при удалении отзыва');
      }
    }
  });

  function openEditReviewModal(reviewData) {
    const modal = document.createElement('div');
    modal.innerHTML = `
            <div class="modal">
                <h3>Редактировать отзыв</h3>
                <form id="edit-review-form">
                    <label for="edit-review-text">Ваш отзыв:</label>
                    <textarea id="edit-review-text" name="description">${reviewData.description}</textarea>
                    <label for="edit-review-rating">Оценка:</label>
                    <input type="number" id="edit-review-rating" name="rating" value="${reviewData.rating}" min="1" max="5">
                    <div class="modal__buttons">
                        <button type="submit" class="modal__button modal__button--primary">Сохранить</button>
                        <button type="button" class="modal__button modal__button--secondary" id="cancel-edit">Отмена</button>
                    </div>
                </form>
            </div>
        `;
    document.body.appendChild(modal);

    const editForm = modal.querySelector('#edit-review-form');
    const cancelButton = modal.querySelector('#cancel-edit');

    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const updatedDescription = modal
        .querySelector('#edit-review-text')
        .value.trim();
      const updatedRating = Number(
        modal.querySelector('#edit-review-rating').value,
      );

      if (
        !updatedDescription ||
        isNaN(updatedRating) ||
        updatedRating < 1 ||
        updatedRating > 5
      ) {
        alert(
          'Пожалуйста, заполните все поля корректно. Оценка должна быть числом от 1 до 5.',
        );
        return;
      }

      try {
        const response = await fetch(`/reviews/${reviewData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: updatedDescription,
            rating: updatedRating,
          }),
        });

        if (response.ok) {
          location.reload();
        } else {
          const errorData = await response.json();
          alert(`Ошибка при сохранении изменений: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при отправке данных.');
      }

      modal.remove();
    });

    cancelButton.addEventListener('click', () => {
      modal.remove();
    });
  }
});
