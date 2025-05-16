import { ObjectType, Field } from '@nestjs/graphql';
import { Product } from '../../product/entities/product.entity';
import { PaginationInfo } from '../../graphql/dto/paginated-info.dto';

@ObjectType()
export class PaginatedFavoritesDto {
  @Field(() => [Product], { description: 'Список избранных товаров' })
  items: Product[];

  @Field(() => PaginationInfo)
  pagination: PaginationInfo;
}
