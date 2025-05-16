import { IsString, IsOptional, IsEmail, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Имя пользователя',
    type: String,
    example: 'Анна',
  })
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Фамилия пользователя',
    type: String,
    example: 'Гонос',
  })
  lastName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Отчество пользователя',
    type: String,
    required: false,
    example: 'Сергеевна',
  })
  middleName?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    description: 'Электронная почта пользователя',
    type: String,
    example: 'gonosanna@mail.ru',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Номер телефона пользователя',
    type: String,
    example: '+79681393338',
  })
  phone?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Количество бонусных баллов пользователя',
    type: Number,
    example: 666,
  })
  bonusPoints?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Общее количество заказов пользователя',
    type: Number,
    example: 5,
  })
  totalOrders?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Уровень бонусной карты пользователя',
    type: Number,
    example: 2,
  })
  bonusCardLevel?: number;
}
