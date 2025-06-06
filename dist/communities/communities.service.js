"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunitiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const community_entity_1 = require("./entities/community.entity");
const community_member_entity_1 = require("./entities/community-member.entity");
const reputation_service_1 = require("../reputation/reputation.service");
let CommunitiesService = class CommunitiesService {
    constructor(communitiesRepository, communityMembersRepository, reputationService) {
        this.communitiesRepository = communitiesRepository;
        this.communityMembersRepository = communityMembersRepository;
        this.reputationService = reputationService;
    }
    async create(createCommunityDto, user) {
        const existingCommunity = await this.communitiesRepository.findOne({
            where: { name: createCommunityDto.name },
        });
        if (existingCommunity) {
            throw new common_1.ConflictException('Community with this name already exists');
        }
        const community = this.communitiesRepository.create({
            ...createCommunityDto,
            creator: user,
            creatorId: user.id,
        });
        const savedCommunity = await this.communitiesRepository.save(community);
        await this.communityMembersRepository.save({
            user,
            userId: user.id,
            community: savedCommunity,
            communityId: savedCommunity.id,
            role: community_member_entity_1.MemberRole.ADMIN,
        });
        savedCommunity.memberCount = 1;
        await this.communitiesRepository.save(savedCommunity);
        await this.reputationService.addCommunityCreationPoints(user.id);
        return savedCommunity;
    }
    async findAllWithJoinedStatus(userId) {
        const communities = await this.communitiesRepository.find({
            relations: ['creator'],
            order: { memberCount: 'DESC' },
        });
        if (!userId) {
            return communities.map(community => ({
                ...community,
                isJoined: false,
            }));
        }
        const userMemberships = await this.communityMembersRepository.find({
            where: { userId },
            select: ['communityId'],
        });
        const joinedCommunityIds = new Set(userMemberships.map(m => m.communityId));
        return communities.map(community => ({
            ...community,
            isJoined: joinedCommunityIds.has(community.id),
        }));
    }
    async findAll(page = 1, limit = 10) {
        const [communities, total] = await this.communitiesRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { memberCount: 'DESC' },
        });
        return {
            items: communities,
            meta: {
                totalItems: total,
                itemCount: communities.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            },
        };
    }
    async findById(id) {
        const community = await this.communitiesRepository.findOne({
            where: { id },
            relations: ['creator'],
        });
        if (!community) {
            throw new common_1.NotFoundException(`Community with ID ${id} not found`);
        }
        return community;
    }
    async findByName(name) {
        const community = await this.communitiesRepository.findOne({
            where: { name },
            relations: ['creator'],
        });
        if (!community) {
            throw new common_1.NotFoundException(`Community with name '${name}' not found`);
        }
        return community;
    }
    async update(id, updateCommunityDto, user) {
        const community = await this.findById(id);
        const membership = await this.communityMembersRepository.findOne({
            where: {
                communityId: id,
                userId: user.id,
            },
        });
        if (!membership ||
            (membership.role !== community_member_entity_1.MemberRole.ADMIN && community.creatorId !== user.id)) {
            throw new common_1.ForbiddenException('You do not have permission to update this community');
        }
        Object.assign(community, updateCommunityDto);
        return this.communitiesRepository.save(community);
    }
    async joinCommunity(id, user) {
        const community = await this.findById(id);
        const existingMembership = await this.communityMembersRepository.findOne({
            where: {
                communityId: id,
                userId: user.id,
            },
        });
        if (existingMembership) {
            throw new common_1.ConflictException('You are already a member of this community');
        }
        await this.communityMembersRepository.save({
            user,
            userId: user.id,
            community,
            communityId: id,
            role: community_member_entity_1.MemberRole.MEMBER,
        });
        community.memberCount += 1;
        await this.communitiesRepository.save(community);
        await this.reputationService.addCommunityParticipationPoints(user.id);
        return { message: 'Successfully joined the community' };
    }
    async leaveCommunity(id, user) {
        const community = await this.findById(id);
        const membership = await this.communityMembersRepository.findOne({
            where: {
                communityId: id,
                userId: user.id,
            },
        });
        if (!membership) {
            throw new common_1.NotFoundException('You are not a member of this community');
        }
        if (community.creatorId === user.id) {
            throw new common_1.ForbiddenException('As the creator, you cannot leave this community');
        }
        await this.communityMembersRepository.remove(membership);
        community.memberCount -= 1;
        await this.communitiesRepository.save(community);
        return { message: 'Successfully left the community' };
    }
    async getMembers(communityId, page = 1, limit = 10) {
        const community = await this.findById(communityId);
        const [members, total] = await this.communityMembersRepository.findAndCount({
            where: { communityId },
            relations: ['user'],
            skip: (page - 1) * limit,
            take: limit,
            order: { joinedAt: 'DESC' },
        });
        return {
            items: members.map(member => ({
                id: member.id,
                role: member.role,
                joinedAt: member.joinedAt,
                user: {
                    id: member.user.id,
                    username: member.user.username,
                    avatarUrl: member.user.avatarUrl,
                    reputationScore: member.user.reputationScore,
                },
            })),
            meta: {
                totalItems: total,
                itemCount: members.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            },
        };
    }
    async isMember(communityId, userId) {
        const membership = await this.communityMembersRepository.findOne({
            where: {
                communityId,
                userId,
            },
        });
        return !!membership;
    }
    async getUserCommunities(userId) {
        return this.communityMembersRepository.find({
            where: { userId },
            relations: ['community'],
            select: ['communityId', 'role', 'joinedAt']
        });
    }
    async getMemberRole(communityId, userId) {
        const membership = await this.communityMembersRepository.findOne({
            where: {
                communityId,
                userId,
            },
        });
        return membership ? membership.role : null;
    }
    async getJoinedCommunities(userId, page = 1, limit = 10) {
        const [communities, total] = await this.communitiesRepository
            .createQueryBuilder('community')
            .innerJoin('community.members', 'member', 'member.userId = :userId', { userId })
            .leftJoinAndSelect('community.members', 'members')
            .select([
            'community',
            'COUNT(members.id) as memberCount',
        ])
            .groupBy('community.id')
            .orderBy('community.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        return {
            items: communities,
            meta: {
                totalItems: total,
                itemCount: communities.length,
                itemsPerPage: limit,
                totalPages,
                currentPage: page,
            },
        };
    }
};
exports.CommunitiesService = CommunitiesService;
exports.CommunitiesService = CommunitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(community_entity_1.Community)),
    __param(1, (0, typeorm_1.InjectRepository)(community_member_entity_1.CommunityMember)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        reputation_service_1.ReputationService])
], CommunitiesService);
//# sourceMappingURL=communities.service.js.map