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
exports.PostSearchResult = exports.CommunitySearchResult = exports.SearchResultDto = void 0;
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class SearchResultDto {
}
exports.SearchResultDto = SearchResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of matching communities',
        type: () => [CommunitySearchResult],
        example: [{
                id: '550e8400-e29b-41d4-a716-446655440000',
                name: 'programming',
                description: 'A community for programming discussions',
                memberCount: 1000,
                createdAt: '2023-01-01T00:00:00.000Z'
            }]
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], SearchResultDto.prototype, "communities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of matching posts',
        type: () => [PostSearchResult],
        example: [{
                id: '550e8400-e29b-41d4-a716-446655440001',
                title: 'Introduction to Programming',
                content: 'This is a post about programming...',
                score: 42,
                commentCount: 5,
                community: {
                    id: '550e8400-e29b-41d4-a716-446655440000',
                    name: 'programming'
                },
                author: {
                    id: '550e8400-e29b-41d4-a716-446655440002',
                    username: 'devuser'
                },
                createdAt: '2023-01-02T00:00:00.000Z'
            }]
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], SearchResultDto.prototype, "posts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of results across all pages',
        example: 1
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], SearchResultDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page number',
        example: 1
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], SearchResultDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of pages',
        example: 1
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], SearchResultDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        example: 10
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], SearchResultDto.prototype, "limit", void 0);
class CommunitySearchResult {
    static fromEntity(community) {
        const result = new CommunitySearchResult();
        result.id = community.id;
        result.name = community.name;
        result.description = community.description;
        result.iconUrl = community.iconUrl;
        result.memberCount = community.memberCount;
        result.createdAt = community['createdAt'] || new Date();
        return result;
    }
}
exports.CommunitySearchResult = CommunitySearchResult;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the community',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CommunitySearchResult.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the community',
        example: 'programming'
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CommunitySearchResult.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of the community',
        example: 'A community for programming discussions'
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CommunitySearchResult.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL of the community icon',
        example: 'https://example.com/icon.jpg'
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CommunitySearchResult.prototype, "iconUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of members in the community',
        example: 1000
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], CommunitySearchResult.prototype, "memberCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when the community was created',
        type: 'string',
        format: 'date-time',
        example: '2023-01-01T00:00:00.000Z'
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], CommunitySearchResult.prototype, "createdAt", void 0);
class PostSearchResult {
    static fromEntity(post) {
        const result = new PostSearchResult();
        result.id = post.id;
        result.title = post.title;
        result.content = post.content?.substring(0, 200) + (post.content?.length > 200 ? '...' : '');
        result.imageUrl = post.imageUrl;
        result.score = post.score;
        result.commentCount = post['commentCount'] || 0;
        result.community = post.community ? {
            id: post.community.id,
            name: post.community.name
        } : { id: '', name: 'Unknown' };
        result.author = post.author ? {
            id: post.author.id,
            username: post.author['username'] || 'Anonymous'
        } : { id: '', username: 'Anonymous' };
        result.createdAt = post['createdAt'] || new Date();
        return result;
    }
}
exports.PostSearchResult = PostSearchResult;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the post',
        example: '550e8400-e29b-41d4-a716-446655440001'
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PostSearchResult.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of the post',
        example: 'Introduction to Programming'
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PostSearchResult.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Content of the post (truncated if too long)',
        example: 'This is a post about programming...'
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PostSearchResult.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'URL of the post image if available',
        example: 'https://example.com/image.jpg'
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], PostSearchResult.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Post score (upvotes - downvotes)',
        example: 42
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PostSearchResult.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of comments on the post',
        example: 5
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], PostSearchResult.prototype, "commentCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Community information',
        type: () => ({
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            name: { type: 'string', example: 'programming' }
        })
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], PostSearchResult.prototype, "community", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Author information',
        type: () => ({
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440002' },
            username: { type: 'string', example: 'devuser' }
        })
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], PostSearchResult.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when the post was created',
        type: 'string',
        format: 'date-time',
        example: '2023-01-02T00:00:00.000Z'
    }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], PostSearchResult.prototype, "createdAt", void 0);
//# sourceMappingURL=search-response.dto.js.map