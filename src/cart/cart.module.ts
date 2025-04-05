import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import {CartService} from "./cart.service";
import {CartController} from "./cart.controller";
import {Cart} from "./entities/сart.entity";
import {CartMiddleware} from "./cart.middleware";
import {UserModule} from "../user/user.module";
import {FloristModule} from "../florist/florist.module";
import {OrderModule} from "../order/order.module";
import {OrderController} from "../order/order.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([Cart, User, Product]),
        UserModule,
        FloristModule,
        forwardRef(() => OrderModule),
        forwardRef(() => UserModule),
    ],
    controllers: [CartController, OrderController],
    providers: [CartService, CartMiddleware],
    exports: [CartService, CartMiddleware, TypeOrmModule],
})
export class CartModule {}