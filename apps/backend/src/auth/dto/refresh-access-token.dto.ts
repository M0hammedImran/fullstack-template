import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshAccessTokenDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly refreshToken: string;
}
