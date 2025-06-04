import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { Vote } from '../votes/entities/vote.entity';
import { PostsModule } from '../posts/posts.module';
import { CommunitiesModule } from '../communities/communities.module';
import { ReputationModule } from '../reputation/reputation.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Vote]),
    PostsModule,
    CommunitiesModule,
    ReputationModule,
    NotificationsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}