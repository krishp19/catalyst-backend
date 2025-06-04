import { PostType } from '../entities/post.entity';
export declare class CreatePostDto {
    title: string;
    content?: string;
    imageUrl?: string;
    linkUrl?: string;
    type: PostType;
    communityId: string;
}
