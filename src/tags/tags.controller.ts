import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TagsService } from './tags.service';
import { Tag } from './entities/tag.entity';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('popular')
  @ApiOperation({ summary: 'Get popular tags' })
  @ApiResponse({ status: 200, description: 'Returns list of popular tags', type: [Tag] })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of tags to return (default: 10)' })
  async getPopularTags(@Query('limit') limit = 10): Promise<Tag[]> {
    return this.tagsService.getPopularTags(limit);
  }

  @Get('search')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Search tags by name' })
  @ApiResponse({ status: 200, description: 'Returns list of matching tags', type: [Tag] })
  @ApiQuery({ name: 'query', required: true, description: 'Search query for tag names' })
  async searchTags(@Query('query') query: string): Promise<Tag[]> {
    // In a real implementation, you would add search logic here
    // This is a simplified version that just returns popular tags for now
    return this.tagsService.getPopularTags(10);
  }
}
