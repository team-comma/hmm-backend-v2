import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { map, Observable } from 'rxjs';
import { RESPONSE_CODE } from '../constants';

export interface Response<T> {
  code: RESPONSE_CODE;
  result: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<Response<T>> {
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest();
    const allowPath: string[] = ['/api/health'];

    if (allowPath.includes(request.url)) return next.handle().pipe();

    return next.handle().pipe(
      map((data) => ({
        code: data.code ?? RESPONSE_CODE.OK,
        result: data.result ?? null,
      })),
    );
  }
}
