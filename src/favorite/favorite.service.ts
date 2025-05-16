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

  async getFavoritesWithPagination(
    userId: number,
    page: number,
    limit: number,
  ): Promise<{ products: Product[]; total: number }> {
    const [favorites, total] = await this.favoriteRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['product'],
      skip: (page - 1) * limit,
      take: limit,
    });

    const products = favorites.map((favorite) => favorite.product);

    return {
      products,
      total,
    };
  }

  async toggleFavorite(
    userId: number,
    productId: number,
  ): Promise<{ added: boolean }> {
    const favorite = await this.favoriteRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (favorite) {
      await this.favoriteRepository.remove(favorite);
      return { added: false };
    } else {
      const newFavorite = this.favoriteRepository.create({
        user: { id: userId },
        product: { id: productId },
      });
      await this.favoriteRepository.save(newFavorite);
      return {
        added: true,
      };
    }
  }

  async countFavorites(userId: number): Promise<number> {
    return await this.favoriteRepository.count({
      where: { user: { id: userId } },
    });
  }

  async isProductInFavorites(
    userId: number,
    productId: number,
  ): Promise<boolean> {
    const favorite = await this.favoriteRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    return !!favorite;
  }

  async getFavoriteItems(userId: number) {
    return await this.favoriteRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }
}
