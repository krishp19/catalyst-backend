import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Community } from './community.entity';

export enum MemberRole {
  MEMBER = 'member',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

@Entity('community_members')
@Unique(['userId', 'communityId'])
export class CommunityMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Community, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'communityId' })
  community: Community;

  @Column()
  communityId: string;

  @Column({
    type: 'enum',
    enum: MemberRole,
    default: MemberRole.MEMBER,
  })
  role: MemberRole;

  @CreateDateColumn()
  joinedAt: Date;
}