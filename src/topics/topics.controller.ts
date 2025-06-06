import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TopicsService } from './topics.service';
import { Topic } from './entities/topic.entity';

@ApiTags('topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get('popular')
  @ApiOperation({ summary: 'Get popular topics' })
  @ApiResponse({ status: 200, description: 'Returns list of popular topics', type: [Topic] })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of topics to return (default: 10)' })
  async getPopularTopics(@Query('limit') limit = 10): Promise<Topic[]> {
    return this.topicsService.getPopularTopics(limit);
  }

  @Get('search')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Search topics by name' })
  @ApiResponse({ status: 200, description: 'Returns list of matching topics', type: [Topic] })
  @ApiQuery({ name: 'query', required: true, description: 'Search query for topic names' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of results to return (default: 10)' })
  async searchTopics(
    @Query('query') query: string,
    @Query('limit') limit: number = 10
  ): Promise<Topic[]> {
    return this.topicsService.searchTopics(query, limit);
  }
}
