import { ObjectType, Field } from '@nestjs/graphql';
import { Category } from '../../category/entities/category.entity';

@ObjectType()
export class AddProductPageData {
  @Field(() => String)
  pageTitle: string;

  @Field(() => Category)
  categories: Category[];
}
