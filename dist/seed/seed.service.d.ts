import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tag } from '../tags/entities/tag.entity';
import { Topic } from '../topics/entities/topic.entity';
export declare class SeedService implements OnModuleInit {
    private readonly tagRepository;
    private readonly topicRepository;
    constructor(tagRepository: Repository<Tag>, topicRepository: Repository<Topic>);
    onModuleInit(force?: boolean): Promise<void>;
    private seedTags;
    private seedTopics;
}
