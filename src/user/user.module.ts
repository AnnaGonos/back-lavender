import {forwardRef, Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {UserService} from "./user.service";
import {ProfileController} from "./profile.controller";
import {UserController} from "./user.controller";
import {OrderModule} from "../order/order.module";
import {CartModule} from "../cart/cart.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => OrderModule),
        forwardRef(() => CartModule),
    ],
    controllers: [ProfileController, UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
