import { NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtDto } from '@src/auth/dto';
import { MembersService } from '@src/members/members.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly memberService: MembersService,
    private readonly jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if (req?.user) {
      next();
      return;
    }

    let member;
    try {
      const accessToken = req?.header('Authorization')?.replace('Bearer ', '');

      const { sub }: JwtDto = this.jwtService.verify(accessToken, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY'),
      });
      member = await this.memberService.getMemberById(sub);
    } catch (error) {
      throw new UnauthorizedException();
    }

    if (member) {
      req.user = member;
    }
    next();
  }
}
