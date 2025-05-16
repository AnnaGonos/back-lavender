import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import {PaymentMethod} from "./payment-method.enum";
import {PaymentStatus} from "./payment-status.enum";
import {ApiProperty} from "@nestjs/swagger";
import {Field, Float, Int, ObjectType} from "@nestjs/graphql";

@Entity()
@ObjectType()
export class Payment {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'Id', type: Number, example: 1 })
    @Field(() => Int)
    id: number;

    @ManyToOne(() => Order, order => order.payments)
    @ApiProperty({ description: 'Заказ, связанный с платежом', type: () => Order })
    @Field(() => Order)
    order: Order;

    @Column({ type: 'float' })
    @ApiProperty({ description: 'Сумма платежа', type: Number, example: 2500 })
    @Field(() => Float)
    amount: number;

    @Column({ type: 'enum', enum: PaymentMethod })
    @ApiProperty({description: 'Метод оплаты', enum: PaymentMethod, example: PaymentMethod.CASH })
    @Field(() => PaymentMethod)
    method: PaymentMethod;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
    @ApiProperty({ description: 'Статус платежа', enum: PaymentStatus, default: PaymentStatus.PENDING,
        example: PaymentStatus.COMPLETED })
    @Field(() => PaymentStatus)
    status: PaymentStatus;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @ApiProperty({ description: 'Дата создания платежа', type: Date, example: '2023-10-01T12:34:56Z' })
    @Field()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    @ApiProperty({ description: 'Дата обновления платежа', type: Date, required: false, example: '2023-10-02T15:45:00Z' })
    @Field({ nullable: true })
    updatedAt: Date;
}
