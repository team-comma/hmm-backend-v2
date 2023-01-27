import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Member } from '@src/entities';
import { Request } from 'express';

export const GetMember = createParamDecorator((data: string, ctx: ExecutionContext): Member => {
  const request: Request = ctx.switchToHttp().getRequest();
  const member = request.user;

  return data ? member?.[data] : member;
});
