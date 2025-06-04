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
exports.CommunitiesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const communities_service_1 = require("./communities.service");
const create_community_dto_1 = require("./dto/create-community.dto");
const update_community_dto_1 = require("./dto/update-community.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const paginated_response_dto_1 = require("../common/dto/paginated-response.dto");
let CommunitiesController = class CommunitiesController {
    constructor(communitiesService) {
        this.communitiesService = communitiesService;
    }
    create(createCommunityDto, user) {
        return this.communitiesService.create(createCommunityDto, user);
    }
    findAll(paginationDto) {
        return this.communitiesService.findAll(paginationDto.page, paginationDto.limit);
    }
    findByName(name) {
        return this.communitiesService.findByName(name);
    }
    update(id, updateCommunityDto, user) {
        return this.communitiesService.update(id, updateCommunityDto, user);
    }
    join(id, user) {
        return this.communitiesService.joinCommunity(id, user);
    }
    leave(id, user) {
        return this.communitiesService.leaveCommunity(id, user);
    }
    getMembers(id, paginationDto) {
        return this.communitiesService.getMembers(id, paginationDto.page, paginationDto.limit);
    }
    async getJoinedCommunities(user, page = 1, limit = 10) {
        return this.communitiesService.getJoinedCommunities(user.id, page, limit);
    }
};
exports.CommunitiesController = CommunitiesController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new community' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The community has been successfully created' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_community_dto_1.CreateCommunityDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all communities' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all communities' }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a community by name' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the community' }),
    (0, common_1.Get)(':name'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "findByName", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update a community' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The community has been successfully updated' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_community_dto_1.UpdateCommunityDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Join a community' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully joined the community' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/join'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "join", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Leave a community' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully left the community' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id/leave'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "leave", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get members of a community' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all community members' }),
    (0, common_1.Get)(':id/members'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], CommunitiesController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Get)('user/joined'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get communities joined by the current user' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns paginated list of communities joined by the user',
        type: (paginated_response_dto_1.PaginatedResponseDto),
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object, Object]),
    __metadata("design:returntype", Promise)
], CommunitiesController.prototype, "getJoinedCommunities", null);
exports.CommunitiesController = CommunitiesController = __decorate([
    (0, swagger_1.ApiTags)('communities'),
    (0, common_1.Controller)('communities'),
    __metadata("design:paramtypes", [communities_service_1.CommunitiesService])
], CommunitiesController);
//# sourceMappingURL=communities.controller.js.map