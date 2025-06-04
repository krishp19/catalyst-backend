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
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const comments_service_1 = require("./comments.service");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const update_comment_dto_1 = require("./dto/update-comment.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let CommentsController = class CommentsController {
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    create(createCommentDto, user) {
        return this.commentsService.create(createCommentDto, user);
    }
    findByPost(postId, paginationDto, parentId) {
        return this.commentsService.findByPost(postId, paginationDto.page, paginationDto.limit, parentId);
    }
    findReplies(id, paginationDto) {
        return this.commentsService.findReplies(id, paginationDto.page, paginationDto.limit);
    }
    update(id, updateCommentDto, user) {
        return this.commentsService.update(id, updateCommentDto, user);
    }
    remove(id, user) {
        return this.commentsService.remove(id, user);
    }
    upvote(id, user) {
        return this.commentsService.vote(id, user, 1);
    }
    downvote(id, user) {
        return this.commentsService.vote(id, user, -1);
    }
    removeVote(id, user) {
        return this.commentsService.removeVote(id, user);
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new comment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The comment has been successfully created' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_comment_dto_1.CreateCommentDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get comments for a post' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all comments for a post' }),
    (0, common_1.Get)('post/:postId'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)('parentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto, String]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "findByPost", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get replies to a comment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all replies to a comment' }),
    (0, common_1.Get)(':id/replies'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "findReplies", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update a comment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The comment has been successfully updated' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_comment_dto_1.UpdateCommentDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete a comment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The comment has been successfully deleted' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Upvote a comment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The comment has been successfully upvoted' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/upvote'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "upvote", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Downvote a comment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The comment has been successfully downvoted' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/downvote'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "downvote", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remove vote from a comment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The vote has been successfully removed' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id/vote'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "removeVote", null);
exports.CommentsController = CommentsController = __decorate([
    (0, swagger_1.ApiTags)('comments'),
    (0, common_1.Controller)('comments'),
    __metadata("design:paramtypes", [comments_service_1.CommentsService])
], CommentsController);
//# sourceMappingURL=comments.controller.js.map