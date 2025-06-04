import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { Vote } from '../../votes/entities/vote.entity';
export declare class Comment {
    id: string;
    content: string;
    score: number;
    upvotes: number;
    downvotes: number;
    author: User;
    authorId: string;
    post: Post;
    postId: string;
    parent: Comment;
    parentId: string;
    replies: Comment[];
    votes: Vote[];
    createdAt: Date;
    updatedAt: Date;
}
