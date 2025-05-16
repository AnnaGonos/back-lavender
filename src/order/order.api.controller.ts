import {
  Body,
  Controller,
  Get,
  Param, ParseIntPipe,
  Post,
  Query,
  Redirect,
  Render,
  UseFilters,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CartService } from '../cart/cart.service';
import { UserService } from '../user/user.service';
import { TelegramService } from '../notification/telegram.service';
import { OrderStatus } from './entities/order-status.enum';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AllExceptionsFilter } from '../all.exception.filter';
import { Category } from '../category/entities/category.entity';
import { Order } from './entities/order.entity';

@ApiTags('orders')
@UseFilters(AllExceptionsFilter)
@Controller('api/orders')
export class OrderApiController {
  constructor(
    private readonly orderService: OrderService,
    private readonly cartService: CartService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Отдельная страница оформления заказов' })
  @ApiOkResponse({
    description: 'Страница оформления заказов успешно получена',
  })
  async OrderPage() {
    const userId = 1;
    const user = await this.userService.findOne(userId);
    const cartItems = await this.cartService.getCartItems(userId);
    const priceSum = this.cartService.calculateOriginalSum(cartItems);
    const discountAmount = this.cartService.calculateDiscountAmount(cartItems);
    const originalSum = priceSum - discountAmount;

    return {
      pageTitle: 'Оформление заказа',
      user,
      originalSum,
      discountAmount,
      availableBonus: user.bonusPoints,
    };
  }

  @Get('orders/success')
  @ApiOperation({ summary: 'Страница успешного создания заказа' })
  @ApiOkResponse({ description: 'Заказ успешно создан', type: Order })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  async orderSuccessPage(@Query('orderId') orderId: number) {
    const order = await this.orderService.findOrderById(+orderId);

    return { pageTitle: 'Заказ успешно создан', order };
  }

  @Post('orders/create')
  @ApiOperation({ summary: 'Создание нового заказа' })
  @ApiOkResponse({
    description: 'Заказ успешно создан',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: '/orders/success?orderId=123',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Неверные данные запроса ' })
  async create(@Body() orderData: any) {
    const userId = 1;
    const totalAmount = parseFloat(orderData.finalTotal);
    const order = await this.orderService.createOrder(userId, {
      ...orderData,
      totalAmount,
    });
    const user = await this.userService.findOne(userId);
    const cartItems = await this.cartService.getCartItems(userId);

    await TelegramService.sendOrderDetails({
      nameUser: user.firstName,
      lastUser: user.lastName,
      phoneUser: user.phone,
      deliveryType: orderData.deliveryType,
      deliveryDate: orderData.deliveryDate,
      deliveryInterval: orderData.deliveryInterval,
      deliveryAddress: orderData.deliveryAddress,
      paymentMethod: orderData.paymentMethod,
      totalAmount: totalAmount,
    });

    return { url: `/orders/success?orderId=${order.id}` };
  }

  @Get('florist/orders')
  @ApiOperation({ summary: 'Отдельная страница всех заказов для флориста' })
  @ApiOkResponse({
    description: 'Страница всех заказов успешно получена',
    type: Category,
  })
  async allOrdersPage() {
    const orders = await this.orderService.findAllOrders();

    return {
      pageTitle: 'Все заказы',
      orders,
      getOrderStatus: this.orderService.getOrderStatus.bind(this.orderService),
      getDeliveryType: this.orderService.getDeliveryType.bind(
        this.orderService,
      ),
    };
  }

  @Get('/florist/orders/:id')
  @ApiOperation({ summary: 'Страница деталей определенного заказа' })
  @ApiOkResponse({
    description: 'Станица деталей определенного заказа успешно загружена',
  })
  @ApiNotFoundResponse({ description: 'Заказ не найден' })
  async getOrderDetails(@Param('id', ParseIntPipe) orderId: number) {
    const order = await this.orderService.getOrderItems(orderId);

    return {
      pageTitle: `Заказ №${order.id}`,
      order,
      getOrderStatus: this.orderService.getOrderStatus.bind(this.orderService),
      getDeliveryType: this.orderService.getDeliveryType.bind(
        this.orderService,
      ),
    };
  }

  @Post('/florist/orders/:id/update-status')
  @ApiOperation({ summary: 'Обновление статуса заказа' })
  @ApiOkResponse({ description: 'Статус заказа успешно обновлен' })
  @ApiBadRequestResponse({ description: 'Неверные данные запроса' })
  @ApiNotFoundResponse({ description: 'Заказ не найден' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID заказа',
    example: '1',
  })
  async updateOrderStatus(
    @Param('id', ParseIntPipe) orderId: number,
    @Body('status') status: OrderStatus,
  ) {
    await this.orderService.updateOrderStatus(orderId, status);
  }
}
