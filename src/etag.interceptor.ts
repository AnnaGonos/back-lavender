import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';
import { Request, Response } from 'express';

@Injectable()
export class EtagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    if (request.method !== 'GET') {
      return next.handle();
    }

    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap((data) => {
        const etag = crypto
          .createHash('md5')
          .update(JSON.stringify(data))
          .digest('hex');

        response.setHeader('ETag', etag);

        const ifNoneMatch = request.headers['if-none-match'];
        if (ifNoneMatch === etag) {
          response.status(304).end();
          throw new Error('Response already sent');
        }
      }),
    );
  }
}
