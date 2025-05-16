import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../product/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class OrderItem {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Id', type: Number, example: 1 })
  @Field(() => Int)
  id: number;

  @ManyToOne(() => Order, (order) => order.items)
  @ApiProperty({
    description: 'Заказ к которому принадлежит товар',
    type: () => Order,
  })
  @Field(() => Order)
  order: Order;

  @ManyToOne(() => Product)
  @ApiProperty({ description: 'Товар  в заказе', type: () => Product })
  @Field(() => Product)
  product: Product;

  @Column()
  @ApiProperty({
    description: 'Количество товара в заказе',
    type: Number,
    example: 3,
  })
  @Field(() => Int)
  quantity: number;

  @Column({ type: 'float', select: false })
  @ApiProperty({
    description: 'Общая стоимость товара (price * quantity)',
    type: Number,
    example: 2000,
  })
  @Field(() => Float)
  get totalPrice(): number {
    return this.product.price * this.quantity;
  }
}
