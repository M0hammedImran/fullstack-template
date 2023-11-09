import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
    @ApiProperty({
        example: 'username@example.com',
    })
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty({
        example: 'Password@123',
    })
    @IsNotEmpty()
    readonly password: string;
}
