export declare class SearchRequestDto {
    query: string;
    page: number;
    limit: number;
    sort: 'relevance' | 'newest' | 'top';
    type: 'all' | 'communities' | 'posts';
}
