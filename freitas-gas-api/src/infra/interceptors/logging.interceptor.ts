import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadGatewayException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoggingService } from '../services/logging.service';
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from 'src/common/constants';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private loggingService: LoggingService,
    private fieldsToHide?: string[],
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    const { method, url, body, params } = req;
    const startTime = Date.now();

    let decoded;

    if (req.headers.authorization) {
      const [, token] = req.headers.authorization.split(' ');

      if (token) {
        decoded = jwt.verify(token, jwtSecret);
      }
    }

    return next.handle().pipe(
      tap((data) => {
        const endTime = Date.now();
        const executionTime = endTime - startTime;

        const copiedData = JSON.parse(JSON.stringify(data));
        // Aqui você pode guardar os dados de entrada, resposta e qualquer outro dado relevante em um serviço de log
        this.loggingService.logRequest(
          method,
          url,
          body,
          params,
          copiedData,
          executionTime,
          this.fieldsToHide,
          decoded?.id ?? null,
        );

        return data;
      }),

      catchError((error) => {
        const endTime = Date.now();
        const executionTime = endTime - startTime;
        // Log de erro
        this.loggingService.logError(
          method,
          url,
          body,
          params,
          error,
          executionTime,
          this.fieldsToHide,
          decoded?.id ?? null,
        );

        if (error.status === 404) {
          return throwError(() => new NotFoundException(error.message));
        } else if (error.status === 401 || error.status === 403) {
          return throwError(() => new UnauthorizedException(error.message));
        } else if (error.status === 400) {
          return throwError(() => new BadRequestException(error.message));
        }
        // Lançar o erro novamente para propagação
        return throwError(() => new BadGatewayException());
      }),
    );
  }
}
