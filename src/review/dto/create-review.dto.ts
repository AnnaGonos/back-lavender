import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @ApiProperty({ example: 5, description: 'Rating review' })
  rating: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description review',
    example: 'Отличный сервис!',
    required: false,
  })
  description?: string;

  @IsInt()
  @ApiProperty({ description: 'Id', type: Number, example: 1 })
  userId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'URL of the review image from the user',
    type: String,
    required: false,
    example: '/uploads/review/1743381076506-369252395.jpg',
  })
  image?: string;
}
