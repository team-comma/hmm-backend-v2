import { PickType } from '@nestjs/swagger';
import { MemberInfoDto } from '../member-info.dto';

export class RequestUpdateMemberInfoDto extends PickType(MemberInfoDto, [
  'grade',
  'department',
  'class',
  'number',
  'isMoreInfo',
  'nickname',
]) {
  isMoreInfo = true;
}
