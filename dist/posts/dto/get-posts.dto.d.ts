export declare enum PostSort {
    HOT = "hot",
    NEW = "new",
    TOP = "top"
}
export declare class GetPostsDto {
    communityId?: string;
    sort?: PostSort;
}
