import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetMember } from '@src/libs/decorators';
import { MemberInfoDto } from '@src/members/dto';
import { RequestSongDto } from './dto';
import { SongService } from './song.service';

@ApiTags('song')
@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @ApiOperation({
    summary: '유저 하루 노래 신청 수 조회 API',
    description: '유저가 하루에 신청한 노래 개수를 조회합니다',
  })
  @ApiResponse({ type: Number, status: 200 })
  @ApiBearerAuth('access-token')
  @Get('request')
  public countRequestSongByMember(@GetMember('id') memberId: string) {
    return this.songService.countRequestSongByMember(memberId);
  }

  @ApiOperation({
    summary: '유저 노래 신청 API',
    description: '유저가 노래를 신청합니다',
  })
  @ApiBody({ type: [RequestSongDto] })
  @ApiBearerAuth('access-token')
  @Post('request')
  public requestSong(@GetMember() member: MemberInfoDto, @Body() requestSongDto: RequestSongDto[]) {
    return this.songService.requestSong(member, requestSongDto);
  }

  @ApiOperation({
    summary: '유저 노래 신청 취소 API',
    description: '유저가 신청한 노래를 취소한다',
  })
  @ApiBearerAuth('access-token')
  @Post('request/cancel')
  public cancelSongRequest(@GetMember('id') memberId: string, @Body() ids: []) {
    return this.songService.cancelSongRequest(memberId, ids);
  }

  // @ApiOperation({})
  // @UseGuards(AccessTokenAuthGuard)
  // @Patch('playlist/:id')
  // public updateSongPlaybackStatus(
  //   @Param('id') playlistId: string,
  //   @Body() requestUpdateSongPlaybackStatusDto: RequestUpdateSongPlaybackStatusDto,
  // ) {
  //   return this.songService.updateSongPlaybackStatus(
  //     playlistId,
  //     requestUpdateSongPlaybackStatusDto,
  //   );
  // }

  @ApiOperation({
    summary: '노래 플레이리스트 추출 API',
    description: '유튜브 플레이리스트를 추출합니다',
  })
  @ApiBearerAuth('access-token')
  @Get('playlist/extract')
  public extractPlaylist() {
    return this.songService.extractPlaylist();
  }
}
