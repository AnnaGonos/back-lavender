import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Product } from './entities/product.entity';
import {CreateProductDto} from "./dto/create-product.dto";
import {UpdateProductDto} from "./dto/update-product.dto";
import {Category} from "../category/entities/category.entity";
import {FavoriteService} from "../favorite/favorite.service";
import {Favorite} from "../favorite/entities/favorite.entity";
import {UpdateCategoryDto} from "../category/dto/update-category.dto";
import {Cart} from "../cart/entities/сart.entity";
import {Observable} from "rxjs";

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
    ) {}

    async findAll(): Promise<Product[]> {
        return this.productRepository.find({
            where: { quantityInStock: MoreThan(0) }, // токльо товары с количеством > 0
            relations: ['category'],
        });
    }

    async findById(id: string): Promise<Product> {
        // @ts-ignore
        return this.productRepository.findOne({
            // @ts-ignore
            where: { id },
            relations: ['category'],
        });
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

    async getAllCategories(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    async findAllSortedByDate(order: 'ASC' | 'DESC'): Promise<Product[]> {
        return this.productRepository.find({
            where: {
                quantityInStock: MoreThan(0)
            },
            relations: ['category'],
            order: { createdAt: order },
        });
    }

    async create(createProductDto: CreateProductDto, file?: Express.Multer.File): Promise<Product> {
        const { categoryName, ...productData } = createProductDto;

        const category = await this.categoryRepository.findOne({
            where: { name: categoryName },
        });

        if (!category) {
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
        }

        // @ts-ignore
        const product = this.productRepository.create({
            ...productData, category, imageUrl: file ? `/uploads/${file.filename}` : null, });

        // @ts-ignore
        return this.productRepository.save(product);
    }

    async update(id: number, updateProductDto: UpdateProductDto, file?: Express.Multer.File): Promise<void> {
        const product = await this.productRepository.findOne({
            where: {id},
            relations: ['cartItems'],
        });

        if (!product) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }

        Object.assign(product, updateProductDto);

        if (file) {
            product.imageUrl = `/uploads/${file.filename}`;
        }

        if (updateProductDto.categoryName) {
            const category = await this.categoryRepository.findOne({
                where: {name: updateProductDto.categoryName},
            });

            if (!category) {
                throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
            }

            product.category = category;
        }

        if (updateProductDto.quantityInStock !== undefined && product.cartItems.length > 0) {
            for (const cartItem of product.cartItems) {
                if (cartItem.quantity > updateProductDto.quantityInStock) {
                    cartItem.quantity = updateProductDto.quantityInStock;
                    await this.cartRepository.save(cartItem);
                }
            }
        }

        await this.productRepository.save(product);
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.productRepository.findOneBy({ id });
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }


    async delete(id: number): Promise<void> {
        console.log(`Deleting product with ID in service: ${id}`); // Логируем ID

        const product = await this.productRepository.findOneBy({ id });

        if (!product) {
            console.error(`Product with ID ${id} not found`);
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }

        console.log(`Found product:`, product); // Логируем найденный товар

        await this.favoriteRepository.delete({ product: { id } });
        await this.cartRepository.delete({ product: { id } });
        await this.productRepository.remove(product);

        console.log(`Product with ID ${id} successfully deleted`); // Логируем успешное удаление
    }

    async archive(id: number): Promise<void> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['cartItems'],
        });

        if (!product) {
            throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
        }

        console.log(`Archiving product with ID: ${id}`);
        product.quantityInStock = 0;

        // Удаляем связанные элементы корзины
        await this.cartRepository.delete({ product: { id } });

        await this.productRepository.save(product);
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

    async getFilteredAndSortedProducts(categoryName?: string, sort?: string,
        minPrice?: number, maxPrice?: number): Promise<Product[]> {
        let products = await this.productRepository.find({
            where: { quantityInStock: MoreThan(0) },
            relations: ['category'],
        });

        if (categoryName) {
            products = products.filter(product => product.category?.name === categoryName);
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            products = products.filter(product => {
                const price = product.price;
                return (minPrice === undefined || price >= minPrice) && (maxPrice === undefined || price <= maxPrice);
            });
        }

        if (sort === 'newest') {
            products = products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sort === 'oldest') {
            products = products.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        } else if (sort === 'price_asc') {
            products = products.sort((a, b) => a.price - b.price);
        } else if (sort === 'price_desc') {
            products = products.sort((a, b) => b.price - a.price);
        }

        return products;
    }

    async getPriceRange(): Promise<{ minPrice: number; maxPrice: number }> {
        const prices = await this.productRepository
            .createQueryBuilder('product')
            .select('MIN(product.price)', 'minPrice')
            .addSelect('MAX(product.price)', 'maxPrice')
            .where('product.quantityInStock > :quantity', { quantity: 0 })
            .getRawOne();

        return {
            minPrice: prices.minPrice || 0,
            maxPrice: prices.maxPrice || 0,
        };
    }

    async decreaseStock(productId: number, quantity: number): Promise<void> {
        const product = await this.productRepository.findOneBy({ id: productId });
        if (!product) {
            throw new Error(`Товар с ID ${productId} не найден`);
        }

        if (product.quantityInStock < quantity) {
            throw new Error(`Недостаточно товара на складе для продукта с ID ${productId}`);
        }

        product.quantityInStock -= quantity;
        await this.productRepository.save(product);
    }
}
