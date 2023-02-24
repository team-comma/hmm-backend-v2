import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { CachesService } from '@src/caches/caches.service';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly cachesService: CachesService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_REDIRECT_URI'),
      scope: ['email', 'profile', 'https://www.googleapis.com/auth/youtube'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: any) {
    this.cachesService.set('google-access', accessToken, 3600);
    this.cachesService.set('google-refresh', refreshToken, 3153600000);
    return done(null, profile);
  }
}
