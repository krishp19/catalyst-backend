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
exports.CreateCommunityDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateCommunityDto {
}
exports.CreateCommunityDto = CreateCommunityDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the community',
        example: 'programming',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(30),
    (0, class_validator_1.Matches)(/^[a-zA-Z0-9_-]+$/, {
        message: 'Name can only contain letters, numbers, underscores and hyphens',
    }),
    __metadata("design:type", String)
], CreateCommunityDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of the community',
        example: 'A community for programmers to share knowledge and ask questions',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateCommunityDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL to the community banner image',
        example: 'https://example.com/banners/programming.jpg',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCommunityDto.prototype, "bannerUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL to the community icon image',
        example: 'https://example.com/icons/programming.jpg',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCommunityDto.prototype, "iconUrl", void 0);
//# sourceMappingURL=create-community.dto.js.map