import { HttpModule } from '@nestjs/axios';
import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { HeaderInterceptor } from './interceptors/header.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { NotificationService } from './services';

const providers: Provider[] = [
    NotificationService,
    {
        provide: APP_INTERCEPTOR,
        useClass: HeaderInterceptor,
    },
    {
        provide: APP_INTERCEPTOR,
        useClass: TransformInterceptor,
    },
];

@Global()
@Module({
    providers,
    imports: [HttpModule],
    exports: [NotificationService],
})
export class SharedModule {}
