import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { CachesService } from 'src/caches/caches.service';
import { Member } from 'src/entities';
import { RESPONSE_CODE } from 'src/libs/constants';
import { MembersService } from 'src/members/members.service';
import { Repository } from 'typeorm';
import { MemberKakaoDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly membersService: MembersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly cachesService: CachesService,
  ) {}

  public async register(user: MemberKakaoDto, ip: string, res: Response) {
    try {
      const { socialId, email } = user;
      const isMemberExist = await this.membersService.getMemberBySocialIdAndEmail(socialId, email);
      if (!isMemberExist) {
        const member = await this.memberRepository.create({
          socialId: user.socialId,
          name: user.name,
          email: user.email,
          birthday: user.birthday,
          image: user.image,
        });
        return await this.login(member, ip, res);
      } else {
        return await this.login(isMemberExist, ip, res);
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('일시적인 오류가 발생했어요');
    }
  }

  private async login(member: Member, ip: string, res: Response) {
    try {
      member.lastLoginAt = new Date();
      member.lastLoginIp = ip;
      await this.memberRepository.save(member);
      const { id, isMoreInfo } = member;
      const accessToken = this.issueToken({ id }, true);
      const refreshToken = this.issueToken({ id }, false);
      this.cachesService.del(id);
      this.cachesService.set(
        id,
        await this.hash(refreshToken),
        parseInt(await this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'), 10),
      );
      res.redirect(
        `${this.configService.get<string>(
          'HMM_FRONT_HOST',
        )}?accessToken=${accessToken}&refreshToken=${refreshToken}&isMoreInfo=${isMoreInfo}`,
      );
      return { code: RESPONSE_CODE.OK };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(RESPONSE_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  private hash(data: string) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(data, salt);
  }

  public async validateRefreshToken(refreshToken: string, id: string) {
    const member = await this.membersService.getMemberById(id);
    const currentHashedRefreshToken: string = (await this.cachesService.get(id)) ?? 'null';
    if (member && (await bcrypt.compare(refreshToken, currentHashedRefreshToken))) {
      return member;
    } else {
      throw new UnauthorizedException();
    }
  }

  private issueToken(payload: { id: string }, isAccessToken: boolean) {
    const secret = this.configService.get<string>(
      isAccessToken ? 'JWT_ACCESS_TOKEN_SECRET_KEY' : 'JWT_REFRESH_TOKEN_SECRET_KEY',
    );
    const expiresIn = parseInt(
      this.configService.get<string>(
        isAccessToken ? 'JWT_ACCESS_TOKEN_EXPIRES_IN' : 'JWT_REFRESH_TOKEN_EXPIRES_IN',
      ),
    );

    const token = this.jwtService.sign({ sub: payload.id }, { secret, expiresIn });
    return token;
  }

  public async issueAccessTokenByRefreshToken(member: Member) {
    const accessToken = this.issueToken({ id: member.id }, true);
    return { code: RESPONSE_CODE.OK, result: accessToken };
  }

  public async logout(member: Member) {
    await this.cachesService.del(member.id);
    return { code: RESPONSE_CODE.OK };
  }
}
