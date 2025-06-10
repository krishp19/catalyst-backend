import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Community } from '../communities/entities/community.entity';
import { Post } from '../posts/entities/post.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('search')
@Module({
  imports: [
    TypeOrmModule.forFeature([Community, Post]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
