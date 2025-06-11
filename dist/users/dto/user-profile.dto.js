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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const post_entity_1 = require("../../posts/entities/post.entity");
const comment_entity_1 = require("../../comments/entities/comment.entity");
class UserProfileDto {
    constructor(user) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.bio = user.bio;
        this.avatarUrl = user.avatarUrl;
        this.reputationScore = user.reputationScore;
        this.postScore = user.postScore;
        this.commentScore = user.commentScore;
        this.communityScore = user.communityScore;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}
exports.UserProfileDto = UserProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Username' }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address', required: false }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User bio', required: false }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL to user\'s avatar', required: false }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "avatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User\'s reputation score' }),
    __metadata("design:type", Number)
], UserProfileDto.prototype, "reputationScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User\'s post score' }),
    __metadata("design:type", Number)
], UserProfileDto.prototype, "postScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User\'s comment score' }),
    __metadata("design:type", Number)
], UserProfileDto.prototype, "commentScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User\'s community score' }),
    __metadata("design:type", Number)
], UserProfileDto.prototype, "communityScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the user joined' }),
    __metadata("design:type", Date)
], UserProfileDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the user was last updated' }),
    __metadata("design:type", Date)
], UserProfileDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User\'s posts', type: [post_entity_1.Post], required: false }),
    __metadata("design:type", Array)
], UserProfileDto.prototype, "posts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User\'s comments', type: [comment_entity_1.Comment], required: false }),
    __metadata("design:type", Array)
], UserProfileDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Posts and comments upvoted by the user', type: [Object], required: false }),
    __metadata("design:type", Array)
], UserProfileDto.prototype, "upvoted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Posts and comments downvoted by the user', type: [Object], required: false }),
    __metadata("design:type", Array)
], UserProfileDto.prototype, "downvoted", void 0);
//# sourceMappingURL=user-profile.dto.js.map