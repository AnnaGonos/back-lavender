import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseFilters,
  DefaultValuePipe,
  ParseIntPipe,
  Query, UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiNoContentResponse,
  ApiQuery,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { AllExceptionsFilter } from '../all.exception.filter';

@ApiTags('categories')
@UseFilters(AllExceptionsFilter)
@Controller('api/categories')
export class CategoryApiController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Creating a new category' })
  @ApiCreatedResponse({
    description: 'Category created successfully',
    type: Category,
  })
  @ApiBadRequestResponse({ description: 'Incorrect request arguments' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Getting all categories with pagination' })
  @ApiCreatedResponse({
    description: 'Categories created successfully',
    type: [Category],
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    example: 8,
    description: 'Number of products per page',
  })
  async getCategoriesPage(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(8), ParseIntPipe) limit: number = 8,
  ) {
    const paginationData = await this.categoryService.getPaginatedCategories(
      page,
      limit,
    );

    return {
      categories: paginationData.categories || [],
      pagination: paginationData.pagination,
    };
  }

  @Get(':id') // 200 404
  @ApiOperation({ summary: 'Getting a category by ID' })
  @ApiOkResponse({ description: 'Category found successfully', type: Category })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Category ID',
    example: '1',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updating the category' })
  @ApiOkResponse({
    description: 'Category updated successfully',
    type: Category,
  })
  @ApiBadRequestResponse({ description: 'Incorrect request arguments' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Category ID',
    example: 1,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleting a category' })
  @ApiNoContentResponse({ description: 'Category deleted successfully' })
  @ApiBadRequestResponse({ description: 'Incorrect request arguments' })
  @ApiNotFoundResponse({ description: 'Category not found' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Category ID',
    example: 1,
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.remove(id);
  }
}
