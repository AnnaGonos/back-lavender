// import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { JwtService } from '@nestjs/jwt';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { User } from '../user/entities/user.entity';
// import { RegisterUserDto } from '../user/dto/register.dto';
// import { LoginUserDto } from '../user/dto/login.dto';
//
// @Injectable()
// export class AuthService {
//     constructor(
//         @InjectRepository(User)
//         private readonly usersRepository: Repository<User>,
//         private readonly jwtService: JwtService,
//     ) {}
//
//     async register(registerUserDto: RegisterUserDto): Promise<{ token: string }> {
//         const { email, password, confirmPassword } = registerUserDto;
//
//         if (password !== confirmPassword) {
//             throw new ConflictException('Пароли не совпадают');
//         }
//
//         const existingUser = await this.usersRepository.findOneBy({ email });
//         if (existingUser) {
//             throw new ConflictException('Пользователь с таким email уже существует');
//         }
//
//         const hashedPassword = await bcrypt.hash(password, 10);
//
//         const user = this.usersRepository.create({
//             email,
//             password: hashedPassword,
//         });
//
//         await this.usersRepository.save(user);
//
//         // Генерация JWT
//         const payload = { sub: user.id, email: user.email };
//         const token = this.jwtService.sign(payload);
//
//         return { token };
//     }
//
//     async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
//         const { email, password } = loginUserDto;
//
//         const user = await this.usersRepository.findOneBy({ email });
//         if (!user) {
//             throw new NotFoundException('Пользователь не найден');
//         }
//
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             throw new UnauthorizedException('Неверный пароль');
//         }
//
//         // Генерация JWT
//         const payload = { sub: user.id, email: user.email };
//         const token = this.jwtService.sign(payload);
//
//         return { token };
//     }
// }
// async getUserBonusData(userId: number) {
//     const user = await this.usersRepository.findOne({ where: { id: userId } });
//     if (!user) {
//         throw new NotFoundException('Пользователь не найден');
//     }
//
//     const { levelName, bonusPercentage } = await this.calculateLoyaltyLevel(user);
//
//     return {
//         bonusPoints: user.bonusPoints,
//         levelName,
//         bonusPercentage,
//     };
// }