import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { MembersService } from '@src/members/members.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtDto } from '../dto';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
    public readonly configService: ConfigService,
    private readonly membersService: MembersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtDto) {
    return this.membersService.getMemberById(payload.sub);
  }
}
