import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from 'typeorm';
import {Category} from "../../category/entities/category.entity";
import {Favorite} from "../../favorite/entities/favorite.entity";
import {Review} from "../../review/entities/review.entity";
import {Cart} from "../../cart/entities/сart.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Category, category => category.products)
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column({ nullable: true })
    composition?: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ nullable: true })
    imageUrl?: string;

    @Column({ nullable: true })
    imageDescription?: string;

    @Column()
    price: number;

    @Column({ nullable: true })
    discount?: number;

    @Column()
    quantityInStock: number;

    @OneToMany(() => Cart, cart => cart.product)
    cartItems: Cart[];

    @OneToMany(() => Review, review => review.product)
    reviews: Review[];

    @OneToMany(() => Favorite, favorite => favorite.product)
    favorites: Favorite[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
