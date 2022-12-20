import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { MemberKakaoDto } from '../dto';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('KAKAO_CLIENT_ID'),
      clientSecret: configService.get<string>('KAKAO_CLIENT_SECRET'),
      callbackURL: configService.get<string>('KAKAO_REDIRECT_URI'),
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile, done: any) {
    const profileJson = profile._json;
    const kakao_account = profileJson.kakao_account;
    const payload: MemberKakaoDto = {
      socialId: profileJson.id,
      name: kakao_account.profile.nickname,
      image: kakao_account.profile.profile_image_url,
      email: kakao_account.email,
      birthday: kakao_account.birthday,
    };
    return done(null, payload);
  }
}
