import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import { FavoriteService } from './favorite.service';
import { Favorite } from './entities/favorite.entity';
import { PaginatedFavoritesDto } from './dto/paginated-favorites.dto';
import { UseFilters } from '@nestjs/common';
import { AllExceptionsFilter } from '../all.exception.filter';

@Resolver(() => Favorite)
@UseFilters(AllExceptionsFilter)
export class FavoriteResolver {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Query(() => PaginatedFavoritesDto)
  async getFavoritesWithPagination(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<PaginatedFavoritesDto> {
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
      items: products,
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

  @Mutation(() => Boolean)
  async toggleFavorite(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('productId', { type: () => Int }) productId: number,
  ) {
    const result = await this.favoriteService.toggleFavorite(userId, productId);
    return result.added;
  }

  @Query(() => Int)
  async countFavorites(@Args('userId', { type: () => Int }) userId: number) {
    return this.favoriteService.countFavorites(userId);
  }

  @Query(() => Boolean)
  async isProductInFavorites(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('productId', { type: () => Int }) productId: number,
  ) {
    return this.favoriteService.isProductInFavorites(userId, productId);
  }
}
