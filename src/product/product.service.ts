import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../category/entities/category.entity';
import { Favorite } from '../favorite/entities/favorite.entity';
import { Cart } from '../cart/entities/сart.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      where: { quantityInStock: MoreThan(0) }, // токльо товары с количеством > 0
      relations: ['category'],
    });
  }

  async findById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with #${id} not found`);
    }

    return product;
  }

  async findAllByCategory(categoryName: string): Promise<Product[]> {
    if (categoryName === 'all') {
      return this.productRepository.find({
        where: { quantityInStock: MoreThan(0) },
        relations: ['category'],
      });
    }

    return this.productRepository.find({
      where: { category: { name: categoryName }, quantityInStock: MoreThan(0) },
      relations: ['category'],
    });
  }

  async findLatestOnlineProducts(limit = 4): Promise<Product[]> {
    return this.productRepository.find({
      where: { category: { name: 'Онлайн-витрина' } },
      relations: ['category'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findAllSortedByDate(order: 'ASC' | 'DESC'): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        quantityInStock: MoreThan(0),
      },
      relations: ['category'],
      order: { createdAt: order },
    });
  }

  async findAllActive(): Promise<Product[]> {
    return this.productRepository.find({
      where: { quantityInStock: MoreThan(0) }, // только активные товары
      relations: ['category'],
    });
  }

  async findAllArchived(): Promise<Product[]> {
    return this.productRepository.find({
      where: { quantityInStock: 0 },
      relations: ['category'],
    });
  }

  async create(
    createProductDto: CreateProductDto,
  ) {
    const { categoryName, ...productData } = createProductDto;

    const category = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });

    if (!category) {
      throw new NotFoundException(`Category not found`);
    }

    const product = this.productRepository.create({
      ...productData,
      category,
    });

    return this.productRepository.save(product);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['cartItems', 'category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with #${id} not found`);
    }

    Object.assign(product, updateProductDto);

    if (updateProductDto.categoryName) {
      const category = await this.categoryRepository.findOne({
        where: { name: updateProductDto.categoryName },
      });

      if (!category) {
        throw new NotFoundException(`Category not found`);
      }

      product.category = category;
    }

    if (
      updateProductDto.quantityInStock !== undefined &&
      product.cartItems.length > 0
    ) {
      for (const cartItem of product.cartItems) {
        if (cartItem.quantity > updateProductDto.quantityInStock) {
          cartItem.quantity = updateProductDto.quantityInStock;
          await this.cartRepository.save(cartItem);
        }
      }
    }

    return this.productRepository.save(product);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with #${id} not found`);
    }

    return product;
  }

  async delete(id: number): Promise<void> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product with #${id} not found`);
    }

    await this.favoriteRepository.delete({ product: { id } });
    await this.cartRepository.delete({ product: { id } });
    await this.productRepository.remove(product);
  }

  async archive(id: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['cartItems'],
    });

    if (!product) {
      throw new NotFoundException(`Product with #${id} not found`);
    }

    console.log(`Archiving product with ID: ${id}`);
    product.quantityInStock = 0;

    await this.cartRepository.delete({ product: { id } });

    await this.productRepository.save(product);
  }

  async getFilteredAndSortedProducts(
    categoryName?: string,
    page: number = 1,
    limit: number = 20,
    sortByNewest: boolean = false,
  ): Promise<{ products: Product[]; total: number }> {
    const cacheKey = 'products_all';
    const cachedData = await this.cacheManager.get<{ products: Product[]; total: number }>(cacheKey);

    if (cachedData) {
      console.log('Products fetched from cache');
      return cachedData;
    }

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    queryBuilder.leftJoinAndSelect('product.category', 'category');
    queryBuilder.where('product.quantityInStock > :quantity', { quantity: 0 });

    if (categoryName) {
      queryBuilder.andWhere('category.name = :categoryName', { categoryName });
      const categoryExists = await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('product.category', 'category')
        .where('category.name = :categoryName', { categoryName })
        .getExists();

      if (!categoryExists) {
        throw new NotFoundException(`Category "${categoryName}" not found`);
      }
    }

    if (sortByNewest) {
      queryBuilder.orderBy('product.createdAt', 'DESC');
    }

    const [products, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const data = { products, total };
    await this.cacheManager.set(cacheKey, data, 10000);
    console.log('Products fetched from database');
    return data;
  }

  // при заказе уменьшаем количество
  async decreaseStock(productId: number, quantity: number): Promise<void> {
    const product = await this.productRepository.findOneBy({ id: productId });

    if (!product) {
      throw new NotFoundException(`Product with #${productId} not found`);
    }

    if (product.quantityInStock < quantity) {
      throw new Error(
        `Недостаточно товара а магазине с ID ${productId}`,
      );
    }

    product.quantityInStock -= quantity;
    await this.productRepository.save(product);
  }
}
