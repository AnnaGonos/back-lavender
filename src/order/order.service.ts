import {OrderItem} from "./entities/order-item.entity";
import {Order} from "./entities/order.entity";
import {Payment} from "./entities/payment.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Injectable, NotFoundException} from "@nestjs/common";
import {Repository} from "typeorm";
import {CreateOrderDto} from "./dto/create-order.dto";
import {CartService} from "../cart/cart.service";
import {ProductService} from "../product/product.service";
import {DeliveryType} from "./entities/delivery-type.enum";
import {UserService} from "../user/user.service";
import {OrderStatus} from "./entities/order-status.enum";
import {PaymentMethod} from "./entities/payment-method.enum";
import {PaymentStatus} from "./entities/payment-status.enum";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        private readonly cartService: CartService,
        private readonly productService: ProductService,
        private readonly userService: UserService,
    ) {}

    async findOrdersByUserId(userId: number): Promise<any[]> {
        const orders = await this.orderRepository.find({
            select: [
                'id',
                'totalAmount',
                'status',
                'deliveryDate',
                'deliveryInterval',
                'deliveryType',
                'deliveryAddress',
            ],
            where: { user: { id: userId } },
        });

        console.log('Orders:', orders); // Логирование данных

        return orders;
    }

    async findAllOrders(): Promise<Order[]> {
        const orders = await this.orderRepository.find({
            relations: ['items', 'items.product'],
        });

        return orders;
    }

    async updateOrderStatus(orderId: number, status: OrderStatus): Promise<void> {
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        if (!order) throw new NotFoundException(`Заказ с ID ${orderId} не найден`);
        order.status = status;
        await this.orderRepository.save(order);
    }

    async updateOrderItemQuantity(orderId: number, itemId: number, quantity: number): Promise<void> {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['items', 'items.product'],
        });
        if (!order) throw new NotFoundException(`Заказ с ID ${orderId} не найден`);

        const item = order.items.find((i) => i.id === itemId);
        if (!item) throw new NotFoundException(`Товар с ID ${itemId} не найден в заказе`);

        item.quantity = quantity;
        await this.orderItemRepository.save(item);

        // Пересчитываем общую сумму заказа
        order.totalAmount = order.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
        await this.orderRepository.save(order);
    }

    async removeOrderItem(orderId: number, itemId: number): Promise<void> {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['items', 'items.product'],
        });
        if (!order) throw new NotFoundException(`Заказ с ID ${orderId} не найден`);

        const itemIndex = order.items.findIndex((i) => i.id === itemId);
        if (itemIndex === -1) throw new NotFoundException(`Товар с ID ${itemId} не найден в заказе`);

        order.items.splice(itemIndex, 1);
        await this.orderItemRepository.delete(itemId);

        // Пересчитываем общую сумму заказа
        order.totalAmount = order.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
        await this.orderRepository.save(order);
    }

    async deleteOrder(orderId: number): Promise<void> {
        const order = await this.orderRepository.findOne({ where: { id: orderId } });
        if (!order) throw new NotFoundException(`Заказ с ID ${orderId} не найден`);
        await this.orderRepository.delete(orderId);
    }

    async createOrder(userId: number, orderData: any) {
        const user = await this.userService.findOne(userId);
        const cartItems = await this.cartService.getCartItems(userId);

        if (!cartItems || cartItems.length === 0) {
            throw new Error("Корзина пуста");
        }

        const totalAmount = parseFloat(orderData.finalTotal);
        let bonusPointsUsed = 0;

        if (orderData.bonusAction === 'spend') {
            bonusPointsUsed = Math.min(user.bonusPoints, totalAmount);
            user.bonusPoints -= bonusPointsUsed;
        }

        const order = new Order();
        order.user = user;
        order.totalAmount = totalAmount;
        order.bonusPointsUsed = bonusPointsUsed;
        order.status = OrderStatus.CREATED;
        order.deliveryType = orderData.deliveryType;
        order.deliveryDate = orderData.deliveryDate;
        order.deliveryInterval = orderData.deliveryInterval;
        order.paymentMethod = orderData.paymentMethod || PaymentMethod.CASH;
        order.deliveryAddress = orderData.deliveryAddress

        order.recipientName = orderData.recipientName || `${user.firstName} ${user.lastName}`;
        order.recipientPhone = orderData.recipientPhone || user.phone;

        const orderItems = cartItems.map(cartItem => {
            const orderItem = new OrderItem();
            orderItem.product = cartItem.product;
            orderItem.quantity = cartItem.quantity;
            return orderItem;
        });

        order.items = orderItems;

        await this.orderRepository.save(order);

        const payment = new Payment();
        payment.order = order;
        payment.amount = order.totalAmount;
        payment.method = orderData.paymentMethod || PaymentMethod.CASH;
        payment.status = PaymentStatus.PENDING;

        await this.paymentRepository.save(payment);

        // начисление бонусов
        const bonusPercentage = user.bonusCardLevel;
        const bonusPointsEarned = Math.floor(totalAmount * (bonusPercentage / 100));
        user.bonusPoints += bonusPointsEarned;

        user.totalOrders += 1;

        await this.userService.updateBonusCardLevel(user);

        await this.userService.update(user.id, {
            bonusPoints: user.bonusPoints,
            totalOrders: user.totalOrders,
            bonusCardLevel: user.bonusCardLevel,
        });

        for (const cartItem of cartItems) {
            await this.productService.decreaseStock(cartItem.product.id, cartItem.quantity);
        }

        await this.cartService.clearCart(userId);

        return order;
    }

    async findOrderById(orderId: string): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id: parseInt(orderId, 10) },
            relations: ['user'],
        });

        if (!order) {
            throw new NotFoundException('Заказ не найден');
        }

        return order;
    }

    async getOrderItems(orderId: number): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['items', 'items.product'],
        });

        if (!order) {
            throw new NotFoundException(`Заказ с ID ${orderId} не найден`);
        }

        return order;
    }

    getOrderStatus(status: string): string {
        const statusMap = {
            created: 'Оформлен',
            confirmed: 'Подтвержден',
            assembled: 'Собран',
            delivered: 'Доставлен',
            canceled: 'Отменен',
        };
        return statusMap[status] || 'Неизвестный статус';
    }

    getDeliveryType(type: string): string {
        const typeMap = {
            courier: 'Курьерская доставка',
            pickup: 'Самовывоз',
        };
        return typeMap[type] || 'Неизвестный тип доставки';
    }
}