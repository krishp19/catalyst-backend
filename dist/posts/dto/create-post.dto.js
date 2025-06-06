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
exports.CreatePostDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const post_entity_1 = require("../entities/post.entity");
class CreatePostDto {
}
exports.CreatePostDto = CreatePostDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of the post',
        example: 'How to optimize React performance',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreatePostDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Content of the post (required for text posts)',
        example: 'Here are some tips to optimize your React application...',
        required: false,
    }),
    (0, class_validator_1.ValidateIf)(o => o.type === post_entity_1.PostType.TEXT),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePostDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL to the image (required for image posts)',
        example: 'https://example.com/images/diagram.png',
        required: false,
    }),
    (0, class_validator_1.ValidateIf)(o => o.type === post_entity_1.PostType.IMAGE),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreatePostDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL to external resource (required for link posts)',
        example: 'https://reactjs.org/docs/optimizing-performance.html',
        required: false,
    }),
    (0, class_validator_1.ValidateIf)(o => o.type === post_entity_1.PostType.LINK),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreatePostDto.prototype, "linkUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of post',
        enum: post_entity_1.PostType,
        example: post_entity_1.PostType.TEXT,
    }),
    (0, class_validator_1.IsEnum)(post_entity_1.PostType),
    __metadata("design:type", String)
], CreatePostDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the community to post in',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePostDto.prototype, "communityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of tags for the post (max 5)',
        example: ['react', 'performance', 'frontend'],
        required: false,
        type: [String],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(5, { message: 'You can add up to 5 tags' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one tag is required' }),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_transformer_1.Transform)(({ value }) => Array.isArray(value)
        ? value.map(v => typeof v === 'string' ? v.trim().toLowerCase() : v)
        : value),
    __metadata("design:type", Array)
], CreatePostDto.prototype, "tags", void 0);
//# sourceMappingURL=create-post.dto.js.map