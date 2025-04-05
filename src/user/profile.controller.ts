import {
    Body,
    Controller,
    Get,
    NotFoundException, Param,
    Post,
    Redirect,
    Render,
    Request, Session,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {UserService} from "./user.service";
import {UpdateUserDto} from "./dto/update-user.dto";
import {OrderService} from "../order/order.service";

@Controller('profile')
export class ProfileController {
    constructor(private readonly userService: UserService,
                private readonly orderService: OrderService)
    {}


    @Get('/myorders')
    @Render('profile/all-orders')
    async allOrdersPage(@Session() session: Record<string, any>) {
        const userId = 1;
        const user = await this.userService.findOne(userId);
        const orders = await this.orderService.findOrdersByUserId(userId);

        return {
            pageTitle: 'Мои заказы',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
            },
            orders,
            getOrderStatus: this.orderService.getOrderStatus.bind(this.orderService),
            getDeliveryType: this.orderService.getDeliveryType.bind(this.orderService),
        };
    }

    @Get('/myorders/:id')
    @Render('order/order-details')
    async orderDetailsPage(@Param('id') orderId: string, @Session() session: Record<string, any>) {
        const userId = 1;
        const user = await this.userService.findOne(userId);
        const order = await this.orderService.getOrderItems(parseInt(orderId, 10));

        console.log('Order:', order); // Логирование данных

        if (!order) {
            throw new NotFoundException(`Заказ с ID ${orderId} не найден`);
        }

        return {
            pageTitle: `Заказ №${order.id}`,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
            },
            order,
            getOrderStatus: this.orderService.getOrderStatus.bind(this.orderService),
            getDeliveryType: this.orderService.getDeliveryType.bind(this.orderService),
        };
    }

    @Get()
    @Render('profile/profile')
    async getProfilePage() {
        const userId = 1; // Фиксированный ID первого пользователя

        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        return {
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
            pageTitle: 'Личный кабинет',
        };
    }

    @Get('edit')
    @Render('profile/profile-edit')
    async getEditProfilePage() {
        const userId = 1;
        const user = await this.userService.findOne(userId);

        return {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                middleName: user.middleName,
                email: user.email,
                phone: user.phone,
            },
            pageTitle: 'Редактирование личных данных',
        };
    }

    @Post('edit')
    @UsePipes(new ValidationPipe())
    @Redirect('/profile')
    async updateProfile(@Body() updateUserDto: UpdateUserDto) {
        const userId = 1;
        await this.userService.update(userId, updateUserDto);
        return { url: '/profile' };
    }

    @Get('bonus-card')
    @Render('profile/bonus-card')
    async getBonusCardPage(@Request() req) {
        const userId = 1;
        const user = await this.userService.findOne(userId);

        const loyaltyLevel = await this.userService.calculateLoyaltyLevel(user);

        return {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                bonusPoints: user.bonusPoints,
                totalOrders: user.totalOrders,
            },
            loyaltyLevel,
            pageTitle: 'Бонусная карта',
        };
    }
}