import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseFilters } from '@nestjs/common';
import { UserService } from 'user/user.service';
import { OrderService } from '../order/order.service';
import { AllExceptionsFilter } from '../all.exception.filter';
import { ProfileData } from './dto/profile.data';
import { OrdersPageData } from './dto/orders.data';
import { OrderDetailsData } from './dto/order-details.data';
import { BonusCardData } from './dto/bonus-card.data';
import { ProfileEditData } from './dto/profile-edit.data';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
@UseFilters(AllExceptionsFilter)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly orderService: OrderService,
  ) {}

  @Query(() => ProfileData, {
    description: 'Получение данных личного кабинета',
  })
  async getProfile() {
    const userId = 1;
    const user = await this.userService.findOne(userId);

    return {
      user,
      pageTitle: 'Личный кабинет',
    };
  }

  @Query(() => OrdersPageData, {
    description: 'Получение всех заказов пользователя',
  })
  async getAllOrders() {
    const userId = 1;
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

  @Query(() => OrderDetailsData, { description: 'Получение деталей заказа' })
  async getOrderDetails(@Args('id', { type: () => Int }) orderId: number) {
    const userId = 1;
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

  @Query(() => ProfileEditData, {
    description: 'Получение данных для страницы редактирования профиля',
  })
  async getEditProfilePage() {
    const userId = 1;
    const user = await this.userService.findOne(userId);

    return {
      user,
      pageTitle: 'Редактирование личных данных',
    };
  }

  @Query(() => BonusCardData, {
    description: 'Получение данных бонусной карты',
  })
  async getBonusCardPage() {
    const userId = 1;
    const user = await this.userService.findOne(userId);
    const loyaltyInfo = await this.userService.calculateLoyaltyLevel(user);

    return {
      user,
      loyaltyLevel: loyaltyInfo.level,
      bonusPercentage: loyaltyInfo.bonusPercentage,
      pageTitle: 'Бонусная карта',
    };
  }

  @Mutation(() => User, { description: 'Обновление данных пользователя' })
  async updateProfile(@Args('input') updateUserDto: UpdateUserInput) {
    const userId = 1;
    return this.userService.update(userId, updateUserDto);
  }
}
