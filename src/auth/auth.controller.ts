import {
    Controller,
    Post,
    Body,
    Res,
    Get, Render,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

const cookieOptions = {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    path: '/',
    secure: true,
    sameSite: 'none' as const,
};

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('login')
    @Render('profile/login')
    async pageLogin() {
        return {
            pageTitle: 'Вход'
        };
    }

    @Get('register')
    @Render('profile/register')
    async pageRegister() {
        return {
            pageTitle: 'Регистрация'
        };
    }

    @Get('logout')
    async logout(@Res() res: Response) {
        res.clearCookie('jwt', cookieOptions);
        return res.redirect('/auth/login');
    }

    @Post('register')
    async registerUser(@Body() dto: RegisterDto, @Res() res: Response) {
        const { accessToken } = await this.authService.register(dto);

        res.cookie('jwt', accessToken, cookieOptions);
        return res.redirect('/');
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response) {
        const { accessToken } = await this.authService.login(dto);

        res.clearCookie('jwt', cookieOptions);
        res.cookie('jwt', accessToken, cookieOptions);

        return res.redirect('/profile');
    }
}
