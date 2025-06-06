import { TopicsService } from './topics.service';
import { Topic } from './entities/topic.entity';
export declare class TopicsController {
    private readonly topicsService;
    constructor(topicsService: TopicsService);
    getPopularTopics(limit?: number): Promise<Topic[]>;
    searchTopics(query: string, limit?: number): Promise<Topic[]>;
}
