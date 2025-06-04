import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
  NEW_COMMENT = 'new_comment',
  COMMENT_REPLY = 'comment_reply',
  POST_UPVOTE = 'post_upvote',
  COMMENT_UPVOTE = 'comment_upvote',
  MENTION = 'mention',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ default: false })
  read: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  @Column()
  recipientId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'actorId' })
  actor: User;

  @Column()
  actorId: string;

  @Column({ nullable: true })
  postId: string;

  @Column({ nullable: true })
  commentId: string;

  @CreateDateColumn()
  createdAt: Date;
}