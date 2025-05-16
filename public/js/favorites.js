export async function toggleFavorite(productId, button) {
  try {
    const response = await fetch(`/api/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка при обновлении статуса избранного');
    }

    const result = await response.json();
    const isAdded = result.added;

    const heartOutline = button.querySelector('.heart-outline');
    const heartFill = button.querySelector('.heart-fill');

    if (isAdded) {
      heartOutline.style.display = 'none';
      heartFill.style.display = 'inline';
      console.log(`Товар с ID ${productId} добавлен в избранное`);
    } else {
      heartOutline.style.display = 'inline';
      heartFill.style.display = 'none';
      console.log(`Товар с ID ${productId} удален из избранного`);
    }
  } catch (error) {
    console.error(error.message);
    alert('Не удалось обновить статус избранного. Попробуйте позже.');
  }
}
