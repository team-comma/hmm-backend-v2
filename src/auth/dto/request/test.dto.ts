import { IsNotEmpty, IsString } from 'class-validator';

export class TestDto {
  @IsNotEmpty()
  @IsString()
  test: string;
}
