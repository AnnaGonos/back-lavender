import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Имя пользователя', type: String, example: 'Анна'})
    @Field(() => String)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Фамилия пользователя', type: String, example: 'Гонос' })
    @Field(() => String)
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ description: 'Электронная почта пользователя', type: String, example: 'gonosanna@mail.ru' })
    @Field(() => String)
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Номер телефона пользователя', type: String, example: '+79681393338' })
    @Field(() => String)
    phone: string;

    @IsString()
    @MinLength(6)
    @ApiProperty({ description: 'Пароль пользователя', type: String,
        example: '1234567'})
    @Field(() => String)
    password: string;

    @IsString()
    @MinLength(6)
    @ApiProperty({ description: 'Подтверждение пароля', type: String,
        example: '1234567'})
    @Field(() => String)
    confirmPassword: string;
}
