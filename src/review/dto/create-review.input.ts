import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Min(1)
  @Max(5)
  @IsInt()
  @Field(() => Number)
  rating: number;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsInt()
  @Field(() => Number)
  userId: number;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  image?: string;
}
