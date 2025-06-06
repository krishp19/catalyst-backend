"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./entities/notification.entity");
const notifications_gateway_1 = require("./notifications.gateway");
let NotificationsService = class NotificationsService {
    constructor(notificationsRepository, notificationsGateway) {
        this.notificationsRepository = notificationsRepository;
        this.notificationsGateway = notificationsGateway;
    }
    async createNotification(createNotificationDto) {
        const notification = this.notificationsRepository.create({
            ...createNotificationDto,
            type: createNotificationDto.type,
        });
        const savedNotification = await this.notificationsRepository.save(notification);
        this.notificationsGateway.sendNotification(savedNotification.recipientId, savedNotification);
        return savedNotification;
    }
    async findAll(userId, page = 1, limit = 10, unreadOnly = false) {
        const whereCondition = { recipientId: userId };
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
    async getUnreadCount(userId) {
        const count = await this.notificationsRepository.count({
            where: {
                recipientId: userId,
                read: false,
            },
        });
        return { count };
    }
    async markAsRead(id, userId) {
        const notification = await this.notificationsRepository.findOne({
            where: { id },
        });
        if (!notification) {
            throw new common_1.NotFoundException(`Notification with ID ${id} not found`);
        }
        if (notification.recipientId !== userId) {
            throw new common_1.ForbiddenException('You can only mark your own notifications as read');
        }
        notification.read = true;
        return this.notificationsRepository.save(notification);
    }
    async markAllAsRead(userId) {
        await this.notificationsRepository.update({ recipientId: userId, read: false }, { read: true });
        return { message: 'All notifications marked as read' };
    }
    async remove(id, userId) {
        const notification = await this.notificationsRepository.findOne({
            where: { id },
        });
        if (!notification) {
            throw new common_1.NotFoundException(`Notification with ID ${id} not found`);
        }
        if (notification.recipientId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own notifications');
        }
        await this.notificationsRepository.remove(notification);
        return { message: 'Notification deleted successfully' };
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        notifications_gateway_1.NotificationsGateway])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map