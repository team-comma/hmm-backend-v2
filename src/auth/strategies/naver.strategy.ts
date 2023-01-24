import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-naver-v2';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('NAVER_CLIENT_ID'),
      clientSecret: configService.get<string>('NAVER_CLIENT_SECRET'),
      callbackURL: configService.get<string>('NAVER_REDIRECT_URI'),
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile, done: any) {
    const {
      provider,
      id,
      nickname,
      profileImage,
      age,
      gender,
      email,
      mobile,
      name,
      birthYear,
      birthday,
    } = profile;
    console.log(provider, nickname, age, gender, mobile, birthYear);
    const payload = {
      socialId: id,
      name: name,
      image: profileImage,
      email: email,
      birthday: birthday,
    };
    done(null, payload);
  }
}
