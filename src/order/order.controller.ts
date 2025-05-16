import {
  Body,
  Controller,
  Get,
  Param,
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
import { AllExceptionsFilter } from '../all.exception.filter';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@UseFilters(AllExceptionsFilter)
@ApiExcludeController()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly cartService: CartService,
    private readonly userService: UserService,
  ) {}

  @Get('orders')
  @Render('orders/orders')
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
  @Render('orders/order-success')
  async orderSuccessPage(@Query('orderId') orderId: number) {
    const order = await this.orderService.findOrderById(+orderId);

    return { pageTitle: 'Заказ успешно создан', order };
  }

  @Post('orders/create')
  @Redirect('orders/order-success')
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
  @Render('florist/orders/all')
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
  @Render('florist/orders/details')
  async getOrderDetails(@Param('id') orderId: number) {
    const order = await this.orderService.getOrderItems(+orderId);

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
  @Redirect('/florist/orders/:id')
  async updateOrderStatus(
    @Param('id') orderId: number,
    @Body('status') status: OrderStatus,
  ) {
    await this.orderService.updateOrderStatus(+orderId, status);
  }
}
