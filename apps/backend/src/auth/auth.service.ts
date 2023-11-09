import { randomUUID } from 'node:crypto';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { add, format } from 'date-fns';
import { Repository } from 'typeorm';

import type { IResponse } from '@/shared/interfaces';
import { NotificationService } from '@/shared/services';
import { CommonUtility, ResponseUtility } from '@/shared/utilities';
import { User } from '@/user/entities';

import type { ConfirmPasswordDto, ForgotPasswordDto, LoginUserDto, RefreshAccessTokenDto } from './dto';
import type { IJwtPayload, ITokenResponse } from './interfaces';

@Injectable()
export class AuthService {
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache;

    @InjectRepository(User)
    private readonly userRepository: Repository<User>;

    @Inject()
    private readonly jwtService: JwtService;

    @Inject()
    private readonly notificationService: NotificationService;

    async login(loginUserDto: LoginUserDto) {
        const user = await this.userRepository.findOne({
            where: { email: loginUserDto.email },
        });

        if (!user) {
            return ResponseUtility.NotFound('User Not Found');
        }

        if (!user.is_verified) {
            return ResponseUtility.Forbidden('Email Or Password is incorrect!');
        }

        if (!(await CommonUtility.checkPassword(loginUserDto.password, user.password))) {
            return ResponseUtility.Forbidden('Email Or Password is incorrect!');
        }

        const data = {
            ksuid: user.ksuid,
            email: user.email,
        };

        return ResponseUtility.Ok({
            accessToken: await this.createAccessToken(data),
            refreshToken: await this.createRefreshToken(data),
            id: user.id.toString(),
            expires_in: Number(format(add(new Date(), { minutes: 30 }), 't')),
        });
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const userDetails = await this.userRepository.findOne({
            where: { email: forgotPasswordDto.email },
        });

        if (!userDetails) {
            return ResponseUtility.NotFound('User Not Found');
        }

        const oneTimeCode = randomUUID();

        // ttl = 10 minutes
        await this.cacheManager.set(`UT-${userDetails.ksuid}`, oneTimeCode, 600000);

        await this.notificationService.email({
            to: userDetails.email,
            title: 'Reset Password',
            html: oneTimeCode,
        });

        return ResponseUtility.OkEmpty();
    }

    async confirmPassword(confirmPasswordDto: ConfirmPasswordDto): Promise<IResponse> {
        const userDetails = await this.userRepository.findOne({
            where: { email: confirmPasswordDto.email },
        });

        if (!userDetails) {
            return ResponseUtility.NotFound('User Not Found');
        }

        const verificationCode = await this.cacheManager.get<string>(`UT-${userDetails.ksuid}`);

        if (!verificationCode) {
            return ResponseUtility.Forbidden('Invalid Verification Code');
        }

        if (verificationCode !== confirmPasswordDto.verificationCode) {
            return ResponseUtility.Forbidden('Invalid Verification Code');
        }

        const hashedPassword = await CommonUtility.hashPassword(confirmPasswordDto.password);
        await this.userRepository.update(userDetails.id, { password: hashedPassword });
        await this.cacheManager.del(`UT-${userDetails.ksuid}`);

        return ResponseUtility.OkEmpty();
    }

    private async createAccessToken(payload: IJwtPayload) {
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });

        await this.cacheManager.set(accessToken, payload.ksuid, 86400000);

        return accessToken;
    }

    /**
     * The function creates a refresh token using a JWT payload and stores it in a cache with a TTL of 1 week.
     * @param {IJwtPayload} payload - The payload parameter is an object that contains the data that will be encoded
     * into the refresh token. It typically includes information such as the user's ID, username, and any other
     * relevant data that needs to be stored in the token.
     * @returns {Promise<string>} the refresh token.
     */
    private async createRefreshToken(payload: IJwtPayload): Promise<string> {
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '1w' });

        // ttl = 1 week
        await this.cacheManager.set(refreshToken, payload.ksuid, 604800000);

        return refreshToken;
    }

    /**
     * The function refreshes the access token for a user by validating the refresh token, retrieving user details,
     * deleting the refresh token from cache, and returning a new access token and refresh token.
     * @param {RefreshAccessTokenDto} refreshAccessTokenDto - The `refreshAccessTokenDto` parameter is an object that
     * contains the following properties:
     */
    async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto): Promise<IResponse<ITokenResponse | null>> {
        const userKsuid = await this.cacheManager.get<string>(refreshAccessTokenDto.refreshToken);

        if (!userKsuid) {
            return ResponseUtility.Unauthorized('Unauthorized');
        }

        const userDetails = await this.userRepository.findOne({
            where: { ksuid: userKsuid },
        });

        if (!userDetails) {
            return ResponseUtility.NotFound('User Not Found');
        }

        await this.cacheManager.del(refreshAccessTokenDto.refreshToken);

        const jwtPayload = { ksuid: userDetails.ksuid, email: userDetails.email };

        return ResponseUtility.Ok({
            accessToken: await this.createAccessToken(jwtPayload),
            refreshToken: await this.createRefreshToken(jwtPayload),
            expires_in: Number(format(add(new Date(), { days: 1 }), 't')),
        });
    }

    logout() {
        // await this.cacheManager.del(refreshAccessTokenDto.refreshToken);
        return ResponseUtility.OkEmpty();
    }
}
