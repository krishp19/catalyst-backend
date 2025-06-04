import { NotificationType } from '../entities/notification.entity';
export declare class CreateNotificationDto {
    type: NotificationType;
    recipientId: string;
    actorId: string;
    postId?: string;
    commentId?: string;
}
