import { STUDENT_DEPARTMENT } from 'src/libs/constants';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('tb_member')
export class Member extends BaseEntity {
  @Column({ type: 'varchar', name: 'social_id', unique: true })
  socialId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  nickname: string | null;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  image: string;

  @Column({ type: 'enum', enum: STUDENT_DEPARTMENT, default: null, nullable: true })
  department: STUDENT_DEPARTMENT | null;

  @Column({ type: 'int', precision: 1, default: null, nullable: true })
  grade: number | null;

  @Column({ type: 'int', precision: 1, default: null, nullable: true })
  class: number | null;

  @Column({ type: 'int', precision: 2, default: null, nullable: true })
  number: number | null;

  @Column({ type: 'tinyint', name: 'is_blacklist', default: 0 })
  isBlacklist: boolean;

  @Column({ type: 'varchar', name: 'blacklist_reason', default: null, nullable: true })
  blacklistReason: string | null;

  @Column({ type: 'int', precision: 4, default: null, nullable: true })
  birthday: number | null;

  @Column({ type: 'tinyint', name: 'is_more_info', default: 0 })
  isMoreInfo: boolean;

  @Column({
    type: 'timestamp',
    name: 'last_login_at',
    default: null,
    nullable: true,
  })
  lastLoginAt: Date | null;

  @Column({
    type: 'varchar',
    name: 'last_login_ip',
    default: null,
    nullable: true,
  })
  lastLoginIp: string | null;
}
