import { addToCart, goToCart } from './cart.js';
import { toggleFavorite } from './favorites.js';

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.product-main__button--favorite');
  buttons.forEach((button) => {
    button.addEventListener('click', async (event) => {
      const productId = event.target.dataset.productId;
      await toggleFavorite(productId, event.target);
    });
  });
});
