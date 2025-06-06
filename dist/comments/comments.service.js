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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const comment_entity_1 = require("./entities/comment.entity");
const vote_entity_1 = require("../votes/entities/vote.entity");
const posts_service_1 = require("../posts/posts.service");
const communities_service_1 = require("../communities/communities.service");
const reputation_service_1 = require("../reputation/reputation.service");
const notifications_service_1 = require("../notifications/notifications.service");
const community_member_entity_1 = require("../communities/entities/community-member.entity");
const notification_entity_1 = require("../notifications/entities/notification.entity");
let CommentsService = class CommentsService {
    constructor(commentsRepository, votesRepository, postsService, communitiesService, reputationService, notificationsService) {
        this.commentsRepository = commentsRepository;
        this.votesRepository = votesRepository;
        this.postsService = postsService;
        this.communitiesService = communitiesService;
        this.reputationService = reputationService;
        this.notificationsService = notificationsService;
    }
    async create(createCommentDto, user) {
        const post = await this.postsService.findOne(createCommentDto.postId);
        const isMember = await this.communitiesService.isMember(post.communityId, user.id);
        if (!isMember) {
            throw new common_1.ForbiddenException('You must be a member of the community to comment');
        }
        if (createCommentDto.parentId) {
            const parentComment = await this.commentsRepository.findOne({
                where: { id: createCommentDto.parentId },
            });
            if (!parentComment) {
                throw new common_1.NotFoundException('Parent comment not found');
            }
            if (parentComment.postId !== createCommentDto.postId) {
                throw new common_1.BadRequestException('Parent comment does not belong to the specified post');
            }
        }
        const comment = this.commentsRepository.create({
            ...createCommentDto,
            author: user,
            authorId: user.id,
        });
        const savedComment = await this.commentsRepository.save(comment);
        await this.postsService.updateCommentCount(post.id, true);
        await this.reputationService.addCommentCreationPoints(user.id);
        if (post.authorId !== user.id) {
            await this.notificationsService.createNotification({
                type: notification_entity_1.NotificationType.NEW_COMMENT,
                recipientId: post.authorId,
                actorId: user.id,
                postId: post.id,
                commentId: savedComment.id,
            });
        }
        if (createCommentDto.parentId) {
            const parentComment = await this.commentsRepository.findOne({
                where: { id: createCommentDto.parentId },
            });
            if (parentComment && parentComment.authorId !== user.id) {
                await this.notificationsService.createNotification({
                    type: notification_entity_1.NotificationType.COMMENT_REPLY,
                    recipientId: parentComment.authorId,
                    actorId: user.id,
                    postId: post.id,
                    commentId: savedComment.id,
                });
            }
        }
        const mentions = this.extractMentions(createCommentDto.content);
        if (mentions.length > 0) {
            for (const username of mentions) {
                try {
                    const mentionedUser = await this.getUserByUsername(username);
                    if (mentionedUser.id !== user.id) {
                        await this.notificationsService.createNotification({
                            type: notification_entity_1.NotificationType.MENTION,
                            recipientId: mentionedUser.id,
                            actorId: user.id,
                            postId: post.id,
                            commentId: savedComment.id,
                        });
                    }
                }
                catch (error) {
                }
            }
        }
        return savedComment;
    }
    async findByPost(postId, page = 1, limit = 10, parentId) {
        const whereCondition = { postId };
        if (parentId) {
            whereCondition.parentId = parentId;
        }
        else {
            whereCondition.parentId = null;
        }
        const [comments, total] = await this.commentsRepository.findAndCount({
            where: whereCondition,
            relations: ['author'],
            skip: (page - 1) * limit,
            take: limit,
            order: {
                score: 'DESC',
                createdAt: 'ASC',
            },
        });
        const commentsWithReplyCount = await Promise.all(comments.map(async (comment) => {
            let replyCount = 0;
            if (!parentId) {
                replyCount = await this.commentsRepository.count({
                    where: { parentId: comment.id },
                });
            }
            return {
                ...comment,
                replyCount,
            };
        }));
        return {
            items: commentsWithReplyCount,
            meta: {
                totalItems: total,
                itemCount: comments.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            },
        };
    }
    async findReplies(commentId, page = 1, limit = 10) {
        return this.commentsRepository.findAndCount({
            where: { parentId: commentId },
            relations: ['author'],
            skip: (page - 1) * limit,
            take: limit,
            order: {
                score: 'DESC',
                createdAt: 'ASC',
            },
        });
    }
    async findOne(id) {
        const comment = await this.commentsRepository.findOne({
            where: { id },
            relations: ['author', 'post'],
        });
        if (!comment) {
            throw new common_1.NotFoundException(`Comment with ID ${id} not found`);
        }
        return comment;
    }
    async update(id, updateCommentDto, user) {
        const comment = await this.findOne(id);
        if (comment.authorId !== user.id) {
            const post = await this.postsService.findOne(comment.postId);
            const userRole = await this.communitiesService.getMemberRole(post.communityId, user.id);
            if (userRole !== community_member_entity_1.MemberRole.ADMIN && userRole !== community_member_entity_1.MemberRole.MODERATOR) {
                throw new common_1.ForbiddenException('You can only edit your own comments');
            }
        }
        Object.assign(comment, updateCommentDto);
        return this.commentsRepository.save(comment);
    }
    async remove(id, user) {
        const comment = await this.findOne(id);
        if (comment.authorId !== user.id) {
            const post = await this.postsService.findOne(comment.postId);
            const userRole = await this.communitiesService.getMemberRole(post.communityId, user.id);
            if (userRole !== community_member_entity_1.MemberRole.ADMIN && userRole !== community_member_entity_1.MemberRole.MODERATOR) {
                throw new common_1.ForbiddenException('You can only delete your own comments');
            }
        }
        await this.postsService.updateCommentCount(comment.postId, false);
        await this.commentsRepository.remove(comment);
        return { message: 'Comment deleted successfully' };
    }
    async vote(id, user, value) {
        const comment = await this.findOne(id);
        const post = await this.postsService.findOne(comment.postId);
        const isMember = await this.communitiesService.isMember(post.communityId, user.id);
        if (!isMember) {
            throw new common_1.ForbiddenException('You must be a member of the community to vote');
        }
        if (comment.authorId === user.id) {
            throw new common_1.ForbiddenException('You cannot vote on your own comment');
        }
        let vote = await this.votesRepository.findOne({
            where: {
                commentId: comment.id,
                userId: user.id,
            },
        });
        if (vote) {
            if (vote.value === value) {
                return comment;
            }
            vote.value = value;
        }
        else {
            vote = this.votesRepository.create({
                comment,
                commentId: comment.id,
                user,
                userId: user.id,
                value,
            });
        }
        await this.votesRepository.save(vote);
        await this.updateCommentScore(comment.id);
        if (value > 0) {
            await this.reputationService.addCommentUpvotePoints(comment.authorId);
            await this.notificationsService.createNotification({
                type: notification_entity_1.NotificationType.COMMENT_UPVOTE,
                recipientId: comment.authorId,
                actorId: user.id,
                postId: post.id,
                commentId: comment.id,
            });
        }
        else {
            await this.reputationService.addCommentDownvotePoints(comment.authorId);
        }
        return this.findOne(id);
    }
    async removeVote(id, user) {
        const comment = await this.findOne(id);
        const vote = await this.votesRepository.findOne({
            where: {
                commentId: comment.id,
                userId: user.id,
            },
        });
        if (!vote) {
            return comment;
        }
        await this.votesRepository.remove(vote);
        await this.updateCommentScore(comment.id);
        if (vote.value > 0) {
            await this.reputationService.removeCommentUpvotePoints(comment.authorId);
        }
        else {
            await this.reputationService.removeCommentDownvotePoints(comment.authorId);
        }
        return this.findOne(id);
    }
    async updateCommentScore(commentId) {
        const upvotes = await this.votesRepository.count({
            where: {
                commentId,
                value: 1,
            },
        });
        const downvotes = await this.votesRepository.count({
            where: {
                commentId,
                value: -1,
            },
        });
        await this.commentsRepository.update(commentId, {
            upvotes,
            downvotes,
            score: upvotes - downvotes,
        });
    }
    extractMentions(content) {
        const mentionPattern = /@([a-zA-Z0-9_-]+)/g;
        const matches = content.match(mentionPattern) || [];
        return [...new Set(matches.map(match => match.substring(1)))];
    }
    async getUserByUsername(username) {
        const user = await this.commentsRepository.manager
            .getRepository('users')
            .findOne({ where: { username } });
        if (!user) {
            throw new common_1.NotFoundException(`User @${username} not found`);
        }
        return user;
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(1, (0, typeorm_1.InjectRepository)(vote_entity_1.Vote)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        posts_service_1.PostsService,
        communities_service_1.CommunitiesService,
        reputation_service_1.ReputationService,
        notifications_service_1.NotificationsService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map