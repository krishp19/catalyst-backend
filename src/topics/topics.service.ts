import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Topic } from './entities/topic.entity';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}

  async createTopic(name: string): Promise<Topic> {
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

  async createTopics(topicNames: string[]): Promise<Topic[]> {
    const normalizedTopicNames = topicNames.map(name => name.toLowerCase().trim());
    const existingTopics = await this.topicRepository.find({
      where: { name: In(normalizedTopicNames) },
    });

    const existingTopicNames = new Set(existingTopics.map(topic => topic.name));
    const newTopicNames = normalizedTopicNames.filter(name => !existingTopicNames.has(name));

    const newTopics = await Promise.all(
      newTopicNames.map(name => this.createTopic(name))
    );

    return [...existingTopics, ...newTopics];
  }

  async getTopicsByIds(ids: string[]): Promise<Topic[]> {
    return this.topicRepository.find({ where: { id: In(ids) } });
  }

  async getTopicsByNames(names: string[]): Promise<Topic[]> {
    return this.topicRepository.find({ 
      where: { name: In(names.map(name => name.toLowerCase().trim())) } 
    });
  }

  async getPopularTopics(limit = 10): Promise<Topic[]> {
    return this.topicRepository.find({
      order: { communityCount: 'DESC' },
      take: limit,
    });
  }

  async updateTopicUsage(topicIds: string[], increment: boolean = true): Promise<void> {
    if (topicIds.length === 0) return;
    
    const operation = increment ? '+' : '-';
    
    await this.topicRepository
      .createQueryBuilder()
      .update(Topic)
      .set({ communityCount: () => `communityCount ${operation} 1` })
      .whereInIds(topicIds)
      .execute();
  }

  async searchTopics(query: string, limit: number = 10): Promise<Topic[]> {
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
}
