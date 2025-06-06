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
exports.TopicsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const topic_entity_1 = require("./entities/topic.entity");
let TopicsService = class TopicsService {
    constructor(topicRepository) {
        this.topicRepository = topicRepository;
    }
    async createTopic(name) {
        const normalizedTopicName = name.toLowerCase().trim();
        let topic = await this.topicRepository.findOne({
            where: { name: normalizedTopicName }
        });
        if (!topic) {
            topic = this.topicRepository.create({ name: normalizedTopicName });
            await this.topicRepository.save(topic);
        }
        return topic;
    }
    async createTopics(topicNames) {
        const normalizedTopicNames = topicNames.map(name => name.toLowerCase().trim());
        const existingTopics = await this.topicRepository.find({
            where: { name: (0, typeorm_2.In)(normalizedTopicNames) },
        });
        const existingTopicNames = new Set(existingTopics.map(topic => topic.name));
        const newTopicNames = normalizedTopicNames.filter(name => !existingTopicNames.has(name));
        const newTopics = await Promise.all(newTopicNames.map(name => this.createTopic(name)));
        return [...existingTopics, ...newTopics];
    }
    async getTopicsByIds(ids) {
        return this.topicRepository.find({ where: { id: (0, typeorm_2.In)(ids) } });
    }
    async getTopicsByNames(names) {
        return this.topicRepository.find({
            where: { name: (0, typeorm_2.In)(names.map(name => name.toLowerCase().trim())) }
        });
    }
    async getPopularTopics(limit = 10) {
        return this.topicRepository.find({
            order: { communityCount: 'DESC' },
            take: limit,
        });
    }
    async updateTopicUsage(topicIds, increment = true) {
        if (topicIds.length === 0)
            return;
        const operation = increment ? '+' : '-';
        await this.topicRepository
            .createQueryBuilder()
            .update(topic_entity_1.Topic)
            .set({ communityCount: () => `communityCount ${operation} 1` })
            .whereInIds(topicIds)
            .execute();
    }
    async searchTopics(query, limit = 10) {
        if (!query || query.trim().length === 0) {
            return this.getPopularTopics(limit);
        }
        return this.topicRepository
            .createQueryBuilder('topic')
            .where('LOWER(topic.name) LIKE LOWER(:query)', { query: `%${query}%` })
            .orderBy('topic.communityCount', 'DESC')
            .take(limit)
            .getMany();
    }
};
exports.TopicsService = TopicsService;
exports.TopicsService = TopicsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(topic_entity_1.Topic)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TopicsService);
//# sourceMappingURL=topics.service.js.map