import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {
  @Min(1)
  @Max(5)
  @IsInt()
  @IsOptional()
  @ApiProperty({ example: 3, description: 'New rating', required: false })
  rating?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'New description review',
    example: 'Есть к чему стремиться',
    required: false,
  })
  description?: string;

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
