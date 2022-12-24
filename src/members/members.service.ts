import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/entities';
import { RESPONSE_CODE } from 'src/libs/constants';
import { Repository } from 'typeorm';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  public async getMemberById(id: string) {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) throw new NotFoundException('유저 정보를 찾을 수 없어요');
    return member;
  }

  public async getMemberBySocialIdAndEmail(id: string, email: string) {
    return await this.memberRepository.findOne({ where: { socialId: id, email: email } });
  }

  public async updateMemberById(id: string, updateMemberDto: UpdateMemberDto) {
    try {
      const member = await this.memberRepository.update(id, updateMemberDto);
      return { code: RESPONSE_CODE.OK, result: member };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(RESPONSE_CODE.INTERNAL_SERVER_ERROR);
    }
  }
}
