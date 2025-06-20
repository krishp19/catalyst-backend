import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Community } from '../../communities/entities/community.entity';
import { CommunityMember } from '../../communities/entities/community-member.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Vote } from '../../votes/entities/vote.entity';
import { Notification } from '../../notifications/entities/notification.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  otpCode: string;

  @Column({ type: 'timestamp', nullable: true })
  @Exclude({ toPlainOnly: true })
  otpExpires: Date;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: 0 })
  reputationScore: number;

  @Column({ default: 0 })
  postScore: number;

  @Column({ default: 0 })
  commentScore: number;

  @Column({ default: 0 })
  communityScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Community, (community) => community.creator)
  createdCommunities: Community[];

  @OneToMany('CommunityMember', 'user')
  communityMemberships: CommunityMember[];

  // Helper method to check if user is a member of a specific community
  isMemberOf(communityId: string): boolean {
    if (!this.communityMemberships) return false;
    return this.communityMemberships.some(member => member.communityId === communityId);
  }

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @OneToMany(() => Notification, (notification) => notification.recipient)
  notifications: Notification[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && this.password.length < 60) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt, this.password);
  }

  // Generate OTP code and set expiration (10 minutes from now)
  generateOtpCode(): void {
    this.otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    this.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  }

  // Verify OTP code
  verifyOtpCode(code: string): boolean {
    if (!this.otpCode || !this.otpExpires) return false;
    
    const now = new Date();
    return this.otpCode === code && now < this.otpExpires;
  }
}