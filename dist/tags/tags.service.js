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
exports.TagsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tag_entity_1 = require("./entities/tag.entity");
let TagsService = class TagsService {
    constructor(tagRepository) {
        this.tagRepository = tagRepository;
    }
    async createTag(name) {
        const normalizedTagName = name.toLowerCase().trim();
        let tag = await this.tagRepository.findOne({ where: { name: normalizedTagName } });
        if (!tag) {
            tag = this.tagRepository.create({ name: normalizedTagName });
            await this.tagRepository.save(tag);
        }
        return tag;
    }
    async createTags(tagNames) {
        const normalizedTagNames = tagNames.map(name => name.toLowerCase().trim());
        const existingTags = await this.tagRepository.find({
            where: { name: (0, typeorm_2.In)(normalizedTagNames) },
        });
        const existingTagNames = new Set(existingTags.map(tag => tag.name));
        const newTagNames = normalizedTagNames.filter(name => !existingTagNames.has(name));
        const newTags = await Promise.all(newTagNames.map(name => this.createTag(name)));
        return [...existingTags, ...newTags];
    }
    async getTagsByIds(ids) {
        return this.tagRepository.find({ where: { id: (0, typeorm_2.In)(ids) } });
    }
    async getTagsByNames(names) {
        return this.tagRepository.find({
            where: { name: (0, typeorm_2.In)(names.map(name => name.toLowerCase().trim())) }
        });
    }
    async getPopularTags(limit = 10) {
        return this.tagRepository.find({
            order: { usageCount: 'DESC' },
            take: limit,
        });
    }
    async incrementTagUsage(tagIds) {
        if (tagIds.length === 0)
            return;
        await this.tagRepository
            .createQueryBuilder()
            .update(tag_entity_1.Tag)
            .set({ usageCount: () => 'usageCount + 1' })
            .whereInIds(tagIds)
            .execute();
    }
    async decrementTagUsage(tagIds) {
        if (tagIds.length === 0)
            return;
        await this.tagRepository
            .createQueryBuilder()
            .update(tag_entity_1.Tag)
            .set({ usageCount: () => 'GREATEST(usageCount - 1, 0)' })
            .whereInIds(tagIds)
            .execute();
    }
};
exports.TagsService = TagsService;
exports.TagsService = TagsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tag_entity_1.Tag)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TagsService);
//# sourceMappingURL=tags.service.js.map