import { Controller, Get, Ip, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  AccessTokenAuthGuard,
  KakaoAuthGuard,
  NaverAuthGuard,
  RefreshTokenAuthGuard,
} from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(KakaoAuthGuard)
  @Get('/login/oauth/kakao')
  public login(@Req() req: Request, @Ip() ip: string, @Res() res: Response) {
    return this.authService.register(req.user, ip, res);
  }

  @UseGuards(NaverAuthGuard)
  @Get('/login/oauth/naver')
  public naverlogin(@Req() req: Request, @Ip() ip: string, @Res() res: Response) {
    return this.authService.register(req.user, ip, res);
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Get('token/refresh')
  public issueAccessTokenByRefreshToken(@Req() req: Request) {
    return this.authService.issueAccessTokenByRefreshToken(req.user);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Post('logout')
  public logout(@Req() req: Request) {
    return this.authService.logout(req.user);
  }
}
