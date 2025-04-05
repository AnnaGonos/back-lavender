import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import {Favorite} from "./entities/favorite.entity";
import {FavoriteService} from "./favorite.service";
import {FavoriteController} from "./favorite.controller";
import {FavoritesMiddleware} from "./favorites.middleware";

@Module({
    imports: [
        TypeOrmModule.forFeature([Favorite, User, Product]),
    ],
    providers: [FavoriteService, FavoritesMiddleware],
    controllers: [FavoriteController],
    exports: [FavoriteService, FavoritesMiddleware, TypeOrmModule]
})
export class FavoriteModule {}