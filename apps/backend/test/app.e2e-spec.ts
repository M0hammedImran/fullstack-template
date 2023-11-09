import type { INestApplication } from '@nestjs/common';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import supertest from 'supertest';

import { AppModule } from '@/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication<NestFastifyApplication>();
        await app.init();
    });

    it('/ (GET)', () => supertest(app.getHttpServer()).get('/').expect(200).expect('Hello World!'));
});
