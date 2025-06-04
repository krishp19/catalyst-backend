import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    // Create notification
    const notification = this.notificationsRepository.create({
      ...createNotificationDto,
      type: createNotificationDto.type as NotificationType,
    });
    
    const savedNotification = await this.notificationsRepository.save(notification);
    
    // Send real-time notification via WebSocket
    this.notificationsGateway.sendNotification(
      savedNotification.recipientId,
      savedNotification,
    );
    
    return savedNotification;
  }

  async findAll(userId: string, page = 1, limit = 10, unreadOnly = false) {
    const whereCondition: any = { recipientId: userId };
    
    if (unreadOnly) {
      whereCondition.read = false;
    }
    
    const [notifications, total] = await this.notificationsRepository.findAndCount({
      where: whereCondition,
      relations: ['actor'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items: notifications,
      meta: {
        totalItems: total,
        itemCount: notifications.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async getUnreadCount(userId: string): Promise<{ count: number }> {
    const count = await this.notificationsRepository.count({
      where: {
        recipientId: userId,
        read: false,
      },
    });
    
    return { count };
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
    });
    
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    
    if (notification.recipientId !== userId) {
      throw new ForbiddenException('You can only mark your own notifications as read');
    }
    
    notification.read = true;
    return this.notificationsRepository.save(notification);
  }

  async markAllAsRead(userId: string) {
    await this.notificationsRepository.update(
      { recipientId: userId, read: false },
      { read: true },
    );
    
    return { message: 'All notifications marked as read' };
  }

  async remove(id: string, userId: string) {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
    });
    
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    
    if (notification.recipientId !== userId) {
      throw new ForbiddenException('You can only delete your own notifications');
    }
    
    await this.notificationsRepository.remove(notification);
    return { message: 'Notification deleted successfully' };
  }
}