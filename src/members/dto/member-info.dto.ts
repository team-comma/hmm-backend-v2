import { ApiProperty } from '@nestjs/swagger';
import { STUDENT_DEPARTMENT } from '@src/libs/constants';
import { BaseDto } from '@src/libs/dto';
import { Expose } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsString } from 'class-validator';

export class MemberInfoDto extends BaseDto {
  @Expose()
  @ApiProperty({ description: '소셜 아이디' })
  @IsString()
  socialId: string;

  @Expose()
  @ApiProperty({ description: '이름' })
  @IsString()
  name: string;

  @Expose()
  @ApiProperty({ description: '별명' })
  @IsString()
  nickname: string;

  @Expose()
  @ApiProperty({ description: '이메일' })
  @IsString()
  email: string;

  @Expose()
  @ApiProperty({ description: '휴대폰 번호' })
  @IsString()
  mobile: string;

  @Expose()
  @ApiProperty({ description: '프로필 이미지' })
  @IsString()
  image: string;

  @Expose()
  @ApiProperty({ description: '학과' })
  @IsEnum(STUDENT_DEPARTMENT)
  department: STUDENT_DEPARTMENT;

  @Expose()
  @ApiProperty({ description: '학년' })
  @IsString()
  grade: string;

  @Expose()
  @ApiProperty({ description: '반' })
  @IsString()
  class: string;

  @Expose()
  @ApiProperty({ description: '번호' })
  @IsString()
  number: string;

  @ApiProperty({ description: '블랙리스트 유무' })
  @IsBoolean()
  isBlackList: boolean;

  @ApiProperty({ description: '블랙리스트 이유' })
  @IsString()
  blacklistReason: string;

  @Expose()
  @ApiProperty({ description: '출생 년도' })
  @IsString()
  birthyear: string;

  @Expose()
  @ApiProperty({ description: '생일' })
  @IsString()
  birthday: string;

  @ApiProperty({ description: '연령대' })
  @IsString()
  age: string;

  @ApiProperty({ description: '성별' })
  @IsString()
  gender: string;

  @ApiProperty({ description: '소셜 타입' })
  @IsString()
  socialType: string;

  @ApiProperty({ description: '추가 정보 유무' })
  @IsBoolean()
  isMoreInfo: boolean;

  @ApiProperty({ description: '학생 유무' })
  @IsBoolean()
  isStudent: boolean;

  @ApiProperty({ description: '마지막 로그인 한 시간' })
  @IsDate()
  lastLoginAt: Date;

  @ApiProperty({ description: '마지막 로그인 한 IP' })
  @IsString()
  lastLoginIp: string;
}
