import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: User): User;
    update(user: User, updateUserDto: UpdateUserDto): Promise<User>;
    findByUsername(username: string): Promise<User>;
    getReputationBreakdown(userId: string): Promise<{
        totalScore: number;
        breakdown: {
            fromPosts: number;
            fromComments: number;
            fromCommunities: number;
        };
    }>;
    getMyCommunities(user: User): Promise<import("../communities/entities/community.entity").Community[]>;
}
