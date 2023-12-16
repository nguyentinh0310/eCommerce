import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseError = {
      statusCode: status,
      message: exception.message || HttpStatus[status],
      stack: (exception as any).stack, // Type assertion here
    };

    if (process.env.NODE_ENV === 'production') {
      delete responseError.stack;
    }

    response.status(status).json(responseError);
  }
}
