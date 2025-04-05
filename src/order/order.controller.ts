import {Body, Controller, Get, HttpException, HttpStatus, Post, Query, Redirect, Render, Session} from "@nestjs/common";
import {OrderService} from "./order.service";
import {CartService} from "../cart/cart.service";
import {UserService} from "../user/user.service";
import {TelegramService} from "./telegram.service";

@Controller('orders')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly cartService: CartService,
        private readonly userService: UserService,
    ) {}

    @Get('')
    @Render('orders/orders')
    async OrderPage(@Session() session: Record<string, any>) {
        const userId = 1;
        const user = await this.userService.findOne(userId);
        const cartItems = await this.cartService.getCartItems(userId);
        const priceSum = this.cartService.calculateOriginalSum(cartItems);
        const discountAmount = this.cartService.calculateDiscountAmount(cartItems);
        const originalSum = priceSum - discountAmount;

        return {
            pageTitle: 'Оформление заказа',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                middleName: user.middleName || null,
                email: user.email,
                phone: user.phone,
                bonusPoints: user.bonusPoints,
                totalOrders: user.totalOrders,
            },
            originalSum,
            discountAmount,
            availableBonus: user.bonusPoints,
        };
    }


    @Post('/create')
    @Redirect('orders-success')
    async create(@Session() session: Record<string, any>, @Body() orderData: any) {
        const userId = 1;

        try {
            const validDeliveryTypes = ['courier', 'pickup'];
            orderData.deliveryType = orderData.deliveryType.toLowerCase();

            if (!validDeliveryTypes.includes(orderData.deliveryType)) {
                throw new Error(`Недопустимый тип доставки: ${orderData.deliveryType}`);
            }

            if (orderData.deliveryType === 'courier' && !orderData.deliveryAddress) {
                throw new Error("Адрес доставки обязателен для курьерской доставки");
            }

            const totalAmount = parseFloat(orderData.finalTotal);

            const order = await this.orderService.createOrder(userId, { ...orderData, totalAmount });
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
                items: cartItems.map(item => ({
                    productName: item.product.name,
                    quantity: item.quantity,
                })),
            });

            return { url: `/orders/success?orderId=${order.id}` };
        } catch (error) {
            console.error('Ошибка при создании заказа:', error.message);
            return { success: false, message: error.message };
        }
    }

    @Get('success')
    @Render('orders/orders-success')
    async orderSuccessPage(@Query('orderId') orderId: string) {
        if (!orderId) {
            throw new Error('ID заказа не указан');
        }

        const order = await this.orderService.findOrderById(orderId);

        if (!order) {
            throw new Error('Заказ не найден');
        }

        return { pageTitle: 'Заказ успешно создан', order };
    }
}
