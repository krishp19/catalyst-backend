import { IsNotEmpty, IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsNotEmpty()
  @IsUUID()
  recipientId: string;

  @IsNotEmpty()
  @IsUUID()
  actorId: string;

  @IsOptional()
  @IsUUID()
  postId?: string;

  @IsOptional()
  @IsUUID()
  commentId?: string;
}