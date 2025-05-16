import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { Cart } from './entities/сart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async isProductInCart(userId: number, productId: number): Promise<boolean> {
    const cartItems = await this.getCartItems(userId);
    return cartItems.some((item) => item.product.id === productId);
  }

  async addItemToCart(userId: number, productId: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with #${productId} not found`);
    }

    if (product.quantityInStock <= 0) {
      throw new BadRequestException(
        `Product with #${productId} out of stock`,
      );
    }

    const existingCartItem = await this.cartRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (existingCartItem) {
      if (existingCartItem.quantity + 1 > product.quantityInStock) {
        throw new BadRequestException(
          `Недостаточно товара в магазине для увеличения количества. Максимальное количество: ${product.quantityInStock}`,
        );
      }
      existingCartItem.quantity += 1;
      await this.cartRepository.save(existingCartItem);
    } else {
      const newCartItem = this.cartRepository.create({
        user: { id: userId },
        product: { id: productId },
        quantity: 1,
      });
      await this.cartRepository.save(newCartItem);
    }
  }

  async removeItemFromCart(userId: number, productId: number): Promise<void> {
    const cartItem = await this.cartRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (!cartItem) {
      throw new NotFoundException('The product was not found in the shopping cart');
    }

    await this.cartRepository.remove(cartItem);
  }

  async getCartItemCount(userId: number): Promise<number> {
    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } },
    });

    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  async getCartItems(userId: number): Promise<any[]> {
    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });

    return cartItems.map((cartItem) => ({
      product: {
        id: cartItem.product.id,
        name: cartItem.product.name,
        imageUrl: cartItem.product.imageUrl || '/images/placeholder.jpg',
        price: cartItem.product.price,
        discount: cartItem.product.discount,
      },
      quantity: cartItem.quantity,
    }));
  }

  async increaseQuantity(userId: number, productId: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with #${productId} not found`);
    }

    const cartItem = await this.cartRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (!cartItem) {
      throw new NotFoundException('Товар не найден в корзине');
    }

    if (cartItem.quantity + 1 > product.quantityInStock) {
      throw new BadRequestException(
        'Недостаточно товара в магазине для увеличения количества',
      );
    }

    cartItem.quantity += 1;
    await this.cartRepository.save(cartItem);
  }

  async decreaseQuantity(userId: number, productId: number): Promise<void> {
    const cartItem = await this.cartRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (!cartItem) {
      throw new NotFoundException('The product was not found in the shopping cart');
    }

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      await this.cartRepository.save(cartItem);
    } else {
      await this.cartRepository.remove(cartItem);
    }
  }

  async clearCart(userId: number): Promise<void> {
    await this.cartRepository.delete({ user: { id: userId } });
  }

  calculateOriginalSum(cartItems: Cart[]): number {
    return cartItems.reduce((sum, item) => {
      const price = item.product.price;
      return sum + price * item.quantity;
    }, 0);
  }

  calculateDiscountAmount(cartItems: Cart[]): number {
    return cartItems.reduce((sum, item) => {
      if (item.product.discount) {
        return (
          sum + (item.product.price - item.product.discount) * item.quantity
        );
      }
      return sum;
    }, 0);
  }
}
