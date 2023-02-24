import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CachesModule } from '@src/caches/caches.module';
import { Member } from '@src/entities';
import { MembersModule } from '@src/members/members.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  AccessTokenStrategy,
  GoogleStrategy,
  KakaoStrategy,
  NaverStrategy,
  RefreshTokenStrategy,
} from './strategies';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), MembersModule, CachesModule, JwtModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    KakaoStrategy,
    NaverStrategy,
    GoogleStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
