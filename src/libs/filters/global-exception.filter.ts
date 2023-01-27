import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();

      return response.status(status).json({
        status: 'FAILED',
        message: typeof message === 'string' ? message : message['message'],
        result: typeof message === 'string' ? null : message['errors'] ?? null,
      });
    }
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'FAILED',
      message: '일시적인 오류가 발생했어요. 오류가 지속될시 학생회나, 방송부에게 말해주세요!',
      result: null,
    });
  }
}
