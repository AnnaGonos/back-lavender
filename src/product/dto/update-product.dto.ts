import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Название продукта', type: String, example: 'Букет №32', })
  @Field(() => String, { nullable: true })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Состав товара', type: String, required: false,
    example: 'хризантемы, ромашки, лилии', })
  @Field(() => String, { nullable: true })
  composition?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Описание товара', type: String, required: false,
    example: 'Необычный букет хризантем', })
  @Field(() => String, { nullable: true })
  description?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @ApiProperty({ description: 'Цена товара', type: Number, example: 999 })
  @Field(() => Number, { nullable: true })
  price?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? 0 : parseFloat(value)))
  @ApiProperty({ description: 'Новая скидочная цена товара', type: Number, required: false,
    example: 998, })
  @Field(() => Number, { nullable: true })
  discount?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @ApiProperty({ description: 'Количество товара в магазине', type: Number, example: 3, })
  @Field(() => Number, { nullable: true })
  quantityInStock?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Категория, к которой принадлежит товар', type: () => String, example: 'Монобукеты', })
  @Field(() => String, { nullable: true })
  categoryName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'URL изображения товара', type: String, required: false, example: '/uploads/1743381076506-369252395.jpg', })
  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Описание изображения товара', type: String, required: false, example: 'Необычный букет хризантем', })
  @Field(() => String, { nullable: true })
  imageDescription?: string;
}
