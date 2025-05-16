import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Render,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller('florist/categories')
@ApiExcludeController()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  @Render('florist/categories/all')
  async getCategoriesPage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(8), ParseIntPipe) limit: number = 8,
  ) {
    const paginationData = await this.categoryService.getPaginatedCategories(page, limit);

    return {
      categories: paginationData.categories || [],
      pagination: paginationData.pagination,
      pageTitle: 'Работа с категориями',
    };
  }

  @Get('add')
  @Render('florist/categories/add')
  getAddCategoryPage() {
    return {
      pageTitle: 'Добавить категорию',
    };
  }

  @Get(':id/edit')
  @Render('florist/categories/edit')
  async getEditCategoryPage(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.findOne(id);

    return {
      category,
      pageTitle: 'Редактирование категории',
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.remove(id);
  }
}
