import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { User } from '../users/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class CommunitiesController {
    private readonly communitiesService;
    constructor(communitiesService: CommunitiesService);
    create(createCommunityDto: CreateCommunityDto, user: User): Promise<import("./entities/community.entity").Community>;
    findAll(paginationDto: PaginationDto): Promise<{
        items: import("./entities/community.entity").Community[];
        meta: {
            totalItems: number;
            itemCount: number;
            itemsPerPage: number;
            totalPages: number;
            currentPage: number;
        };
    }>;
    findByName(name: string): Promise<import("./entities/community.entity").Community>;
    update(id: string, updateCommunityDto: UpdateCommunityDto, user: User): Promise<import("./entities/community.entity").Community>;
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
}
