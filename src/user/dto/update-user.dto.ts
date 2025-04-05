import {IsString, IsOptional, IsEmail, IsNumber} from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    middleName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsNumber()
    bonusPoints?: number;

    @IsOptional()
    @IsNumber()
    totalOrders?: number;

    @IsOptional()
    @IsNumber()
    bonusCardLevel?: number;
}
