import {
  ExceptionFilter,
  Catch,
  HttpException,
  ExecutionContext,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class JwtAuthRedirectFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ExecutionContext) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if ((status === 401 || status === 403) && request.accepts('html')) {
      return response.redirect('/auth/login');
    }

    // для API
    return response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
