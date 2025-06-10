import { Repository } from 'typeorm';
import { Community } from '../communities/entities/community.entity';
import { Post } from '../posts/entities/post.entity';
import { SearchRequestDto } from './dto/search-request.dto';
import { SearchResultDto } from './dto/search-response.dto';
export declare class SearchService {
    private readonly communityRepository;
    private readonly postRepository;
    constructor(communityRepository: Repository<Community>, postRepository: Repository<Post>);
    search(dto: SearchRequestDto): Promise<SearchResultDto>;
    private searchCommunities;
    private searchPosts;
    private applySorting;
}
