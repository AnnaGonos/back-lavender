import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import {PaymentMethod} from "./payment-method.enum";
import {PaymentStatus} from "./payment-status.enum";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, order => order.payments)
    order: Order;

    @Column({ type: 'float' })
    amount: number;

    @Column({ type: 'enum', enum: PaymentMethod })
    method: PaymentMethod;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
    status: PaymentStatus;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date;
}