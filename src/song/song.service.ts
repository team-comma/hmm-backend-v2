import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song, SongPlaylist } from '@src/entities';
import { currentDate } from '@src/libs/utils';
import { MemberInfoDto } from '@src/members/dto';
import { YoutubeService } from '@src/youtube/youtube.service';
import { In, Repository } from 'typeorm';
import { RequestSongDto, RequestUpdateSongPlaybackStatusDto } from './dto';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
    @InjectRepository(SongPlaylist)
    private readonly songPlaylistRepository: Repository<SongPlaylist>,
    private readonly youtubeService: YoutubeService,
  ) {}

  public async countRequestSongByMember(memberId: string) {
    return await this.songPlaylistRepository.count({
      where: {
        member: {
          id: memberId,
        },
      },
    });
  }

  public async requestSong(member: MemberInfoDto, requestSongDto: RequestSongDto[]) {
    try {
      const songs = await Promise.all(
        requestSongDto.map(async (requestSongDto) => {
          let song;
          const { title, image, artist, album, releaseDate } = requestSongDto;
          song = await this.songRepository.findOne({
            where: { title, artist },
          });
          if (!song) {
            song = this.songRepository.create({
              title,
              image,
              artist,
              album,
              releaseDate,
            });
            await this.songRepository.save(song);
          }
          return song;
        }),
      );

      if ((await this.countRequestSongByMember(member.id)) + requestSongDto.length > 3)
        throw new BadRequestException(
          '하루 최대 신청 가능한 노래는 3곡입니다. 내일 다시 신청해주세요',
        );

      const songIds = songs.map((x) => {
        return x.id;
      });

      const isExistRequestSong = await this.songPlaylistRepository.count({
        where: {
          song: {
            id: In(songIds),
          },
        },
      });

      if (isExistRequestSong)
        throw new BadRequestException(
          '이미 신청되어 있는 곡이거나, 재생된 곡입니다. 내일 다시 신청해주세요',
        );

      for (const song of songs) {
        this.songPlaylistRepository.insert({
          song,
          member,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  public async cancelSongRequest(memberId: string, ids: []) {
    await this.songPlaylistRepository.softDelete({
      id: In([ids]),
      member: {
        id: memberId,
      },
    });
  }

  public async updateSongPlaybackStatus(
    playlistId: string,
    requestUpdateSongPlaybackStatusDto: RequestUpdateSongPlaybackStatusDto,
  ) {
    return await this.songPlaylistRepository.update(playlistId, requestUpdateSongPlaybackStatusDto);
  }

  // To Do 속도 개선 부분
  public async extractPlaylist() {
    try {
      const songs = await this.songPlaylistRepository.find({
        relations: ['song'],
        take: 5,
      });
      if (songs.length === 0) throw new BadRequestException('신청된 곡이 없어요');

      const { id }: { id: string } = await this.youtubeService.createPlaylist(currentDate());

      for (const songPlaylist of songs) {
        const resourceId: { kind: string; videoId: string } = await this.youtubeService.getVideoId(
          songPlaylist.song.title + ' ' + songPlaylist.song.artist,
        );
        this.youtubeService.addSongForPlaylist({ playlistId: id, resourceId });
      }

      return `https://www.youtube.com/playlist?list=${id}`;
    } catch (error) {
      throw error;
    }
  }
}
