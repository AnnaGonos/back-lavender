import { ObjectType, Field } from '@nestjs/graphql';
import { Product } from '../entities/product.entity';
import { Category } from '../../category/entities/category.entity';

@ObjectType()
export class CatalogQuery {
  @Field(() => String, { nullable: true})
  category?: string;

  @Field(() => Number)
  page: number;

  @Field(() => Number)
  limit: number;
}

@ObjectType()
export class Pagination {
  @Field(() => Number)
  currentPage: number;

  @Field(() => Number)
  totalPages: number;

  @Field(() => Number)
  totalItems: number;

  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Boolean)
  hasPrevPage: boolean;

  @Field(() => Number)
  limit: number;
}

@ObjectType()
export class CatalogData {
  @Field(() => Product)
  products: Product[];

  @Field(() => Category)
  categories: Category[];

  @Field(() => CatalogQuery)
  query: CatalogQuery;

  @Field(() => Pagination)
  pagination: Pagination;
}
