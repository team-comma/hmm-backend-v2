import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class BaseDto {
  @Expose()
  @ApiProperty({ description: '식별 아이디' })
  @IsString()
  id: string;

  @Exclude()
  @ApiProperty({ description: '생성 일자' })
  @IsDate()
  createdAt: Date;

  @Exclude()
  @ApiProperty({ description: '수정 일자' })
  @IsDate()
  updatedAt: Date;
}
