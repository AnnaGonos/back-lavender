import {Controller, Post, Body, Param, Get, Render} from '@nestjs/common';
import { FavoriteService } from './favorite.service';

@Controller('favorites')
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) {}

    @Get('')
    @Render('favorites')
    async getFavoritesPage() {
        const userId = 1;
        const products = await this.favoriteService.getFavorites(userId);
        return { products, pageTitle: 'Избранные товары' };
    }

    @Get('count')
    async getFavoritesCount(): Promise<{ count: number }> {
        const userId = 1;
        const count = await this.favoriteService.countFavorites(userId);
        return { count };
    }

    @Post(':productId')
    async toggleFavorite(@Param('productId') productId: string): Promise<{ added: boolean }> {
        const userId = 1;
        const result = await this.favoriteService.toggleFavorite(userId, parseInt(productId, 10));
        return result;
    }

    @Get(':productId')
    async isProductInFavorites(@Param('productId') productId: string): Promise<{ inFavorites: boolean }> {
        const userId = 1;
        const inFavorites = await this.favoriteService.isProductInFavorites(userId, parseInt(productId, 10));
        return { inFavorites };
    }
}