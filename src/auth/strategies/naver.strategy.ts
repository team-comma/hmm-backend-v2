import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-naver-v2';
import { AuthService } from '../auth.service';
import { RequestMemberLoginDto } from '../dto';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
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
    const payload: RequestMemberLoginDto = {
      socialType: provider,
      socialId: id,
      name: name,
      nickname: nickname,
      email: email,
      mobile: mobile,
      image: profileImage,
      birthyear: birthYear,
      birthday: birthday,
      age: age,
      gender: gender,
    };
    const member = await this.authService.createMember(payload);
    return done(null, member);
  }
}
