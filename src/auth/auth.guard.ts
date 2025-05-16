import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies?.jwt;

    if (!token) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    try {
      const user = this.jwtService.verify(token);
      request.user = user;
      console.log('Token:', token);
      return true;
    } catch {
      throw new UnauthorizedException('Неверный токен');
    }
  }
}