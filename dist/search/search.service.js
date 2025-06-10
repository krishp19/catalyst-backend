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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const community_entity_1 = require("../communities/entities/community.entity");
const post_entity_1 = require("../posts/entities/post.entity");
const search_response_dto_1 = require("./dto/search-response.dto");
let SearchService = class SearchService {
    constructor(communityRepository, postRepository) {
        this.communityRepository = communityRepository;
        this.postRepository = postRepository;
    }
    async search(dto) {
        const [communities, posts] = await Promise.all([
            this.searchCommunities(dto),
            this.searchPosts(dto),
        ]);
        const result = new search_response_dto_1.SearchResultDto();
        if (dto.type === 'all' || dto.type === 'communities') {
            result.communities = communities[0].map(community => search_response_dto_1.CommunitySearchResult.fromEntity(community));
        }
        else {
            result.communities = [];
        }
        if (dto.type === 'all' || dto.type === 'posts') {
            result.posts = posts[0].map(post => search_response_dto_1.PostSearchResult.fromEntity(post));
        }
        else {
            result.posts = [];
        }
        result.total = (dto.type === 'all' || dto.type === 'communities' ? communities[1] : 0) +
            (dto.type === 'all' || dto.type === 'posts' ? posts[1] : 0);
        result.page = dto.page;
        result.limit = dto.limit;
        result.totalPages = Math.ceil(result.total / dto.limit);
        return result;
    }
    async searchCommunities(dto) {
        if (dto.type !== 'all' && dto.type !== 'communities') {
            return [[], 0];
        }
        const queryBuilder = this.communityRepository
            .createQueryBuilder('community')
            .leftJoinAndSelect('community.creator', 'creator')
            .where('LOWER(community.name) LIKE LOWER(:query)', { query: `%${dto.query}%` })
            .orWhere('LOWER(community.description) LIKE LOWER(:query)', { query: `%${dto.query}%` });
        this.applySorting(queryBuilder, 'community', dto.sort);
        const skip = (dto.page - 1) * dto.limit;
        queryBuilder.skip(skip).take(dto.limit);
        return queryBuilder.getManyAndCount();
    }
    async searchPosts(dto) {
        if (dto.type !== 'all' && dto.type !== 'posts') {
            return [[], 0];
        }
        const postIdsQuery = this.postRepository
            .createQueryBuilder('post')
            .select('post.id', 'id')
            .where('LOWER(post.title) LIKE LOWER(:query)', { query: `%${dto.query}%` })
            .orWhere('LOWER(post.content) LIKE LOWER(:query)', { query: `%${dto.query}%` });
        const sortField = dto.sort === 'newest' ? 'post.createdAt' : 'post.score';
        const sortOrder = dto.sort === 'top' ? 'DESC' : 'DESC';
        postIdsQuery.orderBy(sortField, sortOrder);
        const skip = (dto.page - 1) * dto.limit;
        postIdsQuery.skip(skip).take(dto.limit);
        const postIds = (await postIdsQuery.getRawMany()).map(item => item.id);
        if (postIds.length === 0) {
            return [[], 0];
        }
        const total = await this.postRepository
            .createQueryBuilder('post')
            .where('LOWER(post.title) LIKE LOWER(:query)', { query: `%${dto.query}%` })
            .orWhere('LOWER(post.content) LIKE LOWER(:query)', { query: `%${dto.query}%` })
            .getCount();
        const postsQuery = this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.community', 'community')
            .leftJoinAndSelect('post.author', 'author')
            .where('post.id IN (:...postIds)', { postIds });
        if (postIds.length > 0) {
            const orderByCase = postIds
                .map((id, index) => `WHEN post.id = '${id}' THEN ${index}`)
                .join(' ');
            postsQuery.addOrderBy(`(CASE ${orderByCase} END)`, 'ASC');
        }
        const posts = await postsQuery.getMany();
        const commentCounts = await this.postRepository
            .createQueryBuilder('post')
            .select('post.id', 'postId')
            .addSelect('COUNT(comment.id)', 'commentCount')
            .leftJoin('post.comments', 'comment')
            .where('post.id IN (:...postIds)', { postIds })
            .groupBy('post.id')
            .getRawMany();
        const commentCountMap = new Map(commentCounts.map(item => [item.postId, parseInt(item.commentCount, 10)]));
        posts.forEach(post => {
            post.commentCount = commentCountMap.get(post.id) || 0;
        });
        return [posts, total];
    }
    applySorting(queryBuilder, alias, sort) {
        switch (sort) {
            case 'newest':
                queryBuilder.orderBy(`${alias}.createdAt`, 'DESC');
                break;
            case 'top':
                queryBuilder.orderBy(`${alias}.score`, 'DESC');
                break;
            case 'relevance':
            default:
                queryBuilder.orderBy(`${alias}.createdAt`, 'DESC');
                break;
        }
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(community_entity_1.Community)),
    __param(1, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SearchService);
//# sourceMappingURL=search.service.js.map