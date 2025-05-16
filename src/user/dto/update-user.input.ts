import { IsString, IsOptional, IsEmail, IsNumber } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  firstName?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  lastName?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  middleName?: string;

  @IsOptional()
  @IsEmail()
  @Field(() => String, { nullable: true })
  email?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  phone?: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  bonusPoints?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  totalOrders?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  bonusCardLevel?: number;
}
