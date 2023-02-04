import { PickType } from '@nestjs/swagger';
import { MemberInfoDto } from '../member-info.dto';

export class ResponseMemberProfileDto extends PickType(MemberInfoDto, [
  'id',
  'nickname',
  'image',
  'grade',
  'department',
  'class',
  'number',
  'birthday',
]) {}
