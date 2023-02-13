import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SongPlaylist } from './song-playlist.entity';

@Entity('tb_song')
export class Song extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  image: string;

  @Column({ type: 'varchar' })
  artist: string;

  @Column({ type: 'varchar' })
  album: string;

  @Column({ type: 'varchar', name: 'release_date' })
  releaseDate: string;

  @OneToOne(() => SongPlaylist, (songPlaylist) => songPlaylist.member)
  songPlaylist: SongPlaylist;
}
