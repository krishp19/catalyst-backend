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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const search_service_1 = require("./search.service");
const search_request_dto_1 = require("./dto/search-request.dto");
const search_response_dto_1 = require("./dto/search-response.dto");
let SearchController = class SearchController {
    constructor(searchService) {
        this.searchService = searchService;
    }
    async search(searchRequest) {
        return this.searchService.search(searchRequest);
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Search for communities and posts',
        description: 'Searches across communities and posts based on the provided query string. Returns paginated results.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Search results',
        schema: {
            $ref: (0, swagger_1.getSchemaPath)(search_response_dto_1.SearchResultDto)
        }
    }),
    (0, swagger_1.ApiQuery)({
        name: 'query',
        required: true,
        description: 'Search query string',
        example: 'programming',
        type: String
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        description: 'Type of content to search for',
        enum: ['all', 'communities', 'posts'],
        example: 'all'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        type: Number,
        example: 1
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Number of items per page',
        type: Number,
        example: 10
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sort',
        required: false,
        description: 'Sort order for results',
        enum: ['relevance', 'newest', 'top'],
        example: 'relevance'
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Search results',
        type: search_response_dto_1.SearchResultDto,
        schema: {
            example: {
                communities: [
                    {
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        name: 'programming',
                        description: 'A community for programming discussions',
                        iconUrl: 'https://example.com/icon.jpg',
                        memberCount: 1000,
                        createdAt: '2023-01-01T00:00:00.000Z'
                    }
                ],
                posts: [
                    {
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
                    }
                ],
                total: 2,
                page: 1,
                limit: 10,
                totalPages: 1
            }
        }
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid request parameters',
        schema: {
            example: {
                statusCode: 400,
                message: ['query must be a string'],
                error: 'Bad Request'
            }
        }
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'No results found',
        schema: {
            example: {
                statusCode: 404,
                message: 'No results found',
                error: 'Not Found'
            }
        }
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_request_dto_1.SearchRequestDto]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "search", null);
exports.SearchController = SearchController = __decorate([
    (0, swagger_1.ApiTags)('search'),
    (0, common_1.Controller)({
        path: 'search',
        version: '1',
    }),
    (0, swagger_1.ApiExtraModels)(search_response_dto_1.SearchResultDto, search_response_dto_1.CommunitySearchResult, search_response_dto_1.PostSearchResult),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
//# sourceMappingURL=search.controller.js.map