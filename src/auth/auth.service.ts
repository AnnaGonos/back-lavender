import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../user/entities/user-role.enum';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = new User();
    newUser.firstName = dto.firstName;
    newUser.lastName = dto.lastName;
    newUser.phone = dto.phone;
    newUser.email = dto.email;
    newUser.password = hashedPassword;
    newUser.type = UserRole.USER;

    await this.userService.createUser(newUser);

    const payload = { email: newUser.email, id: newUser.id, role: newUser.type };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });

    return { accessToken };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const payload = { email: user.email, id: user.id, role: user.type };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}