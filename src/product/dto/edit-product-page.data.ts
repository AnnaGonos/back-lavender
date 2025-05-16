import { ObjectType, Field } from '@nestjs/graphql';
import { Product } from '../entities/product.entity';
import { Category } from '../../category/entities/category.entity';
@ObjectType()
export class EditProductPageData {
  @Field(() => Product)
  product: Product;

  @Field(() => Category)
  categories: Category[];

  @Field(() => String)
  pageTitle: string;
}
