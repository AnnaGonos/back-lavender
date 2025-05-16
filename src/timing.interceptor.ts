import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { Request, Response } from 'express';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = performance.now();

    return next.handle().pipe(
      tap(() => {
        const endTime = performance.now();
        const elapsedTime = (endTime - startTime).toFixed(0);
        const type = this.getRequestType(context);

        if (type === 'http') {
          this.handleHttpRequest(context, elapsedTime);
        } else if (type === 'graphql') {
          this.handleGraphqlRequest(context, elapsedTime);
        }

        console.log(`Request processed in ${elapsedTime}ms`);
      }),
    );
  }

  private getRequestType(
    context: ExecutionContext,
  ): 'http' | 'graphql' | 'unknown' {
    const type = context.getType?.();
    if (type === 'http') {
      return 'http';
    }
    try {
      GqlArgumentsHost.create(context);
      return 'graphql';
    } catch {
      return 'unknown';
    }
  }

  private handleHttpRequest(context: ExecutionContext, elapsedTime: string) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    if (this.isHtmlRequest(request)) {
      response.locals = response.locals || {};
      response.locals.elapsedTime = `${elapsedTime} мс.`;
    } else {
      response.setHeader('X-Elapsed-Time', `${elapsedTime}ms`);
    }
  }

  private isHtmlRequest(request: Request): boolean {
    const acceptHeader = request.headers['accept'];
    return (
      typeof acceptHeader === 'string' && acceptHeader.includes('text/html')
    );
  }

  private handleGraphqlRequest(context: ExecutionContext, elapsedTime: string) {
    const gqlContext = GqlArgumentsHost.create(context).getContext<{
      res?: Response;
    }>();
    const response = gqlContext?.res;

    if (response) {
      response.setHeader('X-Elapsed-Time', `${elapsedTime}ms`);
    } else {
      console.log('GraphQL response object not found.');
    }
  }
}
