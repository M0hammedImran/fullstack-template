import '@total-typescript/ts-reset';
import 'reflect-metadata';

import fastifyHelmet from '@fastify/helmet';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { init } from './initializeEnvironmentVariables';

async function bootstrap() {
    init();

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

    app.enableCors({ origin: process.env.CORS_URL, credentials: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await app.register(fastifyHelmet, { contentSecurityPolicy: false });

    app.setGlobalPrefix('api/v1', {
        exclude: [{ path: 'health', method: RequestMethod.GET }],
    });

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Service')
        .setDescription("The API's Service")
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('documentation', app, document);

    // Starts listening for shutdown hooks
    if (process.env.NODE_ENV !== 'production') {
        app.enableShutdownHooks();
    }

    await app.listen(process.env.APP_PORT, '0.0.0.0');

    return app;
}

void bootstrap();
