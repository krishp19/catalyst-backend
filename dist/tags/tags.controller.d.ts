import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';
export declare class TagsController {
    private readonly tagsService;
    constructor(tagsService: TagsService);
    getPopularTags(limit?: number): Promise<Tag[]>;
    searchTags(query: string, limit?: number): Promise<Tag[]>;
}
