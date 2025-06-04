import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Vote } from '../votes/entities/vote.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../users/entities/user.entity';
import { PostsService } from '../posts/posts.service';
import { CommunitiesService } from '../communities/communities.service';
import { ReputationService } from '../reputation/reputation.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MemberRole } from '../communities/entities/community-member.entity';
import { NotificationType } from 'src/notifications/entities/notification.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
    
    private postsService: PostsService,
    private communitiesService: CommunitiesService,
    private reputationService: ReputationService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User): Promise<Comment> {
    // Get the post
    const post = await this.postsService.findOne(createCommentDto.postId);
    
    // Check if user is a member of the community
    const isMember = await this.communitiesService.isMember(post.communityId, user.id);
    if (!isMember) {
      throw new ForbiddenException('You must be a member of the community to comment');
    }
    
    // If this is a reply, verify parent comment exists and belongs to the same post
    if (createCommentDto.parentId) {
      const parentComment = await this.commentsRepository.findOne({
        where: { id: createCommentDto.parentId },
      });
      
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
      
      if (parentComment.postId !== createCommentDto.postId) {
        throw new BadRequestException('Parent comment does not belong to the specified post');
      }
    }
    
    // Create comment
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      author: user,
      authorId: user.id,
    });
    
    const savedComment = await this.commentsRepository.save(comment);
    
    // Update post comment count
    await this.postsService.updateCommentCount(post.id, true);
    
    // Add reputation for creating a comment
    await this.reputationService.addCommentCreationPoints(user.id);
    
    // Send notification to post author if this is not a self-comment
    if (post.authorId !== user.id) {
      await this.notificationsService.createNotification({
        type: NotificationType.NEW_COMMENT,
        recipientId: post.authorId,
        actorId: user.id,
        postId: post.id,
        commentId: savedComment.id,
      });
    }
    
    // If this is a reply, also notify the parent comment author
    if (createCommentDto.parentId) {
      const parentComment = await this.commentsRepository.findOne({
        where: { id: createCommentDto.parentId },
      });
      
      if (parentComment && parentComment.authorId !== user.id) {
        await this.notificationsService.createNotification({
          type: NotificationType.COMMENT_REPLY,
          recipientId: parentComment.authorId,
          actorId: user.id,
          postId: post.id,
          commentId: savedComment.id,
        });
      }
    }
    
    // Extract @mentions from comment content and send notifications
    const mentions = this.extractMentions(createCommentDto.content);
    if (mentions.length > 0) {
      // Find usernames that match the mentions
      for (const username of mentions) {
        try {
          const mentionedUser = await this.getUserByUsername(username);
          
          // Don't notify yourself
          if (mentionedUser.id !== user.id) {
            await this.notificationsService.createNotification({
              type: NotificationType.MENTION,
              recipientId: mentionedUser.id,
              actorId: user.id,
              postId: post.id,
              commentId: savedComment.id,
            });
          }
        } catch (error) {
          // Username not found, skip notification
        }
      }
    }
    
    return savedComment;
  }

  async findByPost(postId: string, page = 1, limit = 10, parentId?: string) {
    const whereCondition: any = { postId };
    
    // If parentId is null, get top-level comments
    // If parentId is provided, get replies to that comment
    if (parentId) {
      whereCondition.parentId = parentId;
    } else {
      whereCondition.parentId = null; // Only top-level comments
    }
    
    const [comments, total] = await this.commentsRepository.findAndCount({
      where: whereCondition,
      relations: ['author'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        score: 'DESC',
        createdAt: 'ASC',
      },
    });

    // For top-level comments, include a count of replies
    const commentsWithReplyCount = await Promise.all(
      comments.map(async (comment) => {
        let replyCount = 0;
        
        if (!parentId) { // Only count replies for top-level comments
          replyCount = await this.commentsRepository.count({
            where: { parentId: comment.id },
          });
        }
        
        return {
          ...comment,
          replyCount,
        };
      }),
    );

    return {
      items: commentsWithReplyCount,
      meta: {
        totalItems: total,
        itemCount: comments.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async findReplies(commentId: string, page = 1, limit = 10) {
    return this.commentsRepository.findAndCount({
      where: { parentId: commentId },
      relations: ['author'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        score: 'DESC',
        createdAt: 'ASC',
      },
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author', 'post'],
    });
    
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, user: User): Promise<Comment> {
    const comment = await this.findOne(id);
    
    // Verify ownership
    if (comment.authorId !== user.id) {
      const post = await this.postsService.findOne(comment.postId);
      const userRole = await this.communitiesService.getMemberRole(post.communityId, user.id);
      
      if (userRole !== MemberRole.ADMIN && userRole !== MemberRole.MODERATOR) {
        throw new ForbiddenException('You can only edit your own comments');
      }
    }
    
    // Update comment
    Object.assign(comment, updateCommentDto);
    return this.commentsRepository.save(comment);
  }

  async remove(id: string, user: User) {
    const comment = await this.findOne(id);
    
    // Verify ownership or admin/moderator status
    if (comment.authorId !== user.id) {
      const post = await this.postsService.findOne(comment.postId);
      const userRole = await this.communitiesService.getMemberRole(post.communityId, user.id);
      
      if (userRole !== MemberRole.ADMIN && userRole !== MemberRole.MODERATOR) {
        throw new ForbiddenException('You can only delete your own comments');
      }
    }
    
    // Update post comment count (decrease by 1)
    await this.postsService.updateCommentCount(comment.postId, false);
    
    await this.commentsRepository.remove(comment);
    return { message: 'Comment deleted successfully' };
  }

  async vote(id: string, user: User, value: number): Promise<Comment> {
    const comment = await this.findOne(id);
    const post = await this.postsService.findOne(comment.postId);
    
    // Check if user is a member of the community
    const isMember = await this.communitiesService.isMember(post.communityId, user.id);
    if (!isMember) {
      throw new ForbiddenException('You must be a member of the community to vote');
    }
    
    // Check if user is trying to vote on their own comment
    if (comment.authorId === user.id) {
      throw new ForbiddenException('You cannot vote on your own comment');
    }
    
    // Check if user has already voted
    let vote = await this.votesRepository.findOne({
      where: {
        commentId: comment.id,
        userId: user.id,
      },
    });
    
    if (vote) {
      // If same vote value, do nothing
      if (vote.value === value) {
        return comment;
      }
      
      // Update existing vote
      vote.value = value;
    } else {
      // Create new vote
      vote = this.votesRepository.create({
        comment,
        commentId: comment.id,
        user,
        userId: user.id,
        value,
      });
    }
    
    await this.votesRepository.save(vote);
    
    // Update comment score
    await this.updateCommentScore(comment.id);
    
    // Update reputation for comment author
    if (value > 0) {
      await this.reputationService.addCommentUpvotePoints(comment.authorId);
      
      // Send notification for upvote
      await this.notificationsService.createNotification({
        type: NotificationType.COMMENT_UPVOTE,
        recipientId: comment.authorId,
        actorId: user.id,
        postId: post.id,
        commentId: comment.id,
      });
    } else {
      await this.reputationService.addCommentDownvotePoints(comment.authorId);
    }
    
    // Refresh comment data
    return this.findOne(id);
  }

  async removeVote(id: string, user: User): Promise<Comment> {
    const comment = await this.findOne(id);
    
    // Find existing vote
    const vote = await this.votesRepository.findOne({
      where: {
        commentId: comment.id,
        userId: user.id,
      },
    });
    
    if (!vote) {
      return comment; // No vote to remove
    }
    
    // Remove vote
    await this.votesRepository.remove(vote);
    
    // Update comment score
    await this.updateCommentScore(comment.id);
    
    // Update reputation (small negative effect for removing vote)
    if (vote.value > 0) {
      await this.reputationService.removeCommentUpvotePoints(comment.authorId);
    } else {
      await this.reputationService.removeCommentDownvotePoints(comment.authorId);
    }
    
    // Refresh comment data
    return this.findOne(id);
  }

  private async updateCommentScore(commentId: string): Promise<void> {
    // Calculate upvotes and downvotes
    const upvotes = await this.votesRepository.count({
      where: {
        commentId,
        value: 1,
      },
    });
    
    const downvotes = await this.votesRepository.count({
      where: {
        commentId,
        value: -1,
      },
    });
    
    // Update comment with new scores
    await this.commentsRepository.update(commentId, {
      upvotes,
      downvotes,
      score: upvotes - downvotes,
    });
  }

  private extractMentions(content: string): string[] {
    const mentionPattern = /@([a-zA-Z0-9_-]+)/g;
    const matches = content.match(mentionPattern) || [];
    
    // Remove @ symbol and return unique usernames
    return [...new Set(matches.map(match => match.substring(1)))];
  }

  private async getUserByUsername(username: string): Promise<any> {
    const user = await this.commentsRepository.manager
      .getRepository('users')
      .findOne({ where: { username } });
      
    if (!user) {
      throw new NotFoundException(`User @${username} not found`);
    }
    
    return user;
  }
}