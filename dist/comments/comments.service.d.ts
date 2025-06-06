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
export declare class CommentsService {
    private commentsRepository;
    private votesRepository;
    private postsService;
    private communitiesService;
    private reputationService;
    private notificationsService;
    constructor(commentsRepository: Repository<Comment>, votesRepository: Repository<Vote>, postsService: PostsService, communitiesService: CommunitiesService, reputationService: ReputationService, notificationsService: NotificationsService);
    create(createCommentDto: CreateCommentDto, user: User): Promise<Comment>;
    findByPost(postId: string, page?: number, limit?: number, parentId?: string): Promise<{
        items: {
            replyCount: number;
            id: string;
            content: string;
            score: number;
            upvotes: number;
            downvotes: number;
            author: User;
            authorId: string;
            post: import("../posts/entities/post.entity").Post;
            postId: string;
            parent: Comment;
            parentId: string;
            replies: Comment[];
            votes: Vote[];
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            totalItems: number;
            itemCount: number;
            itemsPerPage: number;
            totalPages: number;
            currentPage: number;
        };
    }>;
    findReplies(commentId: string, page?: number, limit?: number): Promise<[Comment[], number]>;
    findOne(id: string): Promise<Comment>;
    update(id: string, updateCommentDto: UpdateCommentDto, user: User): Promise<Comment>;
    remove(id: string, user: User): Promise<{
        message: string;
    }>;
    vote(id: string, user: User, value: number): Promise<Comment>;
    removeVote(id: string, user: User): Promise<Comment>;
    private updateCommentScore;
    private extractMentions;
    private getUserByUsername;
}
