import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CategoryModule } from '../category/category.module';
import {FavoriteModule} from "../favorite/favorite.module";
import {CartModule} from "../cart/cart.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Product]),
        CategoryModule,
        FavoriteModule,
        CartModule,
        MulterModule.register({
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const extension = extname(file.originalname);
                    callback(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
                },
            }),
        }),
    ],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule {}

