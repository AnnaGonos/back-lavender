import { IsString, IsNumber, IsOptional } from 'class-validator';
import {Transform} from "class-transformer";

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    composition?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    price: number;

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => (value === '' ? 0 : parseFloat(value)))
    discount: number = 0;

    @IsNumber()
    @Transform(({ value }) => parseInt(value, 10))
    quantityInStock: number;

    @IsString()
    categoryName: string;

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsString()
    @IsOptional()
    imageDescription?: string;
}
