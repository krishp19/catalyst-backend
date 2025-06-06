import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createTag(name: string): Promise<Tag> {
    const normalizedTagName = name.toLowerCase().trim();
    let tag = await this.tagRepository.findOne({ where: { name: normalizedTagName } });
    
    if (!tag) {
      tag = this.tagRepository.create({ name: normalizedTagName });
      await this.tagRepository.save(tag);
    }
    
    return tag;
  }

  async createTags(tagNames: string[]): Promise<Tag[]> {
    const normalizedTagNames = tagNames.map(name => name.toLowerCase().trim());
    const existingTags = await this.tagRepository.find({
      where: { name: In(normalizedTagNames) },
    });

    const existingTagNames = new Set(existingTags.map(tag => tag.name));
    const newTagNames = normalizedTagNames.filter(name => !existingTagNames.has(name));

    const newTags = await Promise.all(
      newTagNames.map(name => this.createTag(name))
    );

    return [...existingTags, ...newTags];
  }

  async getTagsByIds(ids: string[]): Promise<Tag[]> {
    return this.tagRepository.find({ where: { id: In(ids) } });
  }

  async getTagsByNames(names: string[]): Promise<Tag[]> {
    return this.tagRepository.find({ 
      where: { name: In(names.map(name => name.toLowerCase().trim())) } 
    });
  }

  async getPopularTags(limit = 10): Promise<Tag[]> {
    return this.tagRepository.find({
      order: { usageCount: 'DESC' },
      take: limit,
    });
  }

  async incrementTagUsage(tagIds: string[]): Promise<void> {
    if (tagIds.length === 0) return;
    
    await this.tagRepository
      .createQueryBuilder()
      .update(Tag)
      .set({ usageCount: () => 'usageCount + 1' })
      .whereInIds(tagIds)
      .execute();
  }

  async decrementTagUsage(tagIds: string[]): Promise<void> {
    if (tagIds.length === 0) return;
    
    await this.tagRepository
      .createQueryBuilder()
      .update(Tag)
      .set({ usageCount: () => 'GREATEST(usageCount - 1, 0)' }) // Prevent negative counts
      .whereInIds(tagIds)
      .execute();
  }

  async searchTags(query: string, limit = 10): Promise<Tag[]> {
    if (!query || query.trim() === '') {
      return this.getPopularTags(limit);
    }

    const searchQuery = `%${query.toLowerCase().trim()}%`;
    
    return this.tagRepository
      .createQueryBuilder('tag')
      .where('LOWER(tag.name) LIKE :query', { query: searchQuery })
      .orderBy('tag.usageCount', 'DESC')
      .take(limit)
      .getMany();
  }
}
