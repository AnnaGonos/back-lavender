import { Controller, Get, Post, Body, Param, Patch, Delete, Render, Redirect } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('florist/categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    @Render('florist/categories/all')
    async getCategoriesPage() {
        const categories = await this.categoryService.findAll();
        return {
            categories: categories || [],
            pageTitle: 'Работа с категориями',
        };
    }

    @Get('add')
    @Render('florist/categories/add')
    getAddCategoryPage() {
        return { pageTitle: 'Добавить категорию' };
    }

    @Post('add')
    @Redirect('/florist/categories')
    async addCategory(@Body() createCategoryDto: CreateCategoryDto) {
        await this.categoryService.create(createCategoryDto);
    }

    @Get(':id/edit')
    @Render('florist/categories/edit')
    async getEditCategoryPage(@Param('id') id: string) {
        const category = await this.categoryService.findOne(+id);
        return { category, pageTitle: 'Редактирование категории' };
    }

    @Patch(':id')
    @Redirect('/florist/categories')
    async editCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        await this.categoryService.update(+id, updateCategoryDto);
    }

    @Delete(':id')
    @Redirect('/florist/categories')
    async deleteCategory(@Param('id') id: string) {
        await this.categoryService.remove(+id);
    }
}