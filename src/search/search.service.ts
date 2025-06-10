import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, SelectQueryBuilder } from 'typeorm';
import { Community } from '../communities/entities/community.entity';
import { Post } from '../posts/entities/post.entity';
import { SearchRequestDto } from './dto/search-request.dto';
import { SearchResultDto, CommunitySearchResult, PostSearchResult } from './dto/search-response.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async search(dto: SearchRequestDto): Promise<SearchResultDto> {
    const [communities, posts] = await Promise.all([
      this.searchCommunities(dto),
      this.searchPosts(dto),
    ]);

    const result = new SearchResultDto();
    
    if (dto.type === 'all' || dto.type === 'communities') {
      result.communities = communities[0].map(community => CommunitySearchResult.fromEntity(community));
    } else {
      result.communities = [];
    }
    
    if (dto.type === 'all' || dto.type === 'posts') {
      result.posts = posts[0].map(post => PostSearchResult.fromEntity(post));
    } else {
      result.posts = [];
    }

    result.total = (dto.type === 'all' || dto.type === 'communities' ? communities[1] : 0) +
                  (dto.type === 'all' || dto.type === 'posts' ? posts[1] : 0);
    
    result.page = dto.page;
    result.limit = dto.limit;
    result.totalPages = Math.ceil(result.total / dto.limit);

    return result;
  }

  private async searchCommunities(dto: SearchRequestDto): Promise<[Community[], number]> {
    if (dto.type !== 'all' && dto.type !== 'communities') {
      return [[], 0];
    }

    const queryBuilder = this.communityRepository
      .createQueryBuilder('community')
      .leftJoinAndSelect('community.creator', 'creator')
      .where('LOWER(community.name) LIKE LOWER(:query)', { query: `%${dto.query}%` })
      .orWhere('LOWER(community.description) LIKE LOWER(:query)', { query: `%${dto.query}%` });

    this.applySorting(queryBuilder, 'community', dto.sort);
    
    const skip = (dto.page - 1) * dto.limit;
    queryBuilder.skip(skip).take(dto.limit);

    return queryBuilder.getManyAndCount();
  }

  private async searchPosts(dto: SearchRequestDto): Promise<[Post[], number]> {
    if (dto.type !== 'all' && dto.type !== 'posts') {
      return [[], 0];
    }

    // First, get the post IDs that match the search criteria with pagination
    const postIdsQuery = this.postRepository
      .createQueryBuilder('post')
      .select('post.id', 'id')
      .where('LOWER(post.title) LIKE LOWER(:query)', { query: `%${dto.query}%` })
      .orWhere('LOWER(post.content) LIKE LOWER(:query)', { query: `%${dto.query}%` });

    // Apply sorting
    const sortField = dto.sort === 'newest' ? 'post.createdAt' : 'post.score';
    const sortOrder = dto.sort === 'top' ? 'DESC' : 'DESC';
    
    postIdsQuery.orderBy(sortField, sortOrder as 'ASC' | 'DESC');
    
    // Apply pagination
    const skip = (dto.page - 1) * dto.limit;
    postIdsQuery.skip(skip).take(dto.limit);
    
    // Get the paginated post IDs
    const postIds = (await postIdsQuery.getRawMany()).map(item => item.id);
    
    if (postIds.length === 0) {
      return [[], 0];
    }

    // Get the total count for pagination
    const total = await this.postRepository
      .createQueryBuilder('post')
      .where('LOWER(post.title) LIKE LOWER(:query)', { query: `%${dto.query}%` })
      .orWhere('LOWER(post.content) LIKE LOWER(:query)', { query: `%${dto.query}%` })
      .getCount();

    // Get the full post data with relations for the paginated IDs
    const postsQuery = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.community', 'community')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.id IN (:...postIds)', { postIds });

    // Add ORDER BY clause to maintain the same order as the postIds array
    if (postIds.length > 0) {
      const orderByCase = postIds
        .map((id, index) => `WHEN post.id = '${id}' THEN ${index}`)
        .join(' ');
      postsQuery.addOrderBy(`(CASE ${orderByCase} END)`, 'ASC');
    }

    const posts = await postsQuery.getMany();

    // Get comment counts for all posts in one query
    const commentCounts = await this.postRepository
      .createQueryBuilder('post')
      .select('post.id', 'postId')
      .addSelect('COUNT(comment.id)', 'commentCount')
      .leftJoin('post.comments', 'comment')
      .where('post.id IN (:...postIds)', { postIds })
      .groupBy('post.id')
      .getRawMany();
    
    // Create a map of postId to commentCount
    const commentCountMap = new Map(
      commentCounts.map(item => [item.postId, parseInt(item.commentCount, 10)])
    );
    
    // Add commentCount to each post
    posts.forEach(post => {
      (post as any).commentCount = commentCountMap.get(post.id) || 0;
    });

    return [posts, total];
  }

  private applySorting(
    queryBuilder: SelectQueryBuilder<any>,
    alias: string,
    sort: 'relevance' | 'newest' | 'top',
  ): void {
    switch (sort) {
      case 'newest':
        queryBuilder.orderBy(`${alias}.createdAt`, 'DESC');
        break;
      case 'top':
        queryBuilder.orderBy(`${alias}.score`, 'DESC');
        break;
      case 'relevance':
      default:
        // For text search, we could use full-text search if available
        // For now, we'll just sort by creation date
        queryBuilder.orderBy(`${alias}.createdAt`, 'DESC');
        break;
    }
  }
}
