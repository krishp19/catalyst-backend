import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Get all notifications for the current user' })
  @ApiResponse({ status: 200, description: 'Return all notifications' })
  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query() paginationDto: PaginationDto,
    @Query('unreadOnly') unreadOnly?: boolean,
  ) {
    return this.notificationsService.findAll(
      user.id,
      paginationDto.page,
      paginationDto.limit,
      unreadOnly,
    );
  }

  @ApiOperation({ summary: 'Get unread notification count' })
  @ApiResponse({ status: 200, description: 'Return unread notification count' })
  @Get('count')
  getUnreadCount(@CurrentUser() user: User) {
    return this.notificationsService.getUnreadCount(user.id);
  }

  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({ status: 200, description: 'The notification has been marked as read' })
  @Post(':id/read')
  markAsRead(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications have been marked as read' })
  @Post('read-all')
  markAllAsRead(@CurrentUser() user: User) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({ status: 200, description: 'The notification has been deleted' })
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.notificationsService.remove(id, user.id);
  }
}