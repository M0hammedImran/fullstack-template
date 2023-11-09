import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-ioredis-yet';

import { NotificationService } from '@/shared/services';
import { User } from '@/user/entities';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async () => ({
                store: await redisStore({
                    host: process.env.REDIS_HOST,
                    port: process.env.REDIS_PORT,
                    password: process.env.REDIS_PASSWORD,
                    db: process.env.REDIS_DB,
                }),
            }),
        }),
        JwtModule.registerAsync({
            useFactory() {
                return {
                    secret: process.env.JWT_ACCESS_SECRET,
                };
            },
            inject: [],
        }),
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, NotificationService],
})
export class AuthModule {}
