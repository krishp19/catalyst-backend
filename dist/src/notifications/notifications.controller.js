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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const notifications_service_1 = require("./notifications.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let NotificationsController = class NotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    findAll(user, paginationDto, unreadOnly) {
        return this.notificationsService.findAll(user.id, paginationDto.page, paginationDto.limit, unreadOnly);
    }
    getUnreadCount(user) {
        return this.notificationsService.getUnreadCount(user.id);
    }
    markAsRead(id, user) {
        return this.notificationsService.markAsRead(id, user.id);
    }
    markAllAsRead(user) {
        return this.notificationsService.markAllAsRead(user.id);
    }
    remove(id, user) {
        return this.notificationsService.remove(id, user.id);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all notifications for the current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all notifications' }),
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Query)('unreadOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        pagination_dto_1.PaginationDto, Boolean]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get unread notification count' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return unread notification count' }),
    (0, common_1.Get)('count'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "getUnreadCount", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Mark a notification as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The notification has been marked as read' }),
    (0, common_1.Post)(':id/read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All notifications have been marked as read' }),
    (0, common_1.Post)('read-all'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete a notification' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The notification has been deleted' }),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "remove", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('notifications'),
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map