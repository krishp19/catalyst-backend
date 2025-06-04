import { NotificationsService } from './notifications.service';
import { User } from '../users/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(user: User, paginationDto: PaginationDto, unreadOnly?: boolean): Promise<{
        items: import("./entities/notification.entity").Notification[];
        meta: {
            totalItems: number;
            itemCount: number;
            itemsPerPage: number;
            totalPages: number;
            currentPage: number;
        };
    }>;
    getUnreadCount(user: User): Promise<{
        count: number;
    }>;
    markAsRead(id: string, user: User): Promise<import("./entities/notification.entity").Notification>;
    markAllAsRead(user: User): Promise<{
        message: string;
    }>;
    remove(id: string, user: User): Promise<{
        message: string;
    }>;
}
