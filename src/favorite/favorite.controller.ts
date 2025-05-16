import {
  Controller,
  Post,
  Param,
  Get,
  Render,
  UseFilters,
  Query,
  DefaultValuePipe,
  ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiExcludeController()
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  @Render('favorites')
  async getFavoritesPage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
  ) {
    const userId = 1;
    const { products, total } =
      await this.favoriteService.getFavoritesWithPagination(
        userId,
        page,
        limit,
      );
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      products,
      pageTitle: 'Избранные товары',
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    };
  }

  @Get('count')
  async getFavoritesCount(): Promise<{ count: number }> {
    const userId = 1;
    const count = await this.favoriteService.countFavorites(userId);
    return {
      count,
    };
  }

  @Get(':productId')
  async isProductInFavorites(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<{ inFavorites: boolean }> {
    const userId = 1;
    const inFavorites = await this.favoriteService.isProductInFavorites(
      userId,
      productId,
    );
    return {
      inFavorites,
    };
  }

  @Post(':productId')
  async toggleFavorite(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<{ added: boolean }> {
    const userId = 1;
    const result = await this.favoriteService.toggleFavorite(userId, productId);
    return result;
  }
}
