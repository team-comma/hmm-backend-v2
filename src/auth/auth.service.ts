import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CachesService } from '@src/caches/caches.service';
import { Member } from '@src/entities';
import { ROLE } from '@src/libs/constants/role';
import { checkIsStudent } from '@src/libs/utils';
import { MemberInfoDto } from '@src/members/dto';
import { MembersService } from '@src/members/members.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { RequestMemberLoginDto } from './dto';

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

  public async createMember(requestMemberLoginDto: RequestMemberLoginDto) {
    try {
      const {
        socialType,
        socialId,
        name,
        nickname,
        email,
        mobile,
        image,
        birthyear,
        birthday,
        age,
        gender,
      } = requestMemberLoginDto;

      const isMemberExist = await this.membersService.getMemberBySocialIdAndEmail(socialId, email);
      if (isMemberExist) return isMemberExist;

      const member = await this.memberRepository.create({
        socialType: socialType,
        socialId: socialId,
        email: email,
        mobile: mobile,
        name: name,
        nickname: nickname,
        image: image,
        birthyear: birthyear,
        birthday: birthday,
        age: age,
        gender: gender,
        role: checkIsStudent(birthyear) ? [ROLE.USER] : [ROLE.OUTSIDER],
      });
      await this.memberRepository.save(member);
      return member;
    } catch (error) {
      throw error;
    }
  }

  public async successLoginHandler(member: MemberInfoDto, ip: string, res: Response) {
    try {
      const { id, isMoreInfo, birthyear } = member;
      await this.memberRepository.update(id, { lastLoginAt: new Date(), lastLoginIp: ip });
      const { accessToken } = await this.issueToken(id, true);
      const { refreshToken, ...refreshOption } = await this.issueToken(id, false);

      this.cachesService.del(id);
      this.cachesService.set(
        id,
        await this.hash(refreshToken),
        parseInt(await this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'), 10),
      );
      console.log(accessToken);
      console.log(refreshToken);

      res.cookie('refresh', refreshToken, refreshOption);
      res.redirect(
        `${await this.configService.get<string>(
          'HMM_FRONT_HOST',
        )}?accessToken=${accessToken}&isMoreInfo=${isMoreInfo}&isStudent=${checkIsStudent(
          birthyear,
        )}`,
      );
    } catch (error) {
      throw error;
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

  private issueToken(id: string, isAccessToken: boolean) {
    const secret = this.configService.get<string>(
      isAccessToken ? 'JWT_ACCESS_TOKEN_SECRET_KEY' : 'JWT_REFRESH_TOKEN_SECRET_KEY',
    );
    const expiresIn = parseInt(
      this.configService.get<string>(
        isAccessToken ? 'JWT_ACCESS_TOKEN_EXPIRES_IN' : 'JWT_REFRESH_TOKEN_EXPIRES_IN',
      ),
    );

    const token = this.jwtService.sign({ sub: id }, { secret, expiresIn });
    return isAccessToken
      ? { accessToken: token }
      : {
          refreshToken: token,
          domain: this.configService.get<string>('DOMAIN'),
          path: '/',
          httpOnly: true,
          secure: this.configService.get<string>('ENV_NAME') !== 'local' ? true : false,
          maxAge: expiresIn * 1000,
        };
  }

  public async reissueAccessTokenByRefreshToken(memberId: string) {
    const { accessToken } = this.issueToken(memberId, true);
    return accessToken;
  }

  public async logout(memberId: string) {
    await this.cachesService.del(memberId);
    return;
  }
}
