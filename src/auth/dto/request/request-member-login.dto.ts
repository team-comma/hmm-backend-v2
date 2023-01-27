import { PickType } from '@nestjs/swagger';
import { MemberInfoDto } from '@src/members/dto';

export class RequestMemberLoginDto extends PickType(MemberInfoDto, [
  'socialId',
  'socialType',
  'name',
  'nickname',
  'email',
  'mobile',
  'image',
  'birthyear',
  'birthday',
  'age',
  'gender',
]) {}
