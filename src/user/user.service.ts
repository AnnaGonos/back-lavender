import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './entities/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async createUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
  }

  async calculateLoyaltyLevel(
    user: User,
  ): Promise<{ level: string; bonusPercentage: number }> {
    if (user.totalOrders >= 100) {
      return { level: 'Платиновый', bonusPercentage: 7 };
    } else if (user.totalOrders >= 50 && user.totalOrders < 100) {
      return { level: 'Золотой', bonusPercentage: 6 };
    } else if (user.totalOrders >= 20 && user.totalOrders < 50) {
      return { level: 'Серебряный', bonusPercentage: 4 };
    } else if (user.totalOrders >= 10 && user.totalOrders < 20) {
      return { level: 'Бронзовый', bonusPercentage: 3 };
    } else {
      return { level: 'Начальный', bonusPercentage: 2 };
    }
  }

  async setRole(id: number, role: string): Promise<void> {
    await this.userRepository.update(id, { type: role as UserRole });
  }

  async getAdmins(): Promise<User[]> {
    return await this.userRepository.findBy({ type: UserRole.ADMIN });
  }

  async findOneById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async updateBonusCardLevel(user: User) {
    let newBonusCardLevel = user.bonusCardLevel;

    if (user.totalOrders >= 100) {
      newBonusCardLevel = 7;
    } else if (user.totalOrders >= 50 && user.totalOrders < 100) {
      newBonusCardLevel = 6;
    } else if (user.totalOrders >= 20 && user.totalOrders < 50) {
      newBonusCardLevel = 4;
    } else if (user.totalOrders >= 10 && user.totalOrders < 20) {
      newBonusCardLevel = 3;
    } else {
      newBonusCardLevel = 2;
    }

    if (newBonusCardLevel !== user.bonusCardLevel) {
      user.bonusCardLevel = newBonusCardLevel;
    }
  }
}
