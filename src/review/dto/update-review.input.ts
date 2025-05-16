import { InputType, Field } from '@nestjs/graphql';
import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';

@InputType()
export class UpdateReviewInput {
    @Min(1)
    @Max(5)
    @IsInt()
    @IsOptional()
    @Field(() => Number, { nullable: true })
    rating?: number;

    @IsString()
    @IsOptional()
    @Field(() => String, { nullable: true })
    description?: string;

    @IsString()
    @IsOptional()
    @Field(() => String, { nullable: true })
    image?: string;
}
