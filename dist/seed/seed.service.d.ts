import { OnModuleInit } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Tag } from '../tags/entities/tag.entity';
import { Topic } from '../topics/entities/topic.entity';
export declare class SeedService implements OnModuleInit {
    private readonly tagRepository;
    private readonly topicRepository;
    private dataSource;
    private readonly logger;
    constructor(tagRepository: Repository<Tag>, topicRepository: Repository<Topic>, dataSource: DataSource);
    onModuleInit(force?: boolean): Promise<void>;
    private seedTags;
    private seedTopics;
}
