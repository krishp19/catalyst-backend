import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Community } from '../../communities/entities/community.entity';
import { Post } from '../../posts/entities/post.entity';

export class SearchResultDto {
  @ApiProperty({
    description: 'List of matching communities',
    type: () => [CommunitySearchResult],
    example: [{
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'programming',
      description: 'A community for programming discussions',
      memberCount: 1000,
      createdAt: '2023-01-01T00:00:00.000Z'
    }]
  })
  @Expose()
  communities: CommunitySearchResult[];

  @ApiProperty({
    description: 'List of matching posts',
    type: () => [PostSearchResult],
    example: [{
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'Introduction to Programming',
      content: 'This is a post about programming...',
      score: 42,
      commentCount: 5,
      community: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'programming'
      },
      author: {
        id: '550e8400-e29b-41d4-a716-446655440002',
        username: 'devuser'
      },
      createdAt: '2023-01-02T00:00:00.000Z'
    }]
  })
  @Expose()
  posts: PostSearchResult[];

  @ApiProperty({
    description: 'Total number of results across all pages',
    example: 1
  })
  @Expose()
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  @Expose()
  page: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 1
  })
  @Expose()
  totalPages: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10
  })
  @Expose()
  limit: number;
}

export class CommunitySearchResult {
  @ApiProperty({
    description: 'Unique identifier for the community',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name of the community',
    example: 'programming'
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Description of the community',
    example: 'A community for programming discussions'
  })
  @Expose()
  description: string;

  @ApiPropertyOptional({
    description: 'URL of the community icon',
    example: 'https://example.com/icon.jpg'
  })
  @Expose()
  iconUrl?: string;

  @ApiProperty({
    description: 'Number of members in the community',
    example: 1000
  })
  @Expose()
  memberCount: number;

  @ApiProperty({
    description: 'Date when the community was created',
    type: 'string',
    format: 'date-time',
    example: '2023-01-01T00:00:00.000Z'
  })
  @Expose()
  createdAt: Date;

  static fromEntity(community: Community): CommunitySearchResult {
    const result = new CommunitySearchResult();
    result.id = community.id;
    result.name = community.name;
    result.description = community.description;
    result.iconUrl = community.iconUrl;
    result.memberCount = community.memberCount;
    result.createdAt = community['createdAt'] || new Date();
    return result;
  }
}

export class PostSearchResult {
  @ApiProperty({
    description: 'Unique identifier for the post',
    example: '550e8400-e29b-41d4-a716-446655440001'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Title of the post',
    example: 'Introduction to Programming'
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Content of the post (truncated if too long)',
    example: 'This is a post about programming...'
  })
  @Expose()
  content: string;

  @ApiPropertyOptional({
    description: 'URL of the post image if available',
    example: 'https://example.com/image.jpg'
  })
  @Expose()
  imageUrl?: string;

  @ApiProperty({
    description: 'Post score (upvotes - downvotes)',
    example: 42
  })
  @Expose()
  score: number;

  @ApiProperty({
    description: 'Number of comments on the post',
    example: 5
  })
  @Expose()
  commentCount: number;

  @ApiProperty({
    description: 'Community information',
    type: () => ({
      id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
      name: { type: 'string', example: 'programming' }
    })
  })
  @Expose()
  community: {
    id: string;
    name: string;
  };

  @ApiProperty({
    description: 'Author information',
    type: () => ({
      id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440002' },
      username: { type: 'string', example: 'devuser' }
    })
  })
  @Expose()
  author: {
    id: string;
    username: string;
  };

  @ApiProperty({
    description: 'Date when the post was created',
    type: 'string',
    format: 'date-time',
    example: '2023-01-02T00:00:00.000Z'
  })
  @Expose()
  createdAt: Date;

  static fromEntity(post: Post): PostSearchResult {
    const result = new PostSearchResult();
    result.id = post.id;
    result.title = post.title;
    result.content = post.content?.substring(0, 200) + (post.content?.length > 200 ? '...' : '');
    result.imageUrl = post.imageUrl;
    result.score = post.score;
    result.commentCount = post['commentCount'] || 0;
    result.community = post.community ? {
      id: post.community.id,
      name: post.community.name
    } : { id: '', name: 'Unknown' };
    result.author = post.author ? {
      id: post.author.id,
      username: post.author['username'] || 'Anonymous'
    } : { id: '', username: 'Anonymous' };
    result.createdAt = post['createdAt'] || new Date();
    return result;
  }
}
