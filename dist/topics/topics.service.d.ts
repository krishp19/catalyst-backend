import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';
export declare class TopicsService {
    private readonly topicRepository;
    constructor(topicRepository: Repository<Topic>);
    createTopic(name: string): Promise<Topic>;
    createTopics(topicNames: string[]): Promise<Topic[]>;
    getTopicsByIds(ids: string[]): Promise<Topic[]>;
    getTopicsByNames(names: string[]): Promise<Topic[]>;
    getPopularTopics(limit?: number): Promise<Topic[]>;
    updateTopicUsage(topicIds: string[], increment?: boolean): Promise<void>;
    searchTopics(query: string, limit?: number): Promise<Topic[]>;
}
