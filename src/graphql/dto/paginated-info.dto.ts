import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PaginationInfo {
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
