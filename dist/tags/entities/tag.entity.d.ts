import { Post } from '../../posts/entities/post.entity';
export declare class Tag {
    id: string;
    name: string;
    usageCount: number;
    posts: Post[];
    createdAt: Date;
    updatedAt: Date;
}
