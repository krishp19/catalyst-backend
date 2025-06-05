import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from './entities/community.entity';
import { CommunityMember, MemberRole } from './entities/community-member.entity';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { User } from '../users/entities/user.entity';
import { ReputationService } from '../reputation/reputation.service';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { CommunityWithJoinedStatus } from './types/community.types';

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectRepository(Community)
    private communitiesRepository: Repository<Community>,
    
    @InjectRepository(CommunityMember)
    private communityMembersRepository: Repository<CommunityMember>,
    
    private reputationService: ReputationService,
  ) {}

  async create(createCommunityDto: CreateCommunityDto, user: User): Promise<Community> {
    // Check if community with same name already exists
    const existingCommunity = await this.communitiesRepository.findOne({
      where: { name: createCommunityDto.name },
    });

    if (existingCommunity) {
      throw new ConflictException('Community with this name already exists');
    }

    // Create the community
    const community = this.communitiesRepository.create({
      ...createCommunityDto,
      creator: user,
      creatorId: user.id,
    });
    
    const savedCommunity = await this.communitiesRepository.save(community);
    
    // Add creator as admin member
    await this.communityMembersRepository.save({
      user,
      userId: user.id,
      community: savedCommunity,
      communityId: savedCommunity.id,
      role: MemberRole.ADMIN,
    });
    
    // Update community member count
    savedCommunity.memberCount = 1;
    await this.communitiesRepository.save(savedCommunity);
    
    // Add reputation for creating a community
    await this.reputationService.addCommunityCreationPoints(user.id);
    
    return savedCommunity;
  }

  async findAllWithJoinedStatus(userId?: string): Promise<CommunityWithJoinedStatus[]> {
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

    // Get all community IDs where the user is a member
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

  async findById(id: string): Promise<Community> {
    const community = await this.communitiesRepository.findOne({
      where: { id },
      relations: ['creator'],
    });
    
    if (!community) {
      throw new NotFoundException(`Community with ID ${id} not found`);
    }
    
    return community;
  }

  async findByName(name: string): Promise<Community> {
    const community = await this.communitiesRepository.findOne({
      where: { name },
      relations: ['creator'],
    });
    
    if (!community) {
      throw new NotFoundException(`Community with name '${name}' not found`);
    }
    
    return community;
  }

  async update(
    id: string,
    updateCommunityDto: UpdateCommunityDto,
    user: User,
  ): Promise<Community> {
    const community = await this.findById(id);
    
    // Check if user is the creator or an admin
    const membership = await this.communityMembersRepository.findOne({
      where: {
        communityId: id,
        userId: user.id,
      },
    });
    
    if (!membership || 
        (membership.role !== MemberRole.ADMIN && community.creatorId !== user.id)) {
      throw new ForbiddenException('You do not have permission to update this community');
    }
    
    // Update community
    Object.assign(community, updateCommunityDto);
    return this.communitiesRepository.save(community);
  }

  async joinCommunity(id: string, user: User) {
    const community = await this.findById(id);
    
    // Check if user is already a member
    const existingMembership = await this.communityMembersRepository.findOne({
      where: {
        communityId: id,
        userId: user.id,
      },
    });
    
    if (existingMembership) {
      throw new ConflictException('You are already a member of this community');
    }
    
    // Add user as member
    await this.communityMembersRepository.save({
      user,
      userId: user.id,
      community,
      communityId: id,
      role: MemberRole.MEMBER,
    });
    
    // Update community member count
    community.memberCount += 1;
    await this.communitiesRepository.save(community);
    
    // Add participation points for joining
    await this.reputationService.addCommunityParticipationPoints(user.id);
    
    return { message: 'Successfully joined the community' };
  }

  async leaveCommunity(id: string, user: User) {
    const community = await this.findById(id);
    
    // Check if user is a member
    const membership = await this.communityMembersRepository.findOne({
      where: {
        communityId: id,
        userId: user.id,
      },
    });
    
    if (!membership) {
      throw new NotFoundException('You are not a member of this community');
    }
    
    // Community creator cannot leave
    if (community.creatorId === user.id) {
      throw new ForbiddenException('As the creator, you cannot leave this community');
    }
    
    // Remove membership
    await this.communityMembersRepository.remove(membership);
    
    // Update community member count
    community.memberCount -= 1;
    await this.communitiesRepository.save(community);
    
    return { message: 'Successfully left the community' };
  }

  async getMembers(communityId: string, page = 1, limit = 10) {
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

  async isMember(communityId: string, userId: string): Promise<boolean> {
    const membership = await this.communityMembersRepository.findOne({
      where: {
        communityId,
        userId,
      },
    });
    
    return !!membership;
  }

  async getMemberRole(communityId: string, userId: string): Promise<MemberRole | null> {
    const membership = await this.communityMembersRepository.findOne({
      where: {
        communityId,
        userId,
      },
    });
    
    return membership ? membership.role : null;
  }

  async getJoinedCommunities(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponseDto<Community>> {
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
}