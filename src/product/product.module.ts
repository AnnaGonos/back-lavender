import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CategoryModule } from '../category/category.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { CartModule } from '../cart/cart.module';
import { NotificationModule } from '../notification/notification.module';
import { ProductResolver } from './product.resolver';
import { ProductApiController } from './product.api.controller';
import { CacheModule } from '@nestjs/common/cache';
import { CloudService } from '../cloud/cloud.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoryModule,
    FavoriteModule,
    NotificationModule,
    CartModule,
    CacheModule.register({
      ttl: 10,
    }),
  ],
  controllers: [ProductController, ProductApiController],
  providers: [ProductService, ProductResolver, CloudService],
  exports: [ProductService],
})
export class ProductModule {}
