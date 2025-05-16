import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import {UpdateOrderInput} from './dto/update-order.input';
import {UpdateOrderStatusOutput} from "./dto/update-order-status-output.dto";
import {OrderPageData} from "./dto/order-page-data.dto";
import {UserService} from "../user/user.service";
import {CartService} from "../cart/cart.service";
import {OrderSuccessData} from "./dto/order-success-data.dto";
import { UseFilters } from '@nestjs/common';
import { AllExceptionsFilter } from '../all.exception.filter';

@Resolver(() => Order)
@UseFilters(AllExceptionsFilter)
export class OrderResolver {
    constructor(
        private readonly ordersService: OrderService,
        private readonly userService: UserService,
        private readonly cartService: CartService,
    ) {}


    @Query(() => [Order])
    async orders(): Promise<Order[]> {
        return this.ordersService.findAllOrders();
    }

    @Query(() => Order, { nullable: true })
    async order(@Args('id', { type: () => Int }) id: number): Promise<Order | null> {
        return this.ordersService.findOrderById(id);
    }

    // для страницы оформления заказа
    @Query(() => OrderPageData)
    async orderPageData(@Args('userId', { type: () => Int }) userId: number) {
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

    // для страницы успешного создания заказа
    @Query(() => OrderSuccessData)
    async orderSuccessData(@Args('orderId', { type: () => Int }) orderId: number) {
        const order = await this.ordersService.findOrderById(orderId);

        return {
            pageTitle: 'Заказ успешно создан',
            order,
        };
    }

    @Mutation(() => Order)
    async createOrder(@Args('input') input: CreateOrderInput): Promise<Order> {
        const userId = input.userId;
        const totalAmount = parseFloat(input.finalTotal.toString());

        const order = await this.ordersService.createOrder(userId, {
            ...input,
            totalAmount,
        });

        return order;
    }

    @Mutation(() => UpdateOrderStatusOutput, { name: 'updateOrderStatus' })
    async updateOrderStatus(@Args('input') input: UpdateOrderInput): Promise<UpdateOrderStatusOutput> {
        await this.ordersService.updateOrderStatus(input.id, input.status);
        const redirectUrl = `/florist/orders/${input.id}`;

        return { redirectUrl };
    }
}
