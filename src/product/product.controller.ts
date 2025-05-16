import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Render,
  Redirect,
  UseInterceptors,
  Query,
  UploadedFile,
  UseFilters,
  DefaultValuePipe,
  ParseIntPipe,
  Header, Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryService } from '../category/category.service';
import { CartService } from '../cart/cart.service';
import { AllExceptionsFilter } from '../all.exception.filter';
import { ApiExcludeController } from '@nestjs/swagger';
import { FavoriteService } from '../favorite/favorite.service';
import { EtagInterceptor } from '../etag.interceptor';
import { CloudService } from '../cloud/cloud.service';

@Controller()
@ApiExcludeController()
@UseInterceptors(EtagInterceptor)
@UseFilters(AllExceptionsFilter)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly cartService: CartService,
    private readonly favoriteService: FavoriteService,
    private readonly cloudService: CloudService,
  ) {}

  @Post('florist/products/add')
  @UseInterceptors(FileInterceptor('image'))
  async addProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const bucketName = 'florist-lavanda';
    const objectKey = `products/${Date.now()}-${file.originalname}`;

    createProductDto.imageUrl = await this.cloudService.uploadFile(
      file,
      bucketName,
      objectKey,
    );

    await this.productService.create(createProductDto);
  }

  @Get('catalog')
  @Render('catalog')
  @Header('Cache-Control', 'public, max-age=10')
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

  @Get('product/:id')
  @Render('products-main')
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

  @Get('florist/products')
  @Render('florist/products/all')
  async getProductsPage(
    @Query('category') category: string,
    @Query('sort') sort: string,
  ) {
    let products;

    if (category) {
      products = await this.productService.findAllByCategory(category);
    } else if (sort === 'newest') {
      products = await this.productService.findAllSortedByDate('DESC');
    } else if (sort === 'oldest') {
      products = await this.productService.findAllSortedByDate('ASC');
    } else {
      products = await this.productService.findAllActive();
    }

    const categories = await this.categoryService.findAll();

    return {
      products,
      categories,
      query: { category, sort },
      pageTitle: 'Работа с товарами',
    };
  }

  @Get('florist/products/add')
  @Render('florist/products/add')
  async getAddProductPage() {
    const categories = await this.categoryService.findAll();
    return {
      pageTitle: 'Добавить новый товар',
      categories,
    };
  }

  @Get('florist/products/:id/edit')
  @Render('florist/products/edit')
  async getEditProductPage(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productService.findOne(id);

    const categories = await this.categoryService.findAll();
    return { product, categories, pageTitle: 'Редактирование товара' };
  }

  @Get('florist/products/archived')
  @Render('florist/products/archived')
  async getArchivedProductsPage() {
    const products = await this.productService.findAllArchived();
    return {
      products,
      pageTitle: 'Архивированные товары',
    };
  }

  @Patch('florist/products/:id')
  @UseInterceptors(FileInterceptor('image'))
  @Redirect('/florist/products')
  async editProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file && file.originalname) {
      const bucketName = 'florist-lavanda';
      const objectKey = `products/${Date.now()}-${file.originalname}`;

      updateProductDto.imageUrl = await this.cloudService.uploadFile(
        file,
        bucketName,
        objectKey,
      );
    } else {
      delete updateProductDto.imageUrl;
    }

    await this.productService.update(id, updateProductDto);
  }

  @Patch('florist/products/:id/archive')
  @Redirect('/florist/products/archived')
  async archiveProduct(@Param('id', ParseIntPipe) id: number) {
    await this.productService.archive(id);
  }

  @Delete('florist/products/:id')
  @Redirect('/florist/products/archived')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    await this.productService.delete(id);
  }
}
