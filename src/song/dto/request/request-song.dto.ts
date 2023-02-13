import { PickType } from '@nestjs/swagger';
import { SongInfoDto } from '../song-info.dto';

export class RequestSongDto extends PickType(SongInfoDto, [
  'title',
  'image',
  'artist',
  'album',
  'releaseDate',
]) {}
