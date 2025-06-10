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
exports.SearchRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SearchRequestDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
        this.sort = 'relevance';
        this.type = 'all';
    }
}
exports.SearchRequestDto = SearchRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Search query string',
        example: 'programming',
        required: true
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchRequestDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number for pagination',
        default: 1,
        minimum: 1,
        example: 1
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SearchRequestDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page',
        default: 10,
        minimum: 1,
        maximum: 100,
        example: 10
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SearchRequestDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order for results',
        enum: ['relevance', 'newest', 'top'],
        default: 'relevance',
        example: 'relevance'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['relevance', 'newest', 'top']),
    __metadata("design:type", String)
], SearchRequestDto.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Type of content to search for',
        enum: ['all', 'communities', 'posts'],
        default: 'all',
        example: 'all'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['all', 'communities', 'posts']),
    __metadata("design:type", String)
], SearchRequestDto.prototype, "type", void 0);
//# sourceMappingURL=search-request.dto.js.map