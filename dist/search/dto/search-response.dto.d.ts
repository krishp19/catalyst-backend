import { Community } from '../../communities/entities/community.entity';
import { Post } from '../../posts/entities/post.entity';
export declare class SearchResultDto {
    communities: CommunitySearchResult[];
    posts: PostSearchResult[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
}
export declare class CommunitySearchResult {
    id: string;
    name: string;
    description: string;
    iconUrl?: string;
    memberCount: number;
    createdAt: Date;
    static fromEntity(community: Community): CommunitySearchResult;
}
export declare class PostSearchResult {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    score: number;
    commentCount: number;
    community: {
        id: string;
        name: string;
    };
    author: {
        id: string;
        username: string;
    };
    createdAt: Date;
    static fromEntity(post: Post): PostSearchResult;
}
