

function createCategoryCard(category) {
  const template = `
    <div class="categories__item" data-category-id="${category.id}">
      <h5>${category.name}</h5>
      <span>${category.description || 'Нет описания'}</span>
      <a href="/florist/categories/${category.id}/edit" class="categories__edit-button">Редактировать</a>
      <form class="categories__delete-form" action="/florist/categories/${category.id}?_method=DELETE" method="POST">
        <button type="submit" class="categories__delete-button">Удалить</button>
      </form>
    </div>
  `;

  const card = document.createElement('div');
  card.innerHTML = template.trim();
  const categoryElement = card.firstElementChild;

  // Обработка формы удаления
  const form = categoryElement.querySelector('form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const isConfirmed = confirm('Вы уверены, что хотите удалить эту категорию?');
    if (!isConfirmed) return;

    try {
      const deleteResponse = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (deleteResponse.ok) {
        Toastify({
          text: 'Категория успешно удалена!',
          duration: 3000,
          gravity: 'top',
          position: 'center',
          style: {
            background: 'green',
          },
        }).showToast();

        loadCategories(currentPage);
      } else {
        const error = await deleteResponse.json();
        alert(error.message || 'Не удалось удалить категорию');
      }
    } catch (err) {
      console.error('Ошибка:', err.message);
      Toastify({
        text: 'Ошибка при удалении категории',
        duration: 3000,
        gravity: 'top',
        position: 'center',
        style: {
          background: 'red',
        },
      }).showToast();
    }
  });

  return categoryElement;
}

document.getElementById('prev-page')?.addEventListener('click', () => {
  if (currentPage > 1) {
    loadCategories(currentPage - 1);
  }
});

document.getElementById('next-page')?.addEventListener('click', () => {
  loadCategories(currentPage + 1);
});

document.addEventListener('DOMContentLoaded', () => {
  loadCategories(currentPage);

  // SSE — подписка на обновления
  const eventSource = new EventSource('/category/updates');

  eventSource.onmessage = (event) => {
    const message = event.data;
    if (message) {
      Toastify({
        text: message,
        duration: 5000,
        gravity: 'top',
        position: 'right',
        style: {
          background: 'linear-gradient(to right, #00b09b, #96c93d)',
        },
      }).showToast();

      // Перезагружаем текущую страницу для актуального отображения
      loadCategories(currentPage);
    }
  };

  eventSource.onerror = (error) => {
    console.error('Ошибка SSE:', error);
    eventSource.close();
  };
});