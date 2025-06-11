import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';

export class UserProfileDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ description: 'Email address', required: false })
  email?: string;

  @ApiProperty({ description: 'User bio', required: false })
  bio?: string;

  @ApiProperty({ description: 'URL to user\'s avatar', required: false })
  avatarUrl?: string;

  @ApiProperty({ description: 'User\'s reputation score' })
  reputationScore: number;

  @ApiProperty({ description: 'User\'s post score' })
  postScore: number;

  @ApiProperty({ description: 'User\'s comment score' })
  commentScore: number;

  @ApiProperty({ description: 'User\'s community score' })
  communityScore: number;

  @ApiProperty({ description: 'Date when the user joined' })
  createdAt: Date;

  @ApiProperty({ description: 'Date when the user was last updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'User\'s posts', type: [Post], required: false })
  posts?: Post[];

  @ApiProperty({ description: 'User\'s comments', type: [Comment], required: false })
  comments?: Comment[];

  @ApiProperty({ description: 'Posts and comments upvoted by the user', type: [Object], required: false })
  upvoted?: Array<Post | Comment>;

  @ApiProperty({ description: 'Posts and comments downvoted by the user', type: [Object], required: false })
  downvoted?: Array<Post | Comment>;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.bio = user.bio;
    this.avatarUrl = user.avatarUrl;
    this.reputationScore = user.reputationScore;
    this.postScore = user.postScore;
    this.commentScore = user.commentScore;
    this.communityScore = user.communityScore;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
