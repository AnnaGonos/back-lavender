document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('archived-products-container');

  async function loadArchivedProducts() {
    try {
      const response = await fetch('/api/products/archived');
      if (!response.ok) throw new Error('Ошибка загрузки данных');

      const products = await response.json();
      renderProducts(products);
    } catch (error) {
      console.error(error);
      container.innerHTML = '<p>Не удалось загрузить архивированные товары</p>';
    }
  }

  function renderProducts(products) {
    if (products.length === 0) {
      container.innerHTML = '<p>Архивированных товаров пока нет.</p>';
      return;
    }

    const html = products.map(product => `
            <div class="products-florist__item">
                <div class="products-florist__content">
                    <img src="${product.imageUrl}" alt="${product.name}" class="products-florist__img">
                    <div class="products__description">
                        <h5>${product.name}</h5>
                        ${product.discount > 0
      ? `<div class="product-florist__prices">
                                <span class="product-main__price">${product.discount} ₽</span>
                                <span class="product-main__price discount">${product.price} ₽</span>
                               </div>`
      : `<div class="product-florist__prices-florist">
                                <span class="product-main__price">${product.price} ₽</span>
                               </div>`
    }
                        <span>${product.quantityInStock} шт</span>
                    </div>
                </div>

                <div class="products-florist__modify">
                    <a href="/florist/products/${product.id}/edit" class="categories__edit-button edit-product">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                        </svg>
                    </a>
                    <button class="products__delete-button delete-product" data-id="${product.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');

    container.innerHTML = html;

    attachEventListeners();
  }

  function attachEventListeners() {
    document.querySelectorAll('.delete-product').forEach(button => {
      button.addEventListener('click', async (e) => {
        const targetButton = e.target.closest('.delete-product');

        const id = targetButton.dataset.id;

        if (!id || isNaN(+id)) {
          alert('Некорректный ID товара');
          return;
        }

        if (!confirm('Вы уверены, что хотите полностью удалить этот товар?')) return;

        try {
          const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            alert('Товар успешно удален из базы данных');
            loadArchivedProducts();
          } else {
            const errorData = await response.json();
            alert('Ошибка: ' + (errorData.message || 'Не удалось удалить товар'));
          }
        } catch (error) {
          console.error('Ошибка при удалении:', error);
        }
      });
    });
  }

  loadArchivedProducts();
});