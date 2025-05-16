import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PageData {
  @Field(() => String)
  pageTitle: string;
}
