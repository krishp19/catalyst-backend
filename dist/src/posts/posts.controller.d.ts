import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, user: User): Promise<import("./entities/post.entity").Post>;
    findAll(paginationDto: PaginationDto, sort?: string, communityId?: string): Promise<{
        items: import("./entities/post.entity").Post[];
        meta: {
            totalItems: number;
            itemCount: number;
            itemsPerPage: number;
            totalPages: number;
            currentPage: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/post.entity").Post>;
    update(id: string, updatePostDto: UpdatePostDto, user: User): Promise<import("./entities/post.entity").Post>;
    remove(id: string, user: User): Promise<{
        message: string;
    }>;
    upvote(id: string, user: User): Promise<import("./entities/post.entity").Post>;
    downvote(id: string, user: User): Promise<import("./entities/post.entity").Post>;
    removeVote(id: string, user: User): Promise<import("./entities/post.entity").Post>;
    pinPost(id: string, user: User): Promise<import("./entities/post.entity").Post>;
    unpinPost(id: string, user: User): Promise<import("./entities/post.entity").Post>;
}
