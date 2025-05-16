import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { UpdateCategoryInput } from './dto/update-category.input';
import { CreateCategoryInput } from './dto/create-category.input';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => Category)
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ): Promise<Category> {
    return this.categoryService.create(createCategoryInput);
  }

  @Query(() => [Category], { name: 'categories' })
  async getCategoriesPage(
    @Args('page', { type: () => Number, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Number, defaultValue: 8 }) limit: number,
  ): Promise<Category[]> {
    const paginationData = await this.categoryService.getPaginatedCategories(
      page,
      limit,
    );
    return paginationData.categories || [];
  }

  @Query(() => Category, { name: 'category' })
  async findOne(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Mutation(() => Category)
  async updateCategory(
    @Args('id', { type: () => Number }) id: number,
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ): Promise<Category> {
    return this.categoryService.update(id, updateCategoryInput);
  }

  @Mutation(() => Category)
  async removeCategory(@Args('id', { type: () => Number }) id: number) {
    return await this.categoryService.remove(id);
  }
}
