import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql/error';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements GqlExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const contextType = host.getType();

    if (
      exception instanceof Error &&
      exception.message === 'Response already sent'
    ) {
      return;
    }

    if (contextType === 'http') {
      return this.handleHttpException(exception, host);
    } else if (GqlArgumentsHost.create(host)) {
      return this.handleGqlException(exception);
    } else {
      console.error('Unhandled exception:', exception);
      throw exception;
    }
  }

  private handleHttpException(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as { message: string }).message || message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }

  private handleGqlException(exception: unknown): never {
    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse();
      throw new GraphQLError(
        typeof errorResponse === 'string'
          ? errorResponse
          : JSON.stringify(errorResponse),
        {
          extensions: {
            code: exception.getStatus(),
          },
        },
      );
    } else if (exception instanceof Error) {
      throw new GraphQLError(exception.message, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    } else {
      throw new GraphQLError('Internal Server Error', {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }
}
