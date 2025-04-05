import {Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column} from 'typeorm';
import {User} from "../../user/entities/user.entity";
import {Product} from "../../product/entities/product.entity";


@Entity()
export class Favorite {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.favorites)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Product, product => product.favorites, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    addedAt: Date;
}