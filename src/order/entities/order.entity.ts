import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import {Payment} from "./payment.entity";
import {User} from "../../user/entities/user.entity";
import {OrderItem} from "./order-item.entity";
import {OrderStatus} from "./order-status.enum";
import {PaymentMethod} from "./payment-method.enum";
import {DeliveryType} from "./delivery-type.enum";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.orders)
    user: User;

    @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
    items: OrderItem[];

    @Column({ nullable: true })
    recipientName?: string;

    @Column({ nullable: true })
    recipientPhone?: string;

    @Column({ type: 'float', default: 0 })
    totalAmount: number;

    @Column({ default: 0 })
    bonusPointsUsed: number;

    @Column({ type: 'varchar', nullable: true })
    deliveryInterval?: string;

    @Column({ nullable: true })
    deliveryAddress?: string;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.CREATED })
    status: OrderStatus;

    @OneToMany(() => Payment, payment => payment.order)
    payments: Payment[];

    @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
    paymentMethod?: PaymentMethod;

    @Column({ type: 'enum', enum: DeliveryType, nullable: true })
    deliveryType?: DeliveryType;

    @Column({ type: 'date', nullable: true })
    deliveryDate?: Date;
}
