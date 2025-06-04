import { User } from '../../users/entities/user.entity';
export declare enum NotificationType {
    NEW_COMMENT = "new_comment",
    COMMENT_REPLY = "comment_reply",
    POST_UPVOTE = "post_upvote",
    COMMENT_UPVOTE = "comment_upvote",
    MENTION = "mention"
}
export declare class Notification {
    id: string;
    type: NotificationType;
    read: boolean;
    recipient: User;
    recipientId: string;
    actor: User;
    actorId: string;
    postId: string;
    commentId: string;
    createdAt: Date;
}
