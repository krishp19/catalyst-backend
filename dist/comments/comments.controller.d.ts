import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../users/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(createCommentDto: CreateCommentDto, user: User): Promise<import("./entities/comment.entity").Comment>;
    findByPost(postId: string, paginationDto: PaginationDto, parentId?: string): Promise<{
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
            parent: import("./entities/comment.entity").Comment;
            parentId: string;
            replies: import("./entities/comment.entity").Comment[];
            votes: import("../votes/entities/vote.entity").Vote[];
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
    findReplies(id: string, paginationDto: PaginationDto): Promise<[import("./entities/comment.entity").Comment[], number]>;
    update(id: string, updateCommentDto: UpdateCommentDto, user: User): Promise<import("./entities/comment.entity").Comment>;
    remove(id: string, user: User): Promise<{
        message: string;
    }>;
    upvote(id: string, user: User): Promise<import("./entities/comment.entity").Comment>;
    downvote(id: string, user: User): Promise<import("./entities/comment.entity").Comment>;
    removeVote(id: string, user: User): Promise<import("./entities/comment.entity").Comment>;
}
