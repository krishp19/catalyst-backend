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
exports.TagsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const tags_service_1 = require("./tags.service");
const tag_entity_1 = require("./entities/tag.entity");
let TagsController = class TagsController {
    constructor(tagsService) {
        this.tagsService = tagsService;
    }
    async getPopularTags(limit = 10) {
        return this.tagsService.getPopularTags(limit);
    }
    async searchTags(query, limit = 10) {
        if (!query || query.trim() === '') {
            return this.tagsService.getPopularTags(limit);
        }
        return this.tagsService.searchTags(query, limit);
    }
};
exports.TagsController = TagsController;
__decorate([
    (0, common_1.Get)('popular'),
    (0, swagger_1.ApiOperation)({ summary: 'Get popular tags' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of popular tags', type: [tag_entity_1.Tag] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Number of tags to return (default: 10)' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "getPopularTags", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Search tags by name' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of matching tags', type: [tag_entity_1.Tag] }),
    (0, swagger_1.ApiQuery)({ name: 'query', required: true, description: 'Search query for tag names' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Maximum number of tags to return (default: 10)' }),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TagsController.prototype, "searchTags", null);
exports.TagsController = TagsController = __decorate([
    (0, swagger_1.ApiTags)('tags'),
    (0, common_1.Controller)('tags'),
    __metadata("design:paramtypes", [tags_service_1.TagsService])
], TagsController);
//# sourceMappingURL=tags.controller.js.map