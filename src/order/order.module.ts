import {forwardRef, Module} from '@nestjs/common';
import {Order} from "./entities/order.entity";
import {Payment} from "./entities/payment.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OrderItem} from "./entities/order-item.entity";
import {OrderController} from "./order.controller";
import {OrderService} from "./order.service";
import {Cart} from "../cart/entities/сart.entity";
import {Product} from "../product/entities/product.entity";
import {Category} from "../category/entities/category.entity";
import {FavoriteModule} from "../favorite/favorite.module";
import {ProductModule} from "../product/product.module";
import {CartModule} from "../cart/cart.module";
import {CategoryModule} from "../category/category.module";
import {User} from "../user/entities/user.entity";
import {UserModule} from "../user/user.module";
import {NotificationModule} from "../notification/notification.module";
import { OrderResolver } from './order.resolver';
import { OrderApiController } from './order.api.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, User, Cart, Category, Product, Payment, OrderItem]),
        FavoriteModule,
        ProductModule,
        NotificationModule,
        forwardRef(() => CartModule),
        CategoryModule,
        forwardRef(() => UserModule),
    ],
    providers: [OrderService, OrderResolver],
    controllers: [OrderController, OrderApiController],
    exports: [OrderService],
})
export class OrderModule {}
