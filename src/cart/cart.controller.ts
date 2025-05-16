import {
  Controller,
  Get,
  Post,
  Render,
  Param,
  Delete,
  ParseIntPipe, Request, UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './entities/сart.entity';
import { ApiExcludeController } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiExcludeController()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Render('cart')
  async getCartPage(@Request() req) {
    const userId = 1;
    const cartItems = await this.cartService.getCartItems(userId);

    if (!cartItems || cartItems.length === 0) {
      return {
        pageTitle: 'Корзина',
        cartItems: [],
        originalSum: 0,
        discountAmount: 0,
      };
    }

    const originalSum = this.cartService.calculateOriginalSum(cartItems);
    const discountAmount = this.cartService.calculateDiscountAmount(cartItems);

    return {
      pageTitle: 'Корзина',
      cartItems,
      originalSum,
      discountAmount,
    };
  }

  @Get('count')
  async getCartCount(@Request() req): Promise<{ count: number }> {
    const userId = 1;
    const count = await this.cartService.getCartItemCount(userId);
    return {
      count,
    };
  }

  @Get('items')
  async getCartItems(@Request() req): Promise<Cart[]> {
    const userId = 1;
    return await this.cartService.getCartItems(userId);
  }

  @Post(':productId/add')
  async addItemToCart(
    @Param('productId', ParseIntPipe) productId: number, @Request() req
  ): Promise<{ added: boolean }> {
    const userId = 1;
    await this.cartService.addItemToCart(userId, productId);
    return {
      added: true,
    };
  }

  @Post(':productId/increase')
  async increaseQuantity(
    @Param('productId', ParseIntPipe) productId: number, @Request() req
  ): Promise<{ updated: boolean }> {
    const userId = 1;
    await this.cartService.increaseQuantity(userId, productId);
    return {
      updated: true,
    };
  }

  @Post(':productId/decrease')
  async decreaseQuantity(
    @Param('productId', ParseIntPipe) productId: number, @Request() req
  ): Promise<{ updated: boolean }> {
    const userId = 1;
    await this.cartService.decreaseQuantity(userId, productId);
    return {
      updated: true,
    };
  }

  @Delete(':productId/remove')
  async removeItemFromCart(
    @Param('productId', ParseIntPipe) productId: number, @Request() req
  ): Promise<{ removed: boolean }> {
    const userId = 1;

    await this.cartService.removeItemFromCart(userId, productId);
    return {
      removed: true,
    };
  }

  @Delete('clear')
  async clearCart(@Request() req): Promise<{ cleared: boolean }> {
    const userId = 1;
    await this.cartService.clearCart(userId);
    return { cleared: true };
  }
}
