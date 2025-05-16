import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entities/сart.entity';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query(() => Cart, { name: 'carts' })
  async getCartPage() {
    const userId = 1;
    const cartItems = await this.cartService.getCartItems(userId);

    return {
      cartItems,
    };
  }

  @Query(() => Int, { name: 'cartCount' })
  async getCartCount(): Promise<number> {
    const userId = 1;
    return await this.cartService.getCartItemCount(userId);
  }

  @Query(() => [Cart], { name: 'cartItems' })
  async getCartItems(): Promise<Cart[]> {
    const userId = 1;
    return await this.cartService.getCartItems(userId);
  }

  @Mutation(() => Boolean, { name: 'addItemToCart' })
  async addItemToCart(
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<boolean> {
    const userId = 1;
    await this.cartService.addItemToCart(userId, productId);
    return true;
  }

  @Mutation(() => Boolean, { name: 'increaseQuantity' })
  async increaseQuantity(
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<boolean> {
    const userId = 1;
    await this.cartService.increaseQuantity(userId, productId);
    return true;
  }

  @Mutation(() => Boolean, { name: 'decreaseQuantity' })
  async decreaseQuantity(
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<boolean> {
    const userId = 1;
    await this.cartService.decreaseQuantity(userId, productId);
    return true;
  }

  @Mutation(() => Boolean, { name: 'removeItemFromCart' })
  async removeItemFromCart(
    @Args('productId', { type: () => Int }) productId: number,
  ): Promise<boolean> {
    const userId = 1;
    await this.cartService.removeItemFromCart(userId, productId);
    return true;
  }

  @Mutation(() => Boolean, { name: 'clearCart' })
  async clearCart(): Promise<boolean> {
    const userId = 1;
    await this.cartService.clearCart(userId);
    return true;
  }
}
