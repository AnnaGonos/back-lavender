import {
  Controller,
  Post,
  Param,
  Get,
  Render,
  UseFilters,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Favorite } from './entities/favorite.entity';
import { AllExceptionsFilter } from '../all.exception.filter';

@ApiTags('favorites')
@UseFilters(AllExceptionsFilter)
@Controller('api/favorites')
export class FavoriteApiController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  @ApiOperation({ summary: 'Получение страницы избранного с пагинацией' })
  @ApiOkResponse({
    description: 'Список избранных товаров успешно получен',
    type: Favorite,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    example: 1,
    description: 'Номер страницы',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    example: 20,
    description: 'Количество товаров на странице',
  })
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
  @ApiOperation({ summary: 'Получение количества товаров в избранном' })
  @ApiOkResponse({
    description: 'Количество товаров успешно получено',
    schema: { example: { count: 35 } },
  })
  async getFavoritesCount(): Promise<{ count: number }> {
    const userId = 1;
    const count = await this.favoriteService.countFavorites(userId);
    return {
      count,
    };
  }

  @Get(':productId')
  @ApiOperation({
    summary: 'Проверка наличия товара в избранном',
    description:
      'Проверяет, добавлен ли указанный товар в избранное пользователя.',
  })
  @ApiOkResponse({
    description: 'Статус товара успешно проверен',
    schema: { example: { inFavorites: true } },
  })
  @ApiParam({
    name: 'productId',
    type: Number,
    description: 'Id товара',
    example: 101,
  })
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

  @Post('api/:productId')
  @ApiOperation({
    summary: 'Добавление или удаление товара из избранного',
    description:
      'Переключает статус товара (добавляет или удаляет из избранного)',
  })
  @ApiCreatedResponse({
    description: 'Товар успешно добавлен или удален из избранного',
    schema: { example: { added: true } },
  })
  @ApiBadRequestResponse({ description: 'Неверные данные запроса' })
  @ApiParam({
    name: 'productId',
    type: Number,
    description: 'Id товара',
    example: 101,
  })
  async toggleFavorite(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<{ added: boolean }> {
    const userId = 1;
    const result = await this.favoriteService.toggleFavorite(userId, productId);
    return result;
  }
}
