import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
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
    findByEmail(email: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    getReputationBreakdown(userId: string): Promise<{
        totalScore: number;
        breakdown: {
            fromPosts: number;
            fromComments: number;
            fromCommunities: number;
        };
    }>;
}
