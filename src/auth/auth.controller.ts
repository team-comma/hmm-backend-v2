import { Controller, Get, Ip, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetMember } from '@src/libs/decorators';
import { MemberInfoDto } from '@src/members/dto';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ResponseReissueAccessToken } from './dto';
import { AccessTokenAuthGuard, NaverAuthGuard, RefreshTokenAuthGuard } from './guards';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(KakaoAuthGuard)
  // @Get('/login/oauth/kakao')
  // public login(@Req() req: Request, @Ip() ip: string, @Res() res: Response) {
  //   return this.authService.register(req.user, ip, res);
  // }

  @ApiOperation({ summary: '네이버 로그인 API', description: '유저가 네이버로 간편 로그인을 한다' })
  @UseGuards(NaverAuthGuard)
  @Get('/login/naver')
  public naverLogin(@GetMember() member: MemberInfoDto, @Ip() ip: string, @Res() res: Response) {
    return this.authService.successLoginHandler(member, ip, res);
  }

  @ApiOperation({
    summary: '액세스 토큰 발급 API',
    description: '리프레시 토큰을 검증하고 액세스 토큰을 발급한다',
  })
  @ApiResponse({ type: ResponseReissueAccessToken })
  @ApiBearerAuth('refresh-token')
  @UseGuards(RefreshTokenAuthGuard)
  @Get('token/refresh')
  public reissueAccessTokenByRefreshToken(@GetMember('id') memberId: string) {
    return this.authService.reissueAccessTokenByRefreshToken(memberId);
  }

  @ApiOperation({ summary: '로그아웃 API', description: '유저가 로그아웃을 한다' })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessTokenAuthGuard)
  @Post('logout')
  public logout(@GetMember('id') memberId: string) {
    return this.authService.logout(memberId);
  }
}
