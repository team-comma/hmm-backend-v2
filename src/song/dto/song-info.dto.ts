import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@src/libs/dto';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class SongInfoDto extends BaseDto {
  @Expose()
  @ApiProperty({ description: '제목' })
  @IsString()
  title: string;

  @Expose()
  @ApiProperty({ description: '이미지' })
  @IsString()
  image: string;

  @Expose()
  @ApiProperty({ description: '아티스트' })
  @IsString()
  artist: string;

  @Expose()
  @ApiProperty({ description: '앨범' })
  @IsString()
  album: string;

  @Expose()
  @ApiProperty({ description: '발매일' })
  @IsString()
  releaseDate: string;
}
