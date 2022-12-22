import { Controller, Get, Ip, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { Member } from 'src/entities';
import { AuthService } from './auth.service';
import { MemberKakaoDto } from './dto';
import { AccessTokenAuthGuard, KakaoAuthGuard, RefreshTokenAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(KakaoAuthGuard)
  @Get('/login/oauth/kakao')
  public login(@Req() req: Request, @Ip() ip: string, @Res() res: Response) {
    return this.authService.register(req.user as MemberKakaoDto, ip, res);
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Get('token/refresh')
  public issueAccessTokenByRefreshToken(@Req() req: Request) {
    return this.authService.issueAccessTokenByRefreshToken(req.user as Member);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Post('logout')
  public logout(@Req() req: Request) {
    return this.authService.logout(req.user as Member);
  }
}
