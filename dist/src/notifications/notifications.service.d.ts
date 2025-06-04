import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsGateway } from './notifications.gateway';
export declare class NotificationsService {
    private notificationsRepository;
    private notificationsGateway;
    constructor(notificationsRepository: Repository<Notification>, notificationsGateway: NotificationsGateway);
    createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification>;
    findAll(userId: string, page?: number, limit?: number, unreadOnly?: boolean): Promise<{
        items: Notification[];
        meta: {
            totalItems: number;
            itemCount: number;
            itemsPerPage: number;
            totalPages: number;
            currentPage: number;
        };
    }>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
    markAsRead(id: string, userId: string): Promise<Notification>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
}
