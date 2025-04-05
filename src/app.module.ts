import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { FavoriteModule } from './favorite/favorite.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';
import AppDataSource from "./typeorm.config";
import {FloristModule} from "./florist/florist.module";
import {CategoryModule} from "./category/category.module";
import {FavoritesMiddleware} from "./favorite/favorites.middleware";
import {CartModule} from "./cart/cart.module";
import {CartMiddleware} from "./cart/cart.middleware";

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    CartModule,
    FavoriteModule,
    OrderModule,
    ProductModule,
    FloristModule,
    CategoryModule,
    ReviewModule,
    UserModule,
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FavoritesMiddleware).forRoutes('*');
    consumer.apply(CartMiddleware).forRoutes('*');
  }
}