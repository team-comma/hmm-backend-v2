import { Controller, Get, Ip, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Member } from 'src/entities';
import { RESPONSE_CODE } from 'src/libs/constants';
import { AuthService } from './auth.service';
import { MemberKakaoDto } from './dto';
import { KakaoAuthGuard, RefreshTokenAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(KakaoAuthGuard)
  @Get('/login/oauth/kakao')
  public login(@Req() req: Request, @Ip() ip: string) {
    return this.authService.register(req.user as MemberKakaoDto, ip);
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Get('token/refresh')
  public issueAccessTokenByRefreshToken(@Req() req: Request) {
    return this.authService.issueAccessTokenByRefreshToken(req.user as Member);
  }

  @Post('logout/:id')
  public logout(@Param('id') userId: string) {
    return this.authService.logout(userId);
  }

  @Get('test')
  public test() {
    return { result: RESPONSE_CODE.OK };
  }
}
