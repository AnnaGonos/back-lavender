import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Redirect,
  Render,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { OrderService } from '../order/order.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiExcludeController()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly orderService: OrderService,
  ) {}

  @Get()
  @Render('profile/profile')
  async getProfilePage(@Request() req) {
    const userId = req.user.id;

    const user = await this.userService.findOne(userId);

    return {
      user,
      pageTitle: 'Личный кабинет',
    };
  }

  @Get('/myorders')
  @Render('profile/all-orders')
  async allOrdersPage(@Request() req) {
    const userId = req.user.id;

    const user = await this.userService.findOne(userId);
    const orders = await this.orderService.findOrdersByUserId(userId);

    return {
      pageTitle: 'Мои заказы',
      user,
      orders,
      getOrderStatus: this.orderService.getOrderStatus.bind(this.orderService),
      getDeliveryType: this.orderService.getDeliveryType.bind(
        this.orderService,
      ),
    };
  }

  @Get('/myorders/:id')
  @Render('orders/order-details')
  async orderDetailsPage(@Param('id', ParseIntPipe) orderId: number, @Request() req) {
    const userId = req.user.id;

    const user = await this.userService.findOne(userId);
    const order = await this.orderService.getOrderItems(orderId);

    return {
      pageTitle: `Заказ №${order.id}`,
      user,
      order,
      getOrderStatus: this.orderService.getOrderStatus.bind(this.orderService),
      getDeliveryType: this.orderService.getDeliveryType.bind(
        this.orderService,
      ),
    };
  }

  @Get('edit')
  @Render('profile/profile-edit')
  async getEditProfilePage(@Request() req) {
    const userId = req.user.id;
    const user = await this.userService.findOne(userId);

    return {
      user,
      pageTitle: 'Редактирование личных данных',
    };
  }

  @Get('bonus-card')
  @Render('profile/bonus-card')
  async getBonusCardPage(@Request() req) {
    const userId = req.user.id;
    const user = await this.userService.findOne(userId);
    const loyaltyInfo = await this.userService.calculateLoyaltyLevel(user);

    return {
      user,
      loyaltyLevel: loyaltyInfo.level,
      bonusPercentage: loyaltyInfo.bonusPercentage,
      pageTitle: 'Бонусная карта',
    };
  }

  @Patch('edit')
  @Redirect('/profile')
  async updateProfile(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    const userId = req.user.id;
    await this.userService.update(userId, updateUserDto);
  }
}
