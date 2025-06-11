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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const post_entity_1 = require("../posts/entities/post.entity");
const comment_entity_1 = require("../comments/entities/comment.entity");
const vote_entity_1 = require("../votes/entities/vote.entity");
const user_profile_dto_1 = require("./dto/user-profile.dto");
let UsersService = class UsersService {
    constructor(usersRepository, postsRepository, commentsRepository, votesRepository) {
        this.usersRepository = usersRepository;
        this.postsRepository = postsRepository;
        this.commentsRepository = commentsRepository;
        this.votesRepository = votesRepository;
    }
    async create(createUserDto) {
        const existingUser = await this.usersRepository.findOne({
            where: [
                { email: createUserDto.email },
                { username: createUserDto.username },
            ],
        });
        if (existingUser) {
            if (existingUser.email === createUserDto.email) {
                throw new common_1.ConflictException('Email already in use');
            }
            else {
                throw new common_1.ConflictException('Username already taken');
            }
        }
        const user = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(user);
    }
    async findAll(page = 1, limit = 10) {
        const [users, total] = await this.usersRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return {
            items: users,
            meta: {
                totalItems: total,
                itemCount: users.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            },
        };
    }
    async findById(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByUsername(username) {
        const user = await this.usersRepository.findOne({ where: { username } });
        if (!user) {
            throw new common_1.NotFoundException(`User with username ${username} not found`);
        }
        return user;
    }
    async findByEmail(email) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        const user = await this.findById(id);
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.usersRepository.findOne({
                where: { email: updateUserDto.email },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email already in use');
            }
        }
        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }
    async getEnhancedProfile(username, includeContent = true) {
        const user = await this.usersRepository.findOne({
            where: { username },
            relations: ['posts', 'comments', 'votes']
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with username ${username} not found`);
        }
        const userProfile = new user_profile_dto_1.UserProfileDto(user);
        if (!includeContent) {
            return userProfile;
        }
        const posts = await this.postsRepository.find({
            where: { authorId: user.id },
            relations: ['author', 'community', 'tags'],
            order: { createdAt: 'DESC' },
            take: 10
        });
        const comments = await this.commentsRepository.find({
            where: { authorId: user.id },
            relations: ['author', 'post'],
            order: { createdAt: 'DESC' },
            take: 10
        });
        const votes = await this.votesRepository.find({
            where: { userId: user.id },
            relations: ['post', 'comment', 'post.author', 'comment.author']
        });
        const upvoted = [];
        const downvoted = [];
        for (const vote of votes) {
            if (vote.value > 0) {
                if (vote.post) {
                    upvoted.push(vote.post);
                }
                else if (vote.comment) {
                    upvoted.push(vote.comment);
                }
            }
            else if (vote.value < 0) {
                if (vote.post) {
                    downvoted.push(vote.post);
                }
                else if (vote.comment) {
                    downvoted.push(vote.comment);
                }
            }
        }
        userProfile.posts = posts;
        userProfile.comments = comments;
        userProfile.upvoted = upvoted;
        userProfile.downvoted = downvoted;
        return userProfile;
    }
    async getReputationBreakdown(userId) {
        const user = await this.findById(userId);
        return {
            totalScore: user.reputationScore,
            breakdown: {
                fromPosts: user.postScore,
                fromComments: user.commentScore,
                fromCommunities: user.communityScore,
            },
        };
    }
    async getJoinedCommunities(userId) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['communityMemberships', 'communityMemberships.community'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        return user.communityMemberships?.map(membership => membership.community) || [];
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(2, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(3, (0, typeorm_1.InjectRepository)(vote_entity_1.Vote)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map