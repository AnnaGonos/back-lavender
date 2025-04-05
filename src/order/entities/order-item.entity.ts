import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Order} from "./order.entity";
import {Product} from "../../product/entities/product.entity";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, order => order.items)
    order: Order;

    @ManyToOne(() => Product)
    product: Product;

    @Column()
    quantity: number;

    @Column({ type: 'float', select: false })
    get totalPrice(): number {
        return this.product.price * this.quantity;
    }
}
