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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_entity_1 = require("./entities/post.entity");
const vote_entity_1 = require("../votes/entities/vote.entity");
const communities_service_1 = require("../communities/communities.service");
const reputation_service_1 = require("../reputation/reputation.service");
const community_member_entity_1 = require("../communities/entities/community-member.entity");
const notification_entity_1 = require("../notifications/entities/notification.entity");
const notifications_service_1 = require("../notifications/notifications.service");
let PostsService = class PostsService {
    constructor(postsRepository, votesRepository, communitiesService, reputationService, notificationsService) {
        this.postsRepository = postsRepository;
        this.votesRepository = votesRepository;
        this.communitiesService = communitiesService;
        this.reputationService = reputationService;
        this.notificationsService = notificationsService;
    }
    async create(createPostDto, user) {
        const isMember = await this.communitiesService.isMember(createPostDto.communityId, user.id);
        if (!isMember) {
            throw new common_1.ForbiddenException('You must be a member of the community to post');
        }
        this.validatePostData(createPostDto);
        const post = this.postsRepository.create({
            ...createPostDto,
            author: user,
            authorId: user.id,
        });
        const savedPost = await this.postsRepository.save(post);
        await this.reputationService.addPostCreationPoints(user.id);
        return savedPost;
    }
    async findPostsFromJoinedCommunities(userId, page = 1, limit = 10, sort = 'hot') {
        const userCommunities = await this.communitiesService.getUserCommunities(userId);
        if (userCommunities.length === 0) {
            return {
                items: [],
                meta: {
                    totalItems: 0,
                    itemCount: 0,
                    itemsPerPage: limit,
                    totalPages: 0,
                    currentPage: page,
                },
            };
        }
        const communityIds = userCommunities.map(comm => comm.communityId);
        const queryBuilder = this.postsRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.community', 'community')
            .where('post.communityId IN (:...communityIds)', { communityIds })
            .skip((page - 1) * limit)
            .take(limit);
        switch (sort) {
            case 'new':
                queryBuilder.orderBy('post.createdAt', 'DESC');
                break;
            case 'top':
                queryBuilder.orderBy('post.score', 'DESC');
                break;
            case 'hot':
                queryBuilder
                    .orderBy('post.score', 'DESC')
                    .addOrderBy('post.commentCount', 'DESC')
                    .addOrderBy('post.createdAt', 'DESC');
                break;
            default:
                queryBuilder.orderBy('post.createdAt', 'DESC');
        }
        queryBuilder.addOrderBy('post.isPinned', 'DESC');
        const [items, totalItems] = await queryBuilder.getManyAndCount();
        return {
            items,
            meta: {
                totalItems,
                itemCount: items.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
            },
        };
    }
    async findAll(page = 1, limit = 10, sort = 'hot', communityId) {
        const queryBuilder = this.postsRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.community', 'community')
            .skip((page - 1) * limit)
            .take(limit);
        if (communityId) {
            queryBuilder.where('post.communityId = :communityId', { communityId });
        }
        switch (sort) {
            case 'new':
                queryBuilder.orderBy('post.createdAt', 'DESC');
                break;
            case 'top':
                queryBuilder.orderBy('post.score', 'DESC');
                break;
            case 'hot':
                queryBuilder
                    .orderBy('post.score', 'DESC')
                    .addOrderBy('post.commentCount', 'DESC')
                    .addOrderBy('post.createdAt', 'DESC');
                break;
            default:
                queryBuilder.orderBy('post.createdAt', 'DESC');
        }
        queryBuilder.addOrderBy('post.isPinned', 'DESC');
        try {
            const [posts, total] = await queryBuilder.getManyAndCount();
            return {
                items: posts,
                meta: {
                    totalItems: total,
                    itemCount: posts.length,
                    itemsPerPage: limit,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                },
            };
        }
        catch (error) {
            console.error('Error fetching posts:', error);
            throw new common_1.BadRequestException('Failed to fetch posts');
        }
    }
    async findOne(id) {
        const post = await this.postsRepository.findOne({
            where: { id },
            relations: ['author', 'community'],
        });
        if (!post) {
            throw new common_1.NotFoundException(`Post with ID ${id} not found`);
        }
        return post;
    }
    async update(id, updatePostDto, user) {
        const post = await this.findOne(id);
        if (post.authorId !== user.id) {
            const userRole = await this.communitiesService.getMemberRole(post.communityId, user.id);
            if (userRole !== community_member_entity_1.MemberRole.ADMIN && userRole !== community_member_entity_1.MemberRole.MODERATOR) {
                throw new common_1.ForbiddenException('You can only edit your own posts');
            }
        }
        Object.assign(post, updatePostDto);
        return this.postsRepository.save(post);
    }
    async remove(id, user) {
        const post = await this.findOne(id);
        if (post.authorId !== user.id) {
            const userRole = await this.communitiesService.getMemberRole(post.communityId, user.id);
            if (userRole !== community_member_entity_1.MemberRole.ADMIN && userRole !== community_member_entity_1.MemberRole.MODERATOR) {
                throw new common_1.ForbiddenException('You can only delete your own posts');
            }
        }
        await this.postsRepository.remove(post);
        return { message: 'Post deleted successfully' };
    }
    async vote(id, user, value) {
        const post = await this.findOne(id);
        const isMember = await this.communitiesService.isMember(post.communityId, user.id);
        if (!isMember) {
            throw new common_1.ForbiddenException('You must be a member of the community to vote');
        }
        if (post.authorId === user.id) {
            throw new common_1.ForbiddenException('You cannot vote on your own post');
        }
        let vote = await this.votesRepository.findOne({
            where: {
                postId: post.id,
                userId: user.id,
            },
        });
        if (vote) {
            if (vote.value === value) {
                return post;
            }
            vote.value = value;
        }
        else {
            vote = this.votesRepository.create({
                post,
                postId: post.id,
                user,
                userId: user.id,
                value,
            });
        }
        await this.votesRepository.save(vote);
        await this.updatePostScore(post.id);
        if (value > 0) {
            await this.reputationService.addPostUpvotePoints(post.authorId);
            await this.notificationsService.createNotification({
                type: notification_entity_1.NotificationType.POST_UPVOTE,
                recipientId: post.authorId,
                actorId: user.id,
                postId: post.id,
            });
        }
        else {
            await this.reputationService.addPostDownvotePoints(post.authorId);
        }
        return this.findOne(id);
    }
    async removeVote(id, user) {
        const post = await this.findOne(id);
        const vote = await this.votesRepository.findOne({
            where: {
                postId: post.id,
                userId: user.id,
            },
        });
        if (!vote) {
            return post;
        }
        await this.votesRepository.remove(vote);
        await this.updatePostScore(post.id);
        if (vote.value > 0) {
            await this.reputationService.removePostUpvotePoints(post.authorId);
        }
        else {
            await this.reputationService.removePostDownvotePoints(post.authorId);
        }
        return this.findOne(id);
    }
    async pinPost(id, user) {
        const post = await this.findOne(id);
        const userRole = await this.communitiesService.getMemberRole(post.communityId, user.id);
        const canPin = userRole === community_member_entity_1.MemberRole.ADMIN || userRole === community_member_entity_1.MemberRole.MODERATOR;
        const isHighRepUser = user.reputationScore >= 1000;
        if (!canPin && !isHighRepUser) {
            throw new common_1.ForbiddenException('You do not have permission to pin posts');
        }
        if (!canPin && isHighRepUser) {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const recentPinnedPosts = await this.postsRepository.count({
                where: {
                    authorId: user.id,
                    isPinned: true,
                    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
            });
            if (recentPinnedPosts > 0) {
                throw new common_1.ForbiddenException('You can only pin one post per week');
            }
            if (post.authorId !== user.id) {
                throw new common_1.ForbiddenException('You can only pin your own posts');
            }
        }
        post.isPinned = true;
        return this.postsRepository.save(post);
    }
    async unpinPost(id, user) {
        const post = await this.findOne(id);
        const userRole = await this.communitiesService.getMemberRole(post.communityId, user.id);
        const canUnpin = userRole === community_member_entity_1.MemberRole.ADMIN || userRole === community_member_entity_1.MemberRole.MODERATOR;
        if (!canUnpin && post.authorId !== user.id) {
            throw new common_1.ForbiddenException('You do not have permission to unpin this post');
        }
        post.isPinned = false;
        return this.postsRepository.save(post);
    }
    async updateCommentCount(postId, increment = true) {
        const post = await this.findOne(postId);
        if (increment) {
            post.commentCount += 1;
        }
        else {
            post.commentCount = Math.max(0, post.commentCount - 1);
        }
        await this.postsRepository.save(post);
    }
    async updatePostScore(postId) {
        const upvotes = await this.votesRepository.count({
            where: {
                postId,
                value: 1,
            },
        });
        const downvotes = await this.votesRepository.count({
            where: {
                postId,
                value: -1,
            },
        });
        await this.postsRepository.update(postId, {
            upvotes,
            downvotes,
            score: upvotes - downvotes,
        });
    }
    validatePostData(createPostDto) {
        switch (createPostDto.type) {
            case post_entity_1.PostType.TEXT:
                if (!createPostDto.content) {
                    throw new common_1.BadRequestException('Content is required for text posts');
                }
                break;
            case post_entity_1.PostType.IMAGE:
                if (!createPostDto.imageUrl) {
                    throw new common_1.BadRequestException('Image URL is required for image posts');
                }
                break;
            case post_entity_1.PostType.LINK:
                if (!createPostDto.linkUrl) {
                    throw new common_1.BadRequestException('Link URL is required for link posts');
                }
                break;
        }
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(1, (0, typeorm_1.InjectRepository)(vote_entity_1.Vote)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => reputation_service_1.ReputationService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => notifications_service_1.NotificationsService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        communities_service_1.CommunitiesService,
        reputation_service_1.ReputationService,
        notifications_service_1.NotificationsService])
], PostsService);
//# sourceMappingURL=posts.service.js.map