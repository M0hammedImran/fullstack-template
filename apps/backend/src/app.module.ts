import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: () => ({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: ['dist/**/entities/*.entity.{ts,js}'],
                ssl: false,
                synchronize: false,
                logging: ['query', 'error'],
            }),
            inject: [],
        }),
        PassportModule,
        UserModule,
        SharedModule,
        AuthModule,
        HttpModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
