import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Member } from './member.entity';
import { Song } from './song.entity';

@Entity('tb_song_playlist')
export class SongPlaylist extends BaseEntity {
  @OneToOne(() => Song, (song) => song.songPlaylist)
  @JoinColumn({ name: 'song_id' })
  song: Song;

  @ManyToOne(() => Member, (member) => member.songPlaylists)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ type: 'varchar', name: 'playback_status', default: 'before' })
  playbackStatus: string;
}
