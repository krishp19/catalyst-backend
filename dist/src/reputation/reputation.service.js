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
exports.ReputationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
let ReputationService = class ReputationService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
        this.POST_CREATION_POINTS = 5;
        this.POST_UPVOTE_POINTS = 10;
        this.POST_DOWNVOTE_POINTS = -2;
        this.COMMENT_CREATION_POINTS = 2;
        this.COMMENT_UPVOTE_POINTS = 5;
        this.COMMENT_DOWNVOTE_POINTS = -1;
        this.COMMUNITY_CREATION_POINTS = 20;
        this.COMMUNITY_PARTICIPATION_POINTS = 1;
        this.MONTHLY_DECAY_PERCENTAGE = 0.05;
    }
    async addPostCreationPoints(userId) {
        await this.updateUserReputation(userId, this.POST_CREATION_POINTS, 'postScore');
    }
    async addPostUpvotePoints(userId) {
        await this.updateUserReputation(userId, this.POST_UPVOTE_POINTS, 'postScore');
    }
    async addPostDownvotePoints(userId) {
        await this.updateUserReputation(userId, this.POST_DOWNVOTE_POINTS, 'postScore');
    }
    async removePostUpvotePoints(userId) {
        await this.updateUserReputation(userId, -this.POST_UPVOTE_POINTS, 'postScore');
    }
    async removePostDownvotePoints(userId) {
        await this.updateUserReputation(userId, -this.POST_DOWNVOTE_POINTS, 'postScore');
    }
    async addCommentCreationPoints(userId) {
        await this.updateUserReputation(userId, this.COMMENT_CREATION_POINTS, 'commentScore');
    }
    async addCommentUpvotePoints(userId) {
        await this.updateUserReputation(userId, this.COMMENT_UPVOTE_POINTS, 'commentScore');
    }
    async addCommentDownvotePoints(userId) {
        await this.updateUserReputation(userId, this.COMMENT_DOWNVOTE_POINTS, 'commentScore');
    }
    async removeCommentUpvotePoints(userId) {
        await this.updateUserReputation(userId, -this.COMMENT_UPVOTE_POINTS, 'commentScore');
    }
    async removeCommentDownvotePoints(userId) {
        await this.updateUserReputation(userId, -this.COMMENT_DOWNVOTE_POINTS, 'commentScore');
    }
    async addCommunityCreationPoints(userId) {
        await this.updateUserReputation(userId, this.COMMUNITY_CREATION_POINTS, 'communityScore');
    }
    async addCommunityParticipationPoints(userId) {
        await this.updateUserReputation(userId, this.COMMUNITY_PARTICIPATION_POINTS, 'communityScore');
    }
    async applyMonthlyDecay() {
        const users = await this.usersRepository.find();
        for (const user of users) {
            const decayAmount = Math.floor(user.reputationScore * this.MONTHLY_DECAY_PERCENTAGE);
            if (decayAmount > 0) {
                user.reputationScore = Math.max(0, user.reputationScore - decayAmount);
                await this.usersRepository.save(user);
            }
        }
    }
    async updateUserReputation(userId, points, scoreField) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            return;
        }
        user[scoreField] = Math.max(0, user[scoreField] + points);
        user.reputationScore = user.postScore + user.commentScore + user.communityScore;
        await this.usersRepository.save(user);
    }
};
exports.ReputationService = ReputationService;
exports.ReputationService = ReputationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReputationService);
//# sourceMappingURL=reputation.service.js.map