import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
export declare class TagsService {
    private readonly tagRepository;
    constructor(tagRepository: Repository<Tag>);
    createTag(name: string): Promise<Tag>;
    createTags(tagNames: string[]): Promise<Tag[]>;
    getTagsByIds(ids: string[]): Promise<Tag[]>;
    getTagsByNames(names: string[]): Promise<Tag[]>;
    getPopularTags(limit?: number): Promise<Tag[]>;
    incrementTagUsage(tagIds: string[]): Promise<void>;
    decrementTagUsage(tagIds: string[]): Promise<void>;
}
