import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { OrderModule } from '../order/order.module';
import { CartModule } from '../cart/cart.module';
import { UserResolver } from './user.resolver';
import { ReviewModule } from '../review/review.module';
import { JwtModule } from '@nestjs/jwt';
import { UserApiController } from './user.api.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => OrderModule),
    forwardRef(() => CartModule),
    forwardRef(() => ReviewModule),
    JwtModule,
  ],
  controllers: [UserController, UserApiController],
  providers: [UserService, UserResolver],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}