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
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('votes')
@Unique(['userId', 'postId'])
@Unique(['userId', 'commentId'])
export class Vote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: number; // 1 for upvote, -1 for downvote

  @ManyToOne(() => User, (user) => user.votes)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Post, (post) => post.votes, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @Column({ nullable: true })
  postId: string;

  @ManyToOne(() => Comment, (comment) => comment.votes, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commentId' })
  comment: Comment;

  @Column({ nullable: true })
  commentId: string;

  @CreateDateColumn()
  createdAt: Date;
}