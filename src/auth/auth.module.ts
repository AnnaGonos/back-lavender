import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from './auth.middleware';
import { JwtAuthGuard } from './auth.guard';
import { JwtConfigModule } from '../jwt/jwt-config.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthMiddleware, JwtAuthGuard],
  exports: [AuthService, AuthMiddleware, JwtAuthGuard],
})
export class AuthModule {}
