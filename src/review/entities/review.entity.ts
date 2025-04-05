import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import {User} from "../../user/entities/user.entity";
import {Product} from "../../product/entities/product.entity";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.reviews)
    user: User;

    @ManyToOne(() => Product, product => product.reviews)
    product: Product;

    @Column({ type: 'int' })
    rating: number;

    @Column({ type: 'text' })
    description?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
