// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '../user/entities/user.entity';
// import { JwtStrategy } from './jwt.strategy';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { UserService } from '../user/user.service';
//
// @Module({
//     imports: [
//         PassportModule.register({ defaultStrategy: 'jwt' }),
//         JwtModule.register({
//             secret: process.env.JWT_SECRET_KEY,
//             signOptions: { expiresIn: '1h' },
//         }),
//         TypeOrmModule.forFeature([User]),
//     ],
//     providers: [AuthService, JwtStrategy, JwtAuthGuard, UserService],
//     controllers: [AuthController],
//     exports: [JwtAuthGuard],
// })
// export class AuthModule {}