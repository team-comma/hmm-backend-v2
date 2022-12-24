import { IsNotEmpty, IsString } from 'class-validator';

export class MemberKakaoDto {
  @IsNotEmpty()
  @IsString()
  socialId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsString()
  email: string;

  @IsString()
  birthday: number | null;
}
