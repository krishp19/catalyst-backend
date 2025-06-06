import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { CommunityMember } from './community-member.entity';
import { Topic } from '../../topics/entities/topic.entity';

@Entity('communities')
export class Community {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  bannerUrl: string;

  @Column({ nullable: true })
  iconUrl: string;

  @Column({ default: 0 })
  memberCount: number;

  @ManyToOne(() => User, (user) => user.createdCommunities)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @Column()
  creatorId: string;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  @OneToMany(() => Post, (post) => post.community)
  posts: Post[];

  @OneToMany(() => CommunityMember, (member) => member.community)
  members: CommunityMember[];

  @ManyToMany(() => Topic, topic => topic.communities, { cascade: true })
  @JoinTable({
    name: 'community_topics',
    joinColumn: { name: 'communityId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'topicId', referencedColumnName: 'id' },
  })
  topics: Topic[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}