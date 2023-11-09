import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ConfirmPasswordDto {
    @ApiProperty({
        example: 'username@example.com',
    })
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        example: '92f1f883-0f93-4a89-bc32-94addc2e1a9b',
    })
    @IsNotEmpty()
    readonly verificationCode: string;

    @ApiProperty({
        example: 'Test@123',
    })
    @IsNotEmpty()
    readonly password: string;
}
