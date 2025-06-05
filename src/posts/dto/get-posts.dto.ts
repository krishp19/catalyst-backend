import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PostType } from '../entities/post.entity';

export enum PostSort {
  HOT = 'hot',
  NEW = 'new',
  TOP = 'top',
}

export class GetPostsDto {
  @ApiProperty({
    description: 'ID of the community to filter posts',
    required: false,
  })
  @IsOptional()
  @IsString()
  communityId?: string;

  @ApiProperty({
    description: 'Sort order for posts',
    enum: PostSort,
    default: PostSort.HOT,
    required: false,
  })
  @IsOptional()
  @IsEnum(PostSort)
  sort?: PostSort = PostSort.HOT;
} 