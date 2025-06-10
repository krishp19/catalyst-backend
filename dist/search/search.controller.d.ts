import { SearchService } from './search.service';
import { SearchRequestDto } from './dto/search-request.dto';
import { SearchResultDto } from './dto/search-response.dto';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(searchRequest: SearchRequestDto): Promise<SearchResultDto>;
}
