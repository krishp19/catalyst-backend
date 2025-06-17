import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Community } from 'src/communities/entities/community.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Vote } from 'src/votes/entities/vote.entity';
import { UserProfileDto } from './dto/user-profile.dto';
export declare class UsersService {
    private usersRepository;
    private postsRepository;
    private commentsRepository;
    private votesRepository;
    constructor(usersRepository: Repository<User>, postsRepository: Repository<Post>, commentsRepository: Repository<Comment>, votesRepository: Repository<Vote>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(page?: number, limit?: number): Promise<{
        items: User[];
        meta: {
            totalItems: number;
            itemCount: number;
            itemsPerPage: number;
            totalPages: number;
            currentPage: number;
        };
    }>;
    findById(id: string): Promise<User>;
    findByUsername(username: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    getEnhancedProfile(username: string, includeContent?: boolean): Promise<UserProfileDto>;
    getReputationBreakdown(userId: string): Promise<{
        totalScore: number;
        breakdown: {
            fromPosts: number;
            fromComments: number;
            fromCommunities: number;
        };
    }>;
    getJoinedCommunities(userId: string): Promise<Community[]>;
}
