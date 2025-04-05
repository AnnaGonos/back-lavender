import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Redirect, Render, Res,
    Session} from '@nestjs/common';
import {OrderService} from "../order/order.service";
import { Response } from 'express';
import {OrderStatus} from "../order/entities/order-status.enum";

@Controller('florist')
export class FloristController {
    constructor(
        private readonly orderService: OrderService,
    ) {}

    @Get()
    @Render('florist/florist')
    getFloristPage() {
        return { pageTitle: 'Аккаунт флориста' };
    }

    @Get('/orders')
    @Render('florist/orders/all')
    async allOrdersPage() {
        const orders = await this.orderService.findAllOrders();

        console.log('All Orders:', orders);

        return {
            pageTitle: 'Все заказы',
            orders,
            getOrderStatus: this.orderService.getOrderStatus.bind(this.orderService),
            getDeliveryType: this.orderService.getDeliveryType.bind(this.orderService),
        };
    }

    @Get('/orders/:id')
    @Render('florist/orders/details')
    async getOrderDetails(@Param('id') orderId: string) {
        const order = await this.orderService.getOrderItems(parseInt(orderId, 10));

        if (!order) {
            throw new NotFoundException(`Заказ с ID ${orderId} не найден`);
        }

        return {
            pageTitle: `Заказ №${order.id}`,
            order,
            getOrderStatus: this.orderService.getOrderStatus.bind(this.orderService),
            getDeliveryType: this.orderService.getDeliveryType.bind(this.orderService),
        };
    }

    @Post('/orders/:id/update-status')
    async updateOrderStatus(
        @Param('id') orderId: string,
        @Body('status') status: OrderStatus,
        @Res() res: Response
    ) {
        await this.orderService.updateOrderStatus(parseInt(orderId, 10), status);
        return res.redirect(`/florist/orders/${orderId}`);
    }

    @Post('/orders/:id/update-item/:itemId')
    async updateOrderItemQuantity(
        @Param('id') orderId: string,
        @Param('itemId') itemId: string,
        @Body('quantity') quantity: number,
        @Res() res: Response
    ) {
        await this.orderService.updateOrderItemQuantity(parseInt(orderId, 10), parseInt(itemId, 10), quantity);
        return res.redirect(`/florist/orders/${orderId}`);
    }

    @Get('/orders/:id/remove-item/:itemId')
    async removeOrderItem(
        @Param('id') orderId: string,
        @Param('itemId') itemId: string,
        @Res() res: Response
    ) {
        await this.orderService.removeOrderItem(parseInt(orderId, 10), parseInt(itemId, 10));
        return res.redirect(`/florist/orders/${orderId}`);
    }

    @Post('/orders/:id/delete')
    async deleteOrder(@Param('id') orderId: string, @Res() res: Response) {
        await this.orderService.deleteOrder(parseInt(orderId, 10));
        return res.redirect('/florist/orders');
    }

    // @Get('/schedule')
    // @Render('florist/schedule/all')
    // async getSchedulePage() {
    //     const slots = await this.deliveryScheduleService.findAll();
    //     console.log('Slots:', slots);
    //
    //     const groupedSlots = slots.reduce((acc, slot) => {
    //         const date = slot.specificDate || slot.dayOfWeek || 'Без даты';
    //         if (!acc[date]) {
    //             acc[date] = [];
    //         }
    //         acc[date].push(slot);
    //         return acc;
    //     }, {});
    //
    //     console.log('Grouped Slots:', groupedSlots);
    //
    //     return { pageTitle: 'График доставок', groupedSlots };
    // }
    //
    // @Get('/schedule/add')
    // @Render('florist/schedule/add')
    // getAddSlotPage() {
    //     const slots = this.deliveryScheduleService.generateTimeSlots();
    //     return { pageTitle: 'Добавление слотов', slots };
    // }
    //
    // /**
    //  * Добавление новых слотов
    //  */
    // @Post('/schedule/add')
    // @Redirect('/florist/schedule') // Редирект после добавления
    // async addSlots(@Body() body) {
    //     const { date, slots } = body;
    //
    //     if (!date || !Array.isArray(slots) || slots.length === 0) {
    //         throw new BadRequestException('Необходимо выбрать хотя бы один слот');
    //     }
    //
    //     await this.deliveryScheduleService.addSlots(date, slots);
    //     return { message: 'Слоты успешно добавлены' };
    // }
    //
    // @Delete('/schedule/:id')
    // @Redirect('/florist/schedule')
    // async deleteCategory(@Param('id') id: string) {
    //     await this.deliveryScheduleService.remove(+id);
    // }

}