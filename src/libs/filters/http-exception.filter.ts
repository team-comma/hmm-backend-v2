import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const code = exception.getResponse() as
      | string
      | { error: string; statusCode: number; message: string | string[] };

    Logger.error(code['message']);
    return response.status(status).json({
      code:
        typeof code === 'string'
          ? code
          : `CE-${String(code['error']).toUpperCase().replace(' ', '_')}`,
      result: null,
    });
  }
}
