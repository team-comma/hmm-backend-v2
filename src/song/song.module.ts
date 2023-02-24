import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song, SongPlaylist } from '@src/entities';
import { YoutubeModule } from '@src/youtube/youtube.module';
import { SongController } from './song.controller';
import { SongService } from './song.service';

@Module({
  imports: [TypeOrmModule.forFeature([Song, SongPlaylist]), YoutubeModule],
  controllers: [SongController],
  providers: [SongService],
  exports: [SongService],
})
export class SongModule {}
