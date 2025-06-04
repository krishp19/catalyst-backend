import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Vote } from '../votes/entities/vote.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';
import { CommunitiesService } from '../communities/communities.service';
import { ReputationService } from '../reputation/reputation.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class PostsService {
    private postsRepository;
    private votesRepository;
    private communitiesService;
    private reputationService;
    private notificationsService;
    constructor(postsRepository: Repository<Post>, votesRepository: Repository<Vote>, communitiesService: CommunitiesService, reputationService: ReputationService, notificationsService: NotificationsService);
    create(createPostDto: CreatePostDto, user: User): Promise<Post>;
    findAll(page?: number, limit?: number, sort?: string, communityId?: string): Promise<{
        items: Post[];
        meta: {
            totalItems: number;
            itemCount: number;
            itemsPerPage: number;
            totalPages: number;
            currentPage: number;
        };
    }>;
    findOne(id: string): Promise<Post>;
    update(id: string, updatePostDto: UpdatePostDto, user: User): Promise<Post>;
    remove(id: string, user: User): Promise<{
        message: string;
    }>;
    vote(id: string, user: User, value: number): Promise<Post>;
    removeVote(id: string, user: User): Promise<Post>;
    pinPost(id: string, user: User): Promise<Post>;
    unpinPost(id: string, user: User): Promise<Post>;
    updateCommentCount(postId: string, increment?: boolean): Promise<void>;
    private updatePostScore;
    private validatePostData;
}
