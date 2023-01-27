import { PickType } from '@nestjs/swagger';
import { TokenDto } from '../token.dto';

export class ResponseReissueAccessToken extends PickType(TokenDto, ['accessToken']) {}
