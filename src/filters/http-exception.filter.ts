import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  message: string;
  stack?: string;
}

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
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
    } as ErrorResponse;

    if (process.env.NODE_ENV === 'production') {
      delete responseError.stack;
    }

    response.status(status).json(responseError);
  }
}
