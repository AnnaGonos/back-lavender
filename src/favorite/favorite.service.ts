import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class FavoriteService {
    constructor(
        @InjectRepository(Favorite)
        private readonly favoriteRepository: Repository<Favorite>,
    ) {}

    async toggleFavorite(userId: number, productId: number): Promise<{ added: boolean }> {
        const favorite = await this.favoriteRepository.findOne({
            where: { user: { id: userId }, product: { id: productId } },
        });

        if (favorite) {
            // Если товар уже в избранном, удаляем его
            await this.favoriteRepository.remove(favorite);
            return { added: false };
        } else {
            const newFavorite = this.favoriteRepository.create({
                user: { id: userId },
                product: { id: productId },
            });
            await this.favoriteRepository.save(newFavorite);
            return { added: true };
        }
    }

    async countFavorites(userId: number): Promise<number> {
        return await this.favoriteRepository.count({
            where: { user: { id: userId } },
        });
    }

    async isProductInFavorites(userId: number, productId: number): Promise<boolean> {
        const favorite = await this.favoriteRepository.findOne({
            where: { user: { id: userId }, product: { id: productId } },
        });
        return !!favorite;
    }

    async getFavorites(userId: number): Promise<Product[]> {
        const favorites = await this.favoriteRepository.find({
            where: { user: { id: userId } },
            relations: ['product'],
        });

        return favorites.map((favorite) => favorite.product);
    }
}