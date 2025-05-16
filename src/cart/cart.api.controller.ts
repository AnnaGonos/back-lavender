import {
  Controller,
  Get,
  Post,
  Render,
  Param,
  Delete,
  UseFilters,
  ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './entities/сart.entity';
import {
  ApiBadRequestResponse, ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AllExceptionsFilter } from '../all.exception.filter';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('cart')
@UseFilters(AllExceptionsFilter)
@Controller('api/cart')
// @UseGuards(AuthGuard('jwt'))
export class CartApiController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Получение страницы корзины' })
  @ApiOkResponse({
    description: 'Страница корзины успешно получена',
    schema: {
      example: {
        pageTitle: 'Корзина', cartItems: [], originalSum: 0, discountAmount: 0,
      },
    },
  })
  async getCartPage() {
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
  @ApiOperation({ summary: 'Получение количества товаров в корзине' })
  @ApiOkResponse({ description: 'Количество товаров успешно получено', schema: { example: { count: 15 } } })
  async getCartCount(): Promise<{ count: number }> {
    const userId = 1;
    const count = await this.cartService.getCartItemCount(userId);
    return {
      count,
    };
  }

  @Get('items')
  @ApiOperation({ summary: 'Получение списка товаров в корзине' })
  @ApiOkResponse({ description: 'Список товаров успешно получен', type: [Cart] })
  async getCartItems(): Promise<Cart[]> {
    const userId = 1;
    return await this.cartService.getCartItems(userId);
  }

  @Post(':productId/add')
  @ApiOperation({ summary: 'Добавление товара в корзину' })
  @ApiOkResponse({ description: 'Товар успешно добавлен в корзину', schema: { example: { added: true } } })
  @ApiBadRequestResponse({ description: 'Неверные данные запроса' })
  @ApiParam({ name: 'productId', type: Number, description: 'Id товара', example: 101 })
  async addItemToCart(@Param('productId', ParseIntPipe) productId: number): Promise<{ added: boolean; }> {
    const userId = 1;
    await this.cartService.addItemToCart(userId, productId);
    return {
      added: true,
    };
  }

  @Post(':productId/increase')
  @ApiOperation({ summary: 'Увеличение количества товара в корзине' })
  @ApiOkResponse({ description: 'Количество товара успешно увеличено', schema: { example: { updated: true } } })
  @ApiBadRequestResponse({ description: 'Неверные данные запроса' })
  @ApiNotFoundResponse({ description: 'Товар или пользователь не найден' })
  @ApiParam({ name: 'productId', type: Number, description: 'Id товара', example: 101 })
  async increaseQuantity(
    @Param('productId', ParseIntPipe) productId: number): Promise<{ updated: boolean; }> {
    const userId = 1;
    await this.cartService.increaseQuantity(userId, productId);
    return {
      updated: true,
    };
  }

  @Post(':productId/decrease')
  @ApiOperation({ summary: 'Уменьшение количества товара в корзине' })
  @ApiOkResponse({ description: 'Количество товара успешно увеличено', schema: { example: { updated: true } } })
  @ApiBadRequestResponse({ description: 'Неверные данные запроса' })
  @ApiNotFoundResponse({ description: 'Товар или пользователь не найден' })
  @ApiParam({ name: 'productId', type: Number, description: 'Id товара', example: 101,})
  async decreaseQuantity(
    @Param('productId', ParseIntPipe) productId: number
  ): Promise<{ updated: boolean }> {
    const userId = 1;
    await this.cartService.decreaseQuantity(userId, productId);
    return {
      updated: true,
    };
  }

  @Delete(':productId/remove')
  @ApiOperation({ summary: 'Удаление товара из корзины' })
  @ApiOkResponse({ description: 'Количество товара успешно увеличено', schema: { example: { removed: true } } })
  @ApiBadRequestResponse({ description: 'Неверные данные запроса' })
  @ApiNotFoundResponse({ description: 'Товар или пользователь не найден' })
  @ApiParam({ name: 'productId', type: Number, description: 'Id товара', example: 101 })
  async removeItemFromCart(
    @Param('productId', ParseIntPipe) productId: number
  ): Promise<{ removed: boolean }> {
    const userId = 1;

    await this.cartService.removeItemFromCart(userId, productId);
    return {
      removed: true,
    };
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Очистка всей корзины' })
  @ApiOkResponse({ description: 'Корзина успешно очищена' })
  @ApiBadRequestResponse({ description: 'Неверные данные запроса' })
  @ApiNotFoundResponse({ description: 'Корзина или пользователь не найден' })
  async clearCart(): Promise<{ cleared: boolean }> {
    const userId = 1;
    await this.cartService.clearCart(userId);
    return { cleared: true };
  }
}
