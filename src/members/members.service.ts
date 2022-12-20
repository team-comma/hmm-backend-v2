import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/entities';
import { Repository } from 'typeorm';

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
}
