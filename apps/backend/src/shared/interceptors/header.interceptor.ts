import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HeaderInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        return next.handle().pipe(
            tap(() => {
                const res = context.switchToHttp().getResponse();
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Credentials', 'true');
                res.header('Access-Control-Max-Age', '1800');
                res.header('Access-Control-Allow-Headers', 'content-type');
                res.header('Access-Control-Allow-Methods', 'PUT, POST, GET');
            }),
        );
    }
}
