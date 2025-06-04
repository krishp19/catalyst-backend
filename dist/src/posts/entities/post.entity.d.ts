import { User } from '../../users/entities/user.entity';
import { Community } from '../../communities/entities/community.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Vote } from '../../votes/entities/vote.entity';
export declare enum PostType {
    TEXT = "text",
    IMAGE = "image",
    LINK = "link"
}
export declare class Post {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    linkUrl: string;
    type: PostType;
    score: number;
    upvotes: number;
    downvotes: number;
    commentCount: number;
    isPinned: boolean;
    author: User;
    authorId: string;
    community: Community;
    communityId: string;
    comments: Comment[];
    votes: Vote[];
    createdAt: Date;
    updatedAt: Date;
}
