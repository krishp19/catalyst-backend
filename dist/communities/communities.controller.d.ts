import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { User } from '../users/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Community } from './entities/community.entity';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { CommunityWithJoinedStatus } from './types/community.types';
export declare class CommunitiesController {
    private readonly communitiesService;
    constructor(communitiesService: CommunitiesService);
    create(createCommunityDto: CreateCommunityDto, user: User): Promise<Community>;
    findAllWithJoinedStatus(user: User): Promise<CommunityWithJoinedStatus[]>;
    findAll(paginationDto: PaginationDto): Promise<{
        items: Community[];
        meta: {
            totalItems: number;
            itemCount: number;
            itemsPerPage: number;
            totalPages: number;
            currentPage: number;
        };
    }>;
    findByName(name: string): Promise<Community>;
    update(id: string, updateCommunityDto: UpdateCommunityDto, user: User): Promise<Community>;
    join(id: string, user: User): Promise<{
        message: string;
    }>;
    leave(id: string, user: User): Promise<{
        message: string;
    }>;
    getMembers(id: string, paginationDto: PaginationDto): Promise<{
        items: {
            id: string;
            role: import("./entities/community-member.entity").MemberRole;
            joinedAt: Date;
            user: {
                id: string;
                username: string;
                avatarUrl: string;
                reputationScore: number;
            };
        }[];
        meta: {
            totalItems: number;
            itemCount: number;
            itemsPerPage: number;
            totalPages: number;
            currentPage: number;
        };
    }>;
    getJoinedCommunities(user: User, page?: number, limit?: number): Promise<PaginatedResponseDto<Community>>;
}
