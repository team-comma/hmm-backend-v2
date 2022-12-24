import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { STUDENT_DEPARTMENT } from 'src/libs/constants';

export class UpdateMemberDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsOptional()
  @IsEnum(STUDENT_DEPARTMENT)
  department: STUDENT_DEPARTMENT;

  @Transform(({ value }) => Number.parseInt(value))
  @IsOptional()
  @Min(1)
  @Max(3)
  grade: number | null;

  @Transform(({ value }) => Number.parseInt(value))
  @IsOptional()
  @Min(1)
  @Max(2)
  class: number | null;

  @Transform(({ value }) => Number.parseInt(value))
  @IsOptional()
  @Min(1)
  @Max(25)
  number: number | null;

  @IsOptional()
  @IsBoolean()
  isMoreInfo = true;
}
