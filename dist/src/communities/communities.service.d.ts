import { Repository } from 'typeorm';
import { Community } from './entities/community.entity';
import { CommunityMember, MemberRole } from './entities/community-member.entity';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { User } from '../users/entities/user.entity';
import { ReputationService } from '../reputation/reputation.service';
export declare class CommunitiesService {
    private communitiesRepository;
    private communityMembersRepository;
    private reputationService;
    constructor(communitiesRepository: Repository<Community>, communityMembersRepository: Repository<CommunityMember>, reputationService: ReputationService);
    create(createCommunityDto: CreateCommunityDto, user: User): Promise<Community>;
    findAll(page?: number, limit?: number): Promise<{
        items: Community[];
        meta: {
            totalItems: number;
            itemCount: number;
            itemsPerPage: number;
            totalPages: number;
            currentPage: number;
        };
    }>;
    findById(id: string): Promise<Community>;
    findByName(name: string): Promise<Community>;
    update(id: string, updateCommunityDto: UpdateCommunityDto, user: User): Promise<Community>;
    joinCommunity(id: string, user: User): Promise<{
        message: string;
    }>;
    leaveCommunity(id: string, user: User): Promise<{
        message: string;
    }>;
    getMembers(communityId: string, page?: number, limit?: number): Promise<{
        items: {
            id: string;
            role: MemberRole;
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
    isMember(communityId: string, userId: string): Promise<boolean>;
    getMemberRole(communityId: string, userId: string): Promise<MemberRole | null>;
}
