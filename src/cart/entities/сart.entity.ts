import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import {User} from "../../user/entities/user.entity";
import {Product} from "../../product/entities/product.entity";
import {IsNumber} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Field, Int, ObjectType} from "@nestjs/graphql";

@Entity()
@ObjectType()
export class Cart {
    @PrimaryGeneratedColumn()
    @IsNumber()
    @ApiProperty({ description: 'Id', type: Number, example: 1 })
    @Field(() => Int)
    id: number;

    @ManyToOne(() => User, user => user.cart)
    @JoinColumn({ name: 'user_id' })
    @ApiProperty({ description: 'Пользователь', type: () => User })
    @Field(() => User)
    user: User;

    @ManyToOne(() => Product, product => product.cartItems)
    @JoinColumn({ name: 'product_id' })
    @ApiProperty({ description: 'Товар', type: () => Product })
    @Field(() => Product)
    product: Product;

    @Column({ default: 1 })
    @ApiProperty({ description: 'Количество товара в корзине', type: Number, example: 3, default: 1 })
    @Field(() => Int)
    quantity: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @ApiProperty({ description: 'Дата добавления товара в корзину', type: Date, example: '2023-10-01T12:34:56Z' })
    @Field()
    addedAt: Date;
}
