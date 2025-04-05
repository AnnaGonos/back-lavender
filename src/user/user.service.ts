import {ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import {RegisterUserDto} from "./dto/register.dto";
import {LoginUserDto} from "./dto/login.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }
        return user;
    }

    async getUserById(id: number): Promise<User> {
        // @ts-ignore
        return this.userRepository.findOneBy({ id });
    }

    async calculateLoyaltyLevel(user: User): Promise<string> {
        if (user.totalOrders >= 100) {
            return 'Цветочный эксперт';
        } else if (user.totalOrders >= 50 && user.totalOrders < 100) {
            return 'Цветочный гурман';
        } else if (user.totalOrders >= 20 && user.totalOrders < 50) {
            return 'Цветочный любитель';
        } else {
            return 'Цветочный новичок';
        }
    }

    async updateBonusCardLevel(user: User) {
        let newBonusCardLevel = user.bonusCardLevel;

        if (user.totalOrders > 50) {
            newBonusCardLevel = 7; // 7% бонусов
        } else if (user.totalOrders > 15) {
            newBonusCardLevel = 6; // 6% бонусов
        } else if (user.totalOrders > 10) {
            newBonusCardLevel = 4; // 4% бонусов
        }

        // Обновляем уровень бонусной программы, если он изменился
        if (newBonusCardLevel !== user.bonusCardLevel) {
            user.bonusCardLevel = newBonusCardLevel;
        }
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        Object.assign(user, updateUserDto);
        await this.userRepository.save(user);
    }

    async updateUser(id: number, data: Partial<User>) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new Error("Пользователь не найден");
        }

        // Обновляем данные пользователя
        Object.assign(user, data);

        // Сохраняем обновленного пользователя
        return this.userRepository.save(user);
    }

    async register(registerUserDto: RegisterUserDto): Promise<User> {
        const { firstName, lastName, email, phone, password, confirmPassword } = registerUserDto;

        if (password !== confirmPassword) {
            throw new ConflictException('Пароли не совпадают');
        }

        const existingUser = await this.userRepository.findOneBy({ email });
        if (existingUser) {
            throw new ConflictException('Пользователь с таким email уже существует');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
        });

        return this.userRepository.save(user);
    }


    async login(loginUserDto: LoginUserDto): Promise<User> {
        const { email, password } = loginUserDto;

        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Неверный пароль');
        }

        return user;
    }

}