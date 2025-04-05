// import { Controller, Post, Body, Get, Render, Redirect } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { RegisterUserDto } from './dto/register.dto';
// import { LoginUserDto } from './dto/login.dto';
//
// @Controller('auth')
// export class AuthController {
//     constructor(private readonly authService: AuthService) {}
//
//     @Get('login')
//     @Render('profile/login')
//     getLoginPage() {
//         return { pageTitle: 'Вход' };
//     }
//
//     @Get('register')
//     @Render('profile/register')
//     getRegisterPage() {
//         return { pageTitle: 'Регистрация' };
//     }
//
//     @Post('register')
//     @Redirect('/profile')
//     async register(@Body() registerUserDto: RegisterUserDto) {
//         await this.authService.register(registerUserDto);
//         return { url: '/profile' };
//     }
//
//     @Post('login')
//     @Redirect('/profile')
//     async login(@Body() loginUserDto: LoginUserDto) {
//         const { token } = await this.authService.login(loginUserDto);
//         return { url: '/profile' };
//     }
// }
//
//     // @Get('login')
//     // @Render('profile/login')
//     // getLoginPage() {
//     //     return { pageTitle: 'Вход' };
//     // }
//     //
//     // @Get('register')
//     // @Render('profile/register')
//     // getRegisterPage() {
//     //     return { pageTitle: 'Регистрация' };
//     // }
//     //
//     // @Post('register')
//     // async register(@Body() registerUserDto: RegisterUserDto) {
//     //     const { token } = await this.authService.register(registerUserDto);
//     //     return { token };
//     // }
//     //
//     // @Post('login')
//     // async login(@Body() loginUserDto: LoginUserDto) {
//     //     const { token } = await this.authService.login(loginUserDto);
//     //     return { token };
//     // }
