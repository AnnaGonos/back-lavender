import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteModule } from './favorite/favorite.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';
import AppDataSource from './typeorm.config';
import { CategoryModule } from './category/category.module';
import { FavoritesMiddleware } from './favorite/favorites.middleware';
import { CartModule } from './cart/cart.module';
import { CartMiddleware } from './cart/cart.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { complexityLimitPlugin } from './complexity-limit.plugin';
import { TimingInterceptor } from './timing.interceptor';
import { CacheModule } from '@nestjs/common/cache';
import { CloudModule } from './cloud/cloud.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { JwtConfigModule } from './jwt/jwt-config.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtConfigModule,
    CacheModule.register({
      ttl: 10,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      introspection: true,
      plugins: [complexityLimitPlugin(100)],
    }),
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
    ReviewModule,
    CategoryModule,
    ReviewModule,
    UserModule,
    AuthModule,
    CloudModule
  ],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TimingInterceptor,
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
    consumer.apply(FavoritesMiddleware).forRoutes('*');
    consumer.apply(CartMiddleware).forRoutes('*');
  }
}
