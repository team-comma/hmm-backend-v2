import { STUDENT_DEPARTMENT } from '@src/libs/constants';
import { ROLE } from '@src/libs/constants/role';
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
  mobile: string;

  @Column({ type: 'varchar' })
  image: string;

  @Column({ type: 'enum', enum: STUDENT_DEPARTMENT, default: null, nullable: true })
  department: STUDENT_DEPARTMENT | null;

  @Column({ type: 'varchar', default: null, nullable: true })
  grade: string | null;

  @Column({ type: 'varchar', default: null, nullable: true })
  class: string | null;

  @Column({ type: 'varchar', default: null, nullable: true })
  number: string | null;

  @Column({ type: 'tinyint', name: 'is_blacklist', default: 0 })
  isBlacklist: boolean;

  @Column({ type: 'varchar', name: 'blacklist_reason', default: null, nullable: true })
  blacklistReason: string | null;

  @Column({ type: 'varchar', default: null, nullable: true })
  birthyear: string | null;

  @Column({ type: 'varchar', default: null, nullable: true })
  birthday: string | null;

  @Column({ type: 'varchar' })
  age: string;

  @Column({ type: 'varchar' })
  gender: string;

  @Column({ type: 'varchar', name: 'social_type' })
  socialType: string;

  @Column({ type: 'tinyint', name: 'is_more_info', default: 0 })
  isMoreInfo: boolean;

  @Column({ type: 'set', enum: ROLE })
  role: ROLE[];

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
