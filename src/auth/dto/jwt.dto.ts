import { IsNumber, IsString } from 'class-validator';

export class JwtDto {
  @IsString()
  sub: string;

  @IsNumber()
  iat: number;

  @IsNumber()
  exp: number;
}
