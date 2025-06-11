import { User } from '../entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
export declare class UserProfileDto {
    id: string;
    username: string;
    email?: string;
    bio?: string;
    avatarUrl?: string;
    reputationScore: number;
    postScore: number;
    commentScore: number;
    communityScore: number;
    createdAt: Date;
    updatedAt: Date;
    posts?: Post[];
    comments?: Comment[];
    upvoted?: Array<Post | Comment>;
    downvoted?: Array<Post | Comment>;
    constructor(user: User);
}
