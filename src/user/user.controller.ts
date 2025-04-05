import {Controller, Get, Render, UseGuards, Request, Body, Post, Redirect} from '@nestjs/common';
import {UserService} from "./user.service";
import {RegisterUserDto} from "./dto/register.dto";
import {LoginUserDto} from "./dto/login.dto";

@Controller("auth")
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get('login')
    @Render('profile/login') // Страница входа
    getLoginPage() {
        return { pageTitle: 'Вход' };
    }

    @Get('register')
    @Render('profile/register') // Страница регистрации
    getRegisterPage() {
        return { pageTitle: 'Регистрация' };
    }

    @Post('register')
    @Redirect('/profile') // Редирект на страницу профиля
    async register(@Body() registerUserDto: RegisterUserDto) {
        await this.userService.register(registerUserDto);

    }

}

    // @Get('login')
    // @Render('profile/login')
    // getLoginPage() {
    //     return { pageTitle: 'Вход' };
    // }
    //
    // @Get('register')
    // @Render('profile/register')
    // getRegisterPage() {
    //     return { pageTitle: 'Регистрация' };
    // }
    //
    // @Post('register')
    // async register(@Body() registerUserDto: RegisterUserDto) {
    //     const { token } = await this.authService.register(registerUserDto);
    //     return { token }; // Возвращаем JWT
    // }
    //
    // @Post('login')
    // async login(@Body() loginUserDto: LoginUserDto) {
    //     const { token } = await this.authService.login(loginUserDto);
    //     return { token }; // Возвращаем JWT
    // }

