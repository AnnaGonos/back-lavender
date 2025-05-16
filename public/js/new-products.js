import { addToCart, goToCart } from './cart.js';
import { toggleFavorite } from './favorites.js';

document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/products/new')
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById('products-container');
      if (data.products && data.products.length > 0) {
        data.products.forEach((product) => {
          const cartButtonStyle = product.inCart ? 'display: none;' : '';
          const cartInButtonStyle = product.inCart ? '' : 'display: none;';
          const heartOutlineStyle = product.isFavorite ? 'display: none;' : '';
          const heartFillStyle = product.isFavorite ? '' : 'display: none;';

          const actionButtons = product.quantityInStock > 0
            ? `
                <a href="/product/${product.id}" class="product__link product__link--details">Подробнее</a>
                <button 
                  class="product__link product__link--cart-add product__link--cart" 
                  onclick="addToCart(${product.id}, this); return false;" 
                  style="${cartButtonStyle}"
                >
                  В корзину
                </button>
                <button 
                  class="product__link product__link--cart product__link--cart-in" 
                  onclick="goToCart(); return false;" 
                  style="${cartInButtonStyle}"
                >
                  В корзине
                </button>
              `
            : `
                <a href="/catalog" class="product__link product__link--similar">Товар закончился</a>
              `;

          const productHTML = `
            <article class="product__item ${product.quantityInStock <= 0 ? 'product__item-blur' : ''}">
              <a href="${product.quantityInStock > 0 ? `/product/${product.id}` : '/catalog'}">
                <img src="${product.imageUrl}" alt="${product.imageDescription || 'Картинка к товару'}" class="product__image">
              </a>
              <div class="product__description">
                <div class="product__name-header">
                  <p class="product__name">${product.name}</p>
                  <button 
                    class="product-main__button product-main__button--favorite" 
                    data-product-id="${product.id}" 
                    onclick="toggleFavorite(${product.id}, this)"
                  >
                    <svg class="heart-icon heart-outline" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" style="${heartOutlineStyle}">
                      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"></path>
                    </svg>
                    <svg class="heart-icon heart-fill" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="red" viewBox="0 0 16 16" style="${heartFillStyle}">
                      <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"></path>
                    </svg>
                  </button>
                </div>

                <div class="product__prices">
                  ${
            product.discount
              ? `<span class="product__price">${product.discount} ₽</span><span class="product__price discount">${product.price} ₽</span>`
              : `<span class="product__price">${product.price} ₽</span>`
          }
                </div>
                <div class="product__links">
                  ${actionButtons}
                </div>
              </div>
            </article>
          `;
          container.innerHTML += productHTML;
        });
      } else {
        container.innerHTML = '<p>Нет новых товаров.</p>';
      }
    })
    .catch((err) => {
      console.error('Ошибка загрузки новых товаров:', err);
      document.getElementById('products-container').innerHTML =
        'Не удалось загрузить товары.';
    });
});
