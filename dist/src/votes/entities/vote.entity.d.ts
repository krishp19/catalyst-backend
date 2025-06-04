import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
export declare class Vote {
    id: string;
    value: number;
    user: User;
    userId: string;
    post: Post;
    postId: string;
    comment: Comment;
    commentId: string;
    createdAt: Date;
}
