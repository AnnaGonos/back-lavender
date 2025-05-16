import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @IsString()
  @ApiProperty({ description: 'Name', type: String, example: 'Монобукеты' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description',
    type: String,
    example: 'Букеты, в которых используется один вид цветов.',
    required: false,
  })
  description?: string;
}
