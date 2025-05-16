import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserStatus } from './user-status.enum';
import {UserRole} from "./user-role.enum";
import {Order} from "../../order/entities/order.entity";
import {Review} from "../../review/entities/review.entity";
import {Favorite} from "../../favorite/entities/favorite.entity";
import {Cart} from "../../cart/entities/сart.entity";
import {ApiProperty} from "@nestjs/swagger";
import {Field, Int, ObjectType} from "@nestjs/graphql";
import { IsOptional } from 'class-validator';

@Entity()
@ObjectType()
export class User {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'Id', type: Number, example: 1 })
    @Field(() => Int, { complexity: 1 })
    id: number;

    @Column()
    @ApiProperty({ description: 'Имя пользователя', type: String, example: 'Анна'})
    @Field({ complexity: 1 })
    firstName: string;

    @Column()
    @ApiProperty({ description: 'Фамилия пользователя', type: String, example: 'Гонос' })
    @Field({ complexity: 1 })
    lastName: string;

    @Column({ nullable: true })
    @ApiProperty({ description: 'Отчество пользователя', type: String, required: false, example: 'Сергеевна' })
    @Field({ nullable: true, complexity: 1 })
    middleName?: string;

    @Column()
    @ApiProperty({ description: 'Номер телефона пользователя', type: String, example: '+79681393338' })
    @Field({ complexity: 1 })
    phone: string;

    @Column({ unique: true })
    @ApiProperty({ description: 'Электронная почта пользователя', type: String, example: 'gonosanna@mail.ru' })
    @Field({ complexity: 1 })
    email: string;

    @Column()
    @ApiProperty({ description: 'Пароль пользователя (хэшированный)', type: String,
        example: '$2b$10$kksg9LpdcM5BTRfjv9oOcuMudY787.uG1Xv.25JxyRbXeGGU7vkSG'})
    @Field({ complexity: 1 })
    password: string;

    @Column({ default: 0 })
    @ApiProperty({ description: 'Количество бонусных баллов пользователя', type: Number, example: 666 })
    @Field(() => Int, { complexity: 1 })
    bonusPoints: number;

    @Column({ default: 2 })
    @ApiProperty({ description: 'Уровень бонусной карты пользователя', type: Number, example: 2 })
    @Field(() => Int, { complexity: 1 })
    bonusCardLevel: number;

    @Column({ default: 0 })
    @ApiProperty({ description: 'Общее количество заказов пользователя', type: Number, example: 5 })
    @Field(() => Int, { complexity: 1 })
    totalOrders: number; // общее количество заказов (эт для бонусной системы)

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    @ApiProperty({ description: 'Статус пользователя', enum: UserStatus, example: UserStatus.BLOCKED })
    @Field(() => UserStatus, { complexity: 1 })
    status: UserStatus;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    @ApiProperty({ description: 'Роль пользователя', enum: UserRole, example: UserRole.FLORIST,})
    @Field(() => UserRole, { complexity: 1 })
    type: UserRole;

    @OneToMany(() => Order, order => order.user)
    @ApiProperty({ description: 'Список заказов пользователя', type: Order })
    @Field(() => [Order], { nullable: true, complexity: ({ args }) => (args?.limit || 10) * 5 })
    orders: Order[];

    @OneToMany(() => Review, review => review.user)
    @ApiProperty({ description: 'Список отзывов пользователя', type: Review, required: false })
    @Field(() => [Review], { nullable: true, complexity: ({ args }) => (args?.limit || 10) * 5 })
    reviews: Review[];

    @OneToMany(() => Favorite, favorite => favorite.user)
    @ApiProperty({ description: 'Список избранных товаров пользователя', type: Favorite, required: false })
    @Field(() => [Favorite], { nullable: true, complexity: ({ args }) => (args?.limit || 10) * 5 })
    favorites: Favorite[];

    @OneToMany(() => Cart, cart => cart.user)
    @ApiProperty({ description: 'Список товаров в корзине пользователя', type: Cart, required: false })
    @Field(() => [Cart], { nullable: true, complexity: ({ args }) => (args?.limit || 10) * 5 })
    cart: Cart[];
}
