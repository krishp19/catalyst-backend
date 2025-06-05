import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostType } from './entities/post.entity';
import { Vote } from '../votes/entities/vote.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';
import { CommunitiesService } from '../communities/communities.service';
import { ReputationService } from '../reputation/reputation.service';
import { MemberRole } from '../communities/entities/community-member.entity';
import { NotificationType } from '../notifications/entities/notification.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
    
    private communitiesService: CommunitiesService,
    @Inject(forwardRef(() => ReputationService))
    private reputationService: ReputationService,
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,
  ) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    // Validate community exists and user is a member
    const isMember = await this.communitiesService.isMember(
      createPostDto.communityId,
      user.id,
    );
    
    if (!isMember) {
      throw new ForbiddenException('You must be a member of the community to post');
    }
    
    // Validate post data based on type
    this.validatePostData(createPostDto);
    
    // Create post
    const post = this.postsRepository.create({
      ...createPostDto,
      author: user,
      authorId: user.id,
    });
    
    const savedPost = await this.postsRepository.save(post);
    
    // Add reputation for creating a post
    await this.reputationService.addPostCreationPoints(user.id);
    
    return savedPost;
  }

  async findAll(page = 1, limit = 10, sort = 'hot', communityId?: string) {
    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.community', 'community')
      .skip((page - 1) * limit)
      .take(limit);
    
    // Filter by community if provided
    if (communityId) {
      queryBuilder.where('post.communityId = :communityId', { communityId });
    }
    
    // Apply sorting
    switch (sort) {
      case 'new':
        queryBuilder.orderBy('post.createdAt', 'DESC');
        break;
      case 'top':
        queryBuilder.orderBy('post.score', 'DESC');
        break;
      case 'hot': // Default - combination of score and recency
        queryBuilder
          .orderBy('post.score', 'DESC')
          .addOrderBy('post.commentCount', 'DESC')
          .addOrderBy('post.createdAt', 'DESC');
        break;
      default:
        queryBuilder.orderBy('post.createdAt', 'DESC');
    }
    
    // Always show pinned posts first
    queryBuilder.addOrderBy('post.isPinned', 'DESC');
    
    try {
      const [posts, total] = await queryBuilder.getManyAndCount();

      return {
        items: posts,
        meta: {
          totalItems: total,
          itemCount: posts.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        },
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new BadRequestException('Failed to fetch posts');
    }
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'community'],
    });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, user: User): Promise<Post> {
    const post = await this.findOne(id);
    
    // Verify ownership
    if (post.authorId !== user.id) {
      const userRole = await this.communitiesService.getMemberRole(post.communityId, user.id);
      if (userRole !== MemberRole.ADMIN && userRole !== MemberRole.MODERATOR) {
        throw new ForbiddenException('You can only edit your own posts');
      }
    }
    
    // Update post
    Object.assign(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  async remove(id: string, user: User) {
    const post = await this.findOne(id);
    
    // Verify ownership or admin/moderator status
    if (post.authorId !== user.id) {
      const userRole = await this.communitiesService.getMemberRole(post.communityId, user.id);
      if (userRole !== MemberRole.ADMIN && userRole !== MemberRole.MODERATOR) {
        throw new ForbiddenException('You can only delete your own posts');
      }
    }
    
    await this.postsRepository.remove(post);
    return { message: 'Post deleted successfully' };
  }

  async vote(id: string, user: User, value: number): Promise<Post> {
    const post = await this.findOne(id);
    
    // Check if user is a member of the community
    const isMember = await this.communitiesService.isMember(post.communityId, user.id);
    if (!isMember) {
      throw new ForbiddenException('You must be a member of the community to vote');
    }
    
    // Check if user is trying to vote on their own post
    if (post.authorId === user.id) {
      throw new ForbiddenException('You cannot vote on your own post');
    }
    
    // Check if user has already voted
    let vote = await this.votesRepository.findOne({
      where: {
        postId: post.id,
        userId: user.id,
      },
    });
    
    if (vote) {
      // If same vote value, do nothing
      if (vote.value === value) {
        return post;
      }
      
      // Update existing vote
      vote.value = value;
    } else {
      // Create new vote
      vote = this.votesRepository.create({
        post,
        postId: post.id,
        user,
        userId: user.id,
        value,
      });
    }
    
    await this.votesRepository.save(vote);
    
    // Update post score
    await this.updatePostScore(post.id);
    
    // Update reputation for post author
    if (value > 0) {
      await this.reputationService.addPostUpvotePoints(post.authorId);
      
      // Send notification for upvote
      await this.notificationsService.createNotification({
        type: NotificationType.POST_UPVOTE,
        recipientId: post.authorId,
        actorId: user.id,
        postId: post.id,
      });
    } else {
      await this.reputationService.addPostDownvotePoints(post.authorId);
    }
    
    // Refresh post data
    return this.findOne(id);
  }

  async removeVote(id: string, user: User): Promise<Post> {
    const post = await this.findOne(id);
    
    // Find existing vote
    const vote = await this.votesRepository.findOne({
      where: {
        postId: post.id,
        userId: user.id,
      },
    });
    
    if (!vote) {
      return post; // No vote to remove
    }
    
    // Remove vote
    await this.votesRepository.remove(vote);
    
    // Update post score
    await this.updatePostScore(post.id);
    
    // Update reputation (small negative effect for removing vote)
    if (vote.value > 0) {
      await this.reputationService.removePostUpvotePoints(post.authorId);
    } else {
      await this.reputationService.removePostDownvotePoints(post.authorId);
    }
    
    // Refresh post data
    return this.findOne(id);
  }

  async pinPost(id: string, user: User): Promise<Post> {
    const post = await this.findOne(id);
    
    // Check if user has permission to pin
    const userRole = await this.communitiesService.getMemberRole(post.communityId, user.id);
    const canPin = userRole === MemberRole.ADMIN || userRole === MemberRole.MODERATOR;
    
    // Regular users with high reputation can pin one post per week
    const isHighRepUser = user.reputationScore >= 1000;
    
    if (!canPin && !isHighRepUser) {
      throw new ForbiddenException('You do not have permission to pin posts');
    }
    
    // If high rep user but not mod/admin, check if they've pinned a post in the last week
    if (!canPin && isHighRepUser) {
      // Find if user has pinned any posts in the last week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const recentPinnedPosts = await this.postsRepository.count({
        where: {
          authorId: user.id,
          isPinned: true,
          updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      });
      
      if (recentPinnedPosts > 0) {
        throw new ForbiddenException('You can only pin one post per week');
      }
      
      // High rep users can only pin their own posts
      if (post.authorId !== user.id) {
        throw new ForbiddenException('You can only pin your own posts');
      }
    }
    
    // Pin the post
    post.isPinned = true;
    return this.postsRepository.save(post);
  }

  async unpinPost(id: string, user: User): Promise<Post> {
    const post = await this.findOne(id);
    
    // Check if user has permission to unpin
    const userRole = await this.communitiesService.getMemberRole(post.communityId, user.id);
    const canUnpin = userRole === MemberRole.ADMIN || userRole === MemberRole.MODERATOR;
    
    // Users can always unpin their own posts
    if (!canUnpin && post.authorId !== user.id) {
      throw new ForbiddenException('You do not have permission to unpin this post');
    }
    
    // Unpin the post
    post.isPinned = false;
    return this.postsRepository.save(post);
  }

  async updateCommentCount(postId: string, increment = true): Promise<void> {
    const post = await this.findOne(postId);
    
    if (increment) {
      post.commentCount += 1;
    } else {
      post.commentCount = Math.max(0, post.commentCount - 1);
    }
    
    await this.postsRepository.save(post);
  }

  private async updatePostScore(postId: string): Promise<void> {
    // Calculate upvotes and downvotes
    const upvotes = await this.votesRepository.count({
      where: {
        postId,
        value: 1,
      },
    });
    
    const downvotes = await this.votesRepository.count({
      where: {
        postId,
        value: -1,
      },
    });
    
    // Update post with new scores
    await this.postsRepository.update(postId, {
      upvotes,
      downvotes,
      score: upvotes - downvotes,
    });
  }

  private validatePostData(createPostDto: CreatePostDto): void {
    switch (createPostDto.type) {
      case PostType.TEXT:
        if (!createPostDto.content) {
          throw new BadRequestException('Content is required for text posts');
        }
        break;
      case PostType.IMAGE:
        if (!createPostDto.imageUrl) {
          throw new BadRequestException('Image URL is required for image posts');
        }
        break;
      case PostType.LINK:
        if (!createPostDto.linkUrl) {
          throw new BadRequestException('Link URL is required for link posts');
        }
        break;
    }
  }
}