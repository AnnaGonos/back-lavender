import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'my-super-secret-key',
        signOptions: {
          expiresIn: process.env.JWT_EXPIRATION_TIME || '1h',
        },
      }),
    }),
  ],
  exports: [JwtModule],
})
export class JwtConfigModule {}