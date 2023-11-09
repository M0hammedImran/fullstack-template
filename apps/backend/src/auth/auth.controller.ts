import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { ConfirmPasswordDto, ForgotPasswordDto, LoginUserDto, RefreshAccessTokenDto } from './dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Post('confirm-password')
    async confirmPassword(@Body() confirmPasswordDto: ConfirmPasswordDto) {
        return this.authService.confirmPassword(confirmPasswordDto);
    }

    @Put('refresh')
    async refreshAccessToken(@Body() refreshAccessTokenDto: RefreshAccessTokenDto) {
        return this.authService.refreshAccessToken(refreshAccessTokenDto);
    }

    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    logout() {
        return this.authService.logout();
    }
}
