import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post.entity';
import { Vote } from '../votes/entities/vote.entity';
import { CommunitiesModule } from '../communities/communities.module';
import { ReputationModule } from '../reputation/reputation.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Vote]),
    CommunitiesModule,
    ReputationModule,
    forwardRef(() => NotificationsModule),
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}