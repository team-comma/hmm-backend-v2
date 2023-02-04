import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetMember } from '@src/libs/decorators';
import { Serialize } from '@src/libs/interceptors';
import { MemberInfoDto, RequestUpdateMemberInfoDto, ResponseMemberProfileDto } from './dto';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
  constructor(private readonly memberService: MembersService) {}

  @ApiOperation({
    summary: '유저 정보 조회 API',
    description: '유저가 자기 자신의 정보를 조회한다',
  })
  @ApiResponse({ type: ResponseMemberProfileDto, status: 200 })
  @ApiBearerAuth('access-token')
  @Serialize(ResponseMemberProfileDto)
  @Get('profile')
  public getMemberProfile(@GetMember() member: MemberInfoDto) {
    return member;
  }

  @ApiOperation({
    summary: '유저 정보 수정 API',
    description: '유저기 자기 자신의 정보를 수정한다',
  })
  @Patch('profile')
  public updateMemberInfo(
    @GetMember('id') memberId: string,
    @Body() requestUpdateMemberInfoDto: RequestUpdateMemberInfoDto,
  ) {
    return this.memberService.updateMemberInfo(memberId, requestUpdateMemberInfoDto);
  }
}
