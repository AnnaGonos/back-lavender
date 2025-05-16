import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
} from 'typeorm';
import { IsOptional, IsNumber, ValidateIf } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from './payment.entity';
import { OrderStatus } from './order-status.enum';
import { PaymentMethod } from './payment-method.enum';
import { DeliveryType } from './delivery-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Order {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Id', type: Number, example: 1 })
  @Field(() => Int)
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  @ApiProperty({
    description: 'Пользователь, создавший заказ',
    type: () => User,
  })
  @Field(() => User)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  @ApiProperty({ description: 'Список товаров в заказе', type: OrderItem })
  @Field(() => OrderItem, { nullable: true })
  items: OrderItem[];

  @Column({ nullable: true })
  @IsOptional()
  @ApiProperty({
    description: 'Имя получателя',
    type: String,
    required: false,
    example: 'Светлана',
  })
  @Field({ nullable: true })
  recipientName?: string;

  @Column({ nullable: true })
  @IsOptional()
  @ApiProperty({
    description: 'Телефон получателя',
    type: String,
    required: false,
    example: '+79998887766',
  })
  @Field({ nullable: true })
  recipientPhone?: string;

  @Column({ type: 'float', default: 0 })
  @IsNumber({}, { message: 'Общая сумма должна быть числом' })
  @ApiProperty({
    description: 'Общая сумма заказа',
    type: Number,
    example: 1000.5,
  })
  @Field(() => Float)
  totalAmount: number;

  @Column({ default: 0 })
  @ApiProperty({
    description: 'Количество использованных бонусных баллов',
    type: Number,
    example: 50,
  })
  @Field(() => Int)
  bonusPointsUsed: number;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @ApiProperty({
    description: 'Интервал доставки',
    type: String,
    required: false,
    example: '12:00-15:00',
  })
  @Field({ nullable: true })
  deliveryInterval?: string;

  @Column({ nullable: true })
  @ValidateIf((order) => order.deliveryType === DeliveryType.COURIER)
  @ApiProperty({
    description: 'Адрес доставки',
    type: String,
    required: false,
    example: 'г.Партизанск, пер.Островной, д.1',
  })
  @Field({ nullable: true })
  deliveryAddress?: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.CREATED })
  @ApiProperty({
    description: 'Статус заказа',
    enum: OrderStatus,
    example: OrderStatus.DELIVERED,
  })
  @Field(() => OrderStatus)
  status: OrderStatus;

  @OneToMany(() => Payment, (payment) => payment.order)
  @ApiProperty({ description: 'Список платежей по заказу', type: [Payment] })
  @Field(() => [Payment], { nullable: true })
  payments: Payment[];

  @Column({ type: 'enum', enum: PaymentMethod })
  @IsOptional()
  @ApiProperty({
    description: 'Метод оплаты',
    enum: PaymentMethod,
    required: false,
    example: PaymentMethod.CASH,
  })
  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @Column({ type: 'enum', enum: DeliveryType })
  @IsOptional()
  @ApiProperty({
    description: 'Тип доставки',
    enum: DeliveryType,
    required: false,
    example: DeliveryType.COURIER,
  })
  @Field(() => DeliveryType)
  deliveryType: DeliveryType;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @ApiProperty({
    description: 'Дата доставки',
    type: String,
    required: false,
    example: '2025-04-30',
  })
  @Field(() => String, { nullable: true })
  deliveryDate?: string;
}
