import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginDto {
    @IsEmail()
    @ApiProperty({ description: 'Электронная почта пользователя', type: String, example: 'gonosanna@mail.ru' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'Пароль пользователя', type: String})
    password: string;
}
