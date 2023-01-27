import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CachesModule } from '@src/caches/caches.module';
import { Member } from '@src/entities';
import { MembersModule } from '@src/members/members.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  AccessTokenStrategy,
  KakaoStrategy,
  NaverStrategy,
  RefreshTokenStrategy,
} from './strategies';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY'),
          signOptions: {
            expiresIn: parseInt(configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN')),
          },
        };
      },
    }),
    MembersModule,
    CachesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy, NaverStrategy, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
