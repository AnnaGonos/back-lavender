import { IsString, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
    @IsString()
    @Field(() => String)
    name: string;

    @IsString()
    @IsOptional()
    @Field(() => String)
    description?: string;
}
