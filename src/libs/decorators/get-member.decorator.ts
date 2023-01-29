import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MemberInfoDto } from '@src/members/dto';
import { Request } from 'express';

export const GetMember = createParamDecorator(
  (data: string, ctx: ExecutionContext): MemberInfoDto => {
    const request: Request = ctx.switchToHttp().getRequest();
    const member = request.user;

    return data ? member?.[data] : member;
  },
);
