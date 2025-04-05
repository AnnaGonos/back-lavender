import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import {User} from "../../user/entities/user.entity";
import {Product} from "../../product/entities/product.entity";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.cart)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Product, product => product.cartItems)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ default: 1 })
    quantity: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    addedAt: Date;
}