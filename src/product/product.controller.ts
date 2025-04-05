import {
    Controller, Get, Post, Body, Param, Patch, Delete, Render, Redirect, UseInterceptors,
    UploadedFiles, HttpException, HttpStatus, UploadedFile, Query, NotFoundException, BadRequestException, Sse,
} from '@nestjs/common';
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryService } from '../category/category.service';
import {multerConfig} from "./multerConfig";
import {CartService} from "../cart/cart.service";

@Controller()
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly categoryService: CategoryService,
        private readonly cartService: CartService,
    ) {}


    @Get('catalog')
    @Render('catalog')
    async getCatalogPage(@Query('category') categoryName?: string, @Query('sort') sort?: string,
        @Query('minPrice') minPrice?: number, @Query('maxPrice') maxPrice?: number) {
        try {
            const products = await this.productService.getFilteredAndSortedProducts(
                categoryName, sort, minPrice, maxPrice);

            const categories = await this.categoryService.findAll();
            const { minPrice: defaultMinPrice, maxPrice: defaultMaxPrice } = await this.productService.getPriceRange();
            const pageTitle = categoryName ? `Товары категории ${categoryName}` : 'Каталог товаров';
            const totalProducts = products.length;

            const userId = 1;
            const cartItems = await this.cartService.getCartItems(userId);

            const productsWithCartStatus = products.map((product) => ({
                ...product,
                inCart: cartItems.some((item) => item.product.id === product.id),
            }));

            return {
                products: productsWithCartStatus, categories,
                query: {
                    category: categoryName,
                    sort,
                    minPrice: minPrice ?? defaultMinPrice,
                    maxPrice: maxPrice ?? defaultMaxPrice
                },
                pageTitle, totalProducts
            };
        } catch (error) {
            console.error('Error fetching products:', error);
            throw new HttpException('Failed to fetch products', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('product/:id')
    @Render('products-main') // основная страница товара
    async getProductPage(@Param('id') productId: string) {
        try {
            const product = await this.productService.findById(productId);
            if (!product) {
                throw new NotFoundException('Товар не найден');
            }

            return { product };
        } catch (error) {
            console.error('Error fetching product:', error);
            throw new HttpException('Failed to fetch product', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('florist/products')
    @Render('florist/products/all') // ниже все для работы с аккаунтом флориста
    async getProductsPage(
        @Query('category') category: string,
        @Query('sort') sort: string
    ) {
        try {
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

            return { products, categories, query: { category, sort }, pageTitle: 'Работа с товарами' };
        } catch (error) {
            console.error('Error fetching products:', error);
            throw new HttpException('Failed to fetch products', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('florist/products/add')
    @Render('florist/products/add')
    async getAddProductPage() {
        try {
            const categories = await this.categoryService.findAll();
            return { pageTitle: 'Добавить новый товар', categories };
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw new HttpException('Failed to fetch categories', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('florist/products/add')
    @UseInterceptors(FileInterceptor('image', multerConfig))
    @Redirect('/florist/products')
    async addProduct(
        @Body() createProductDto: CreateProductDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        try {
            await this.productService.create(createProductDto, file);
        } catch (error) {
            console.error('Error creating product in controller:', error);
            throw new HttpException('Failed to create product', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('florist/products/:id/edit')
    @Render('florist/products/edit')
    async getEditProductPage(@Param('id') id: string) {
        try {
            const product = await this.productService.findOne(+id);
            if (!product) {
                throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
            }

            const categories = await this.categoryService.findAll();
            return { product, categories, pageTitle: 'Редактирование товара' };
        } catch (error) {
            console.error('Error fetching product for editing:', error);
            throw new HttpException('Failed to fetch product', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch('florist/products/:id')
    @UseInterceptors(FileInterceptor('image', multerConfig))
    @Redirect('/florist/products')
    async editProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto,
                      @UploadedFile() file: Express.Multer.File,) {
        try {
            await this.productService.update(+id, updateProductDto, file);
        } catch (error) {
            console.error('Error updating product:', error);
            throw new HttpException('Failed to update product', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('florist/products/archived')
    @Render('florist/products/archived')
    async getArchivedProductsPage() {
        try {
            const products = await this.productService.findAllArchived();
            return { products, pageTitle: 'Архивированные товары' };
        } catch (error) {
            console.error('Error fetching archived products:', error);
            throw new HttpException('Failed to fetch archived products', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch('florist/products/:id/archive')
    @Redirect('/florist/products/archived')
    async archiveProduct(@Param('id') id: string) {
        console.log(`Archiving product with ID: ${id}`);
        try {
            await this.productService.archive(+id);
        } catch (error) {
            console.error('Error archiving product:', error);
            throw new HttpException('Failed to archive product', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete('florist/products/:id')
    @Redirect('/florist/products/archived')
    async deleteProduct(@Param('id') id: string) {
        await this.productService.delete(+id);
    }
}