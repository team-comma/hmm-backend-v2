import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class TokenDto {
  @Expose()
  @ApiProperty({ description: '액세스 토큰' })
  @IsString()
  accessToken: string;

  @Expose()
  @ApiProperty({ description: '리프레시 토큰' })
  @IsString()
  refreshToken: string;
}
