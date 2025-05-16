import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  Query,
  UploadedFile,
  UseFilters,
  DefaultValuePipe,
  ParseIntPipe, Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryService } from '../category/category.service';
import { multerConfig } from './multerConfig';
import { CartService } from '../cart/cart.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { FavoriteService } from '../favorite/favorite.service';

@ApiTags('products')
@Controller('api/products')
export class ProductApiController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly cartService: CartService,
    private readonly favoriteService: FavoriteService,
  ) {}

  @Get('archived')
  @ApiOperation({ summary: 'Получение страницы архивированных товаров' })
  @ApiOkResponse({
    description: 'Страница архивированных товаров успешно получена',
    type: Product,
    isArray: true,
  })
  async getArchivedProductsPage() {
    return await this.productService.findAllArchived();
  }

  @Get()
  @ApiOperation({ summary: 'Получение каталога товаров' })
  @ApiOkResponse({
    description: 'Каталог товаров успешно получен',
    type: Product,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Фильтр по категории',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество элементов на странице',
  })
  async getCatalogPage(
    @Query('category') categoryName?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
    @Request() req?,
  ) {
    const { products, total } =
      await this.productService.getFilteredAndSortedProducts(
        categoryName,
        page,
        limit,
      );

    const categories = await this.categoryService.findAll();

    let userId = null;
    if (req.user) {
      userId = req.user.id;
    }

    const cartItems = userId ? await this.cartService.getCartItems(userId) : [];

    const productsWithStatuses = await Promise.all(
      products.map(async (product) => ({
        ...product,
        inCart: cartItems.some((item) => item.product.id === product.id),
        isFavorite: userId
          ? await this.favoriteService.isProductInFavorites(userId, product.id)
          : false,
      })),
    );

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      products: productsWithStatuses,
      categories,
      query: { category: categoryName, page, limit },
      pageTitle: categoryName ? `${categoryName}` : 'Каталог товаров',
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

  @Get('/new')
  @ApiOperation({
    summary: 'Получение самых новых товаров для главной страницы',
  })
  @ApiOkResponse({
    description: 'Список новых товаров успешно получен',
    type: Product,
  })
  async getNewProducts() {
    const userId = 1;

    const { products } = await this.productService.getFilteredAndSortedProducts(
      undefined,
      1,
      4,
      true,
    );

    const cartItems = await this.cartService.getCartItems(userId);

    const productsWithStatuses = await Promise.all(
      products.map(async (product) => ({
        ...product,
        inCart: cartItems.some((item) => item.productId === product.id),
        isFavorite: await this.favoriteService.isProductInFavorites(userId, product.id),
      }))
    );

    return { products: productsWithStatuses };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отдельная страница товара с основной информацией' })
  @ApiOkResponse({
    description: 'Отдельная страница товара успешно загружена',
    type: Product,
  })
  @ApiNotFoundResponse({ description: 'Товар не найден' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Id товара',
    example: 101,
  })
  async getProductPage(@Param('id', ParseIntPipe) productId: number) {
    const product = await this.productService.findById(productId);

    const userId = 1;
    const alreadyInCart = await this.cartService.isProductInCart(
      userId,
      product.id,
    );

    return {
      product: {
        ...product,
        inCart: alreadyInCart,
      },
    };
  }

  @Get('add')
  @ApiOperation({ summary: 'Получение страницы добавления нового товара' })
  @ApiOkResponse({ description: 'Страница добавления товара успешно получена' })
  async getAddProductPage() {
    const categories = await this.categoryService.findAll();
    return {
      pageTitle: 'Добавить новый товар',
      categories,
    };
  }

  @Get(':id/edit')
  @ApiOperation({ summary: 'Страница редактирования товара' })
  @ApiOkResponse({
    description: 'Страница редактирования товара успешно загружена',
    type: Product,
  })
  @ApiNotFoundResponse({ description: 'Товар не найден' })
  @ApiParam({ name: 'id', type: Number, description: 'Id товара', example: 1 })
  async getEditProductPage(@Param('id') id: string) {
    const product = await this.productService.findOne(+id);

    const categories = await this.categoryService.findAll();
    return { product, categories, pageTitle: 'Редактирование товара' };
  }

  @Post('add')
  @ApiOperation({ summary: 'Добавление нового товара' })
  @ApiCreatedResponse({ description: 'Товар успешно добавлен' })
  @ApiBadRequestResponse({ description: 'Неверные данные запроса' })
  @UseInterceptors(FileInterceptor('image'))
  async addProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.productService.create(createProductDto);
  }

  @Patch('florist/products/:id')
  @ApiOperation({ summary: 'Обновление товара' })
  @ApiOkResponse({ description: 'Товар успешно обновлен' })
  @ApiBadRequestResponse({ description: 'Неверные данные запроса' })
  @ApiNotFoundResponse({ description: 'Товар не найден' })
  @UseInterceptors(FileInterceptor('image'))
  @ApiParam({ name: 'id', type: Number, description: 'ID товара', example: 1 })
  async editProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    await this.productService.update(+id, updateProductDto);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Архивирование товара' })
  @ApiOkResponse({ description: 'Товар успешно архивирован' })
  @ApiBadRequestResponse({ description: 'Неверные данные запроса' })
  @ApiNotFoundResponse({ description: 'Товар не найден' })
  @ApiParam({ name: 'id', type: Number, description: 'ID товара', example: 1 })
  async archiveProduct(@Param('id') id: string) {
    await this.productService.archive(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление товара' })
  @ApiNoContentResponse({ description: 'Товар успешно удален' })
  @ApiBadRequestResponse({ description: 'Неверные данные запроса' })
  @ApiNotFoundResponse({ description: 'Товар не найден' })
  @ApiParam({ name: 'id', type: Number, description: 'ID товара', example: 1 })
  async deleteProduct(@Param('id') id: string) {
    await this.productService.delete(+id);
  }
}
