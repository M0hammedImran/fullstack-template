import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IResponse<T> {
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>> {
        const response = context.switchToHttp().getResponse<FastifyReply>();

        return next.handle().pipe(
            map((data) => {
                let responseData = data?.data;

                if (data?.data?.total) {
                    void response.header('X-Total-Count', data?.data?.total);
                    void response.header('X-Limit', data?.data?.limit);
                    responseData = data?.data?.data;
                }

                void response.status(Number.parseInt(String(data?.statusCode || response.statusCode), 10));

                return {
                    data: responseData ?? null,
                    message: data?.message ?? null,
                    statusCode: Number.parseInt(String(data?.statusCode || response.statusCode), 10),
                    timestamp: data?.timestamp || new Date(),
                };
            }),
        );
    }
}
