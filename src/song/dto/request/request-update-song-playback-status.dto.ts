import { IsString } from 'class-validator';

export class RequestUpdateSongPlaybackStatusDto {
  @IsString()
  playbackStatus: string;
}
