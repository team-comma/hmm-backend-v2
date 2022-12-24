import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Put('profile/:id')
  public updateMember(@Param('id') memberId: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.updateMemberById(memberId, updateMemberDto);
  }
}
