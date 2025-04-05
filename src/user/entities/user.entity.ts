import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserStatus } from './user-status.enum';
import {UserRole} from "./user-role.enum";
import {Order} from "../../order/entities/order.entity";
import {Review} from "../../review/entities/review.entity";
import {Favorite} from "../../favorite/entities/favorite.entity";
import {Cart} from "../../cart/entities/сart.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    middleName?: string;

    @Column()
    phone: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 0 })
    bonusPoints: number;

    @Column({ default: 2 })
    bonusCardLevel: number;

    @Column({ default: 0 })
    totalOrders: number; // общее количество заказов (эт для бонусной системы)

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE,})
    status: UserStatus;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER,})
    type: UserRole;

    @OneToMany(() => Order, order => order.user)
    orders: Order[];

    @OneToMany(() => Review, review => review.user)
    reviews: Review[];

    @OneToMany(() => Favorite, favorite => favorite.user)
    favorites: Favorite[];

    @OneToMany(() => Cart, cart => cart.user)
    cart: Cart[];
}
