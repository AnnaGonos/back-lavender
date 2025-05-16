import {
  Resolver,
  Query,
  Args,
  Mutation,
  Int,
  ResolveField,
  Parent,
  CONTEXT,
  Context,
} from '@nestjs/graphql';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryService } from '../category/category.service';
import { CartService } from '../cart/cart.service';
import { EditProductPageData } from './dto/edit-product-page.data';
import { CatalogData } from './dto/catalog.data';
import { AddProductPageData } from './dto/add-product-page.data';
import { Category } from '../category/entities/category.entity';
import { Favorite } from '../favorite/entities/favorite.entity';
import { FavoriteService } from '../favorite/favorite.service';
import { UseFilters } from '@nestjs/common';
import { AllExceptionsFilter } from '../all.exception.filter';
import { Cart } from '../cart/entities/сart.entity';

@Resolver(() => Product)
@UseFilters(AllExceptionsFilter)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly cartService: CartService,
  ) {}

  @Query(() => CatalogData)
  async catalog(
    @Args('category', { nullable: true }) categoryName?: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number = 1,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number = 20,
  ) {
    const userId = 1;
    const { products, total } =
      await this.productService.getFilteredAndSortedProducts(
        categoryName,
        page,
        limit,
      );

    const categories = await this.categoryService.findAll();
    const cartItems = await this.cartService.getCartItems(userId);
    const productsWithCartStatus = await Promise.all(
      products.map(async (product) => ({
        ...product,
        inCart: cartItems.some((item) => item.productId === product.id),
      })),
    );

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      products: productsWithCartStatus,
      categories,
      query: { category: categoryName, page, limit },
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

  @Query(() => AddProductPageData)
  async addProductPage() {
    const categories = await this.categoryService.findAll();
    return {
      pageTitle: 'Добавить новый товар',
      categories,
    };
  }

  @Query(() => EditProductPageData)
  async editProductPage(@Args('id', { type: () => Int }) id: number) {
    const product = await this.productService.findOne(id);
    const categories = await this.categoryService.findAll();
    return {
      product,
      categories,
      pageTitle: 'Редактирование товара',
    };
  }

  @Query(() => Product)
  async product(@Args('id', { type: () => Int }) id: number) {
    return this.productService.findById(id);
  }

  @Query(() => Product)
  async productsByCategory(@Args('categoryName') categoryName: string) {
    return this.productService.findAllByCategory(categoryName);
  }

  @Query(() => Product)
  async latestOnlineProducts(
    @Args('limit', { type: () => Int, defaultValue: 4 }) limit: number,
  ) {
    return this.productService.findLatestOnlineProducts(limit);
  }

  @Query(() => Product)
  async sortedProducts(
    @Args('order', { type: () => String, defaultValue: 'DESC' })
    order: 'ASC' | 'DESC',
  ) {
    return this.productService.findAllSortedByDate(order);
  }

  @Query(() => Product)
  async archivedProducts() {
    return this.productService.findAllArchived();
  }

  @Mutation(() => Product)
  async createProduct(
    @Args('input') input: CreateProductDto,
  ): Promise<Product> {
    return this.productService.create(input);
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Args('id', { type: () => Int }) id: number) {
    await this.productService.delete(id);
    return true;
  }

  @Mutation(() => Boolean)
  async archiveProduct(@Args('id', { type: () => Int }) id: number) {
    await this.productService.archive(id);
    return true;
  }

  @Mutation(() => Boolean)
  async decreaseStock(
    @Args('productId', { type: () => Int }) productId: number,
    @Args('quantity', { type: () => Int }) quantity: number,
  ) {
    await this.productService.decreaseStock(productId, quantity);
    return true;
  }
}
