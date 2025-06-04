import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunitiesService } from './communities.service';
import { CommunitiesController } from './communities.controller';
import { Community } from './entities/community.entity';
import { CommunityMember } from './entities/community-member.entity';
import { ReputationModule } from '../reputation/reputation.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Community, CommunityMember]),
    ReputationModule,
    UsersModule,
  ],
  controllers: [CommunitiesController],
  providers: [CommunitiesService],
  exports: [CommunitiesService],
})
export class CommunitiesModule {}