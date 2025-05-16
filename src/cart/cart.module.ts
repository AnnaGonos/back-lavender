import {forwardRef, Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import {CartService} from "./cart.service";
import {CartController} from "./cart.controller";
import {Cart} from "./entities/сart.entity";
import {CartMiddleware} from "./cart.middleware";
import {UserModule} from "../user/user.module";
import {OrderModule} from "../order/order.module";
import {OrderController} from "../order/order.controller";
import {NotificationModule} from "../notification/notification.module";
import { CartResolver } from './cart.resolver';
import { CartApiController } from './cart.api.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([Cart, User, Product]),
        UserModule,
        JwtModule,
        NotificationModule,
        forwardRef(() => OrderModule),
        forwardRef(() => UserModule),
    ],
    controllers: [CartController, OrderController, CartApiController],
    providers: [CartService, CartMiddleware, CartResolver],
    exports: [CartService, CartMiddleware, TypeOrmModule],
})
export class CartModule {}
