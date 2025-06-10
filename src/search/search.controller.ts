import { Controller, Get, Query, UsePipes, ValidationPipe, HttpStatus, HttpCode } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiTags, 
  ApiQuery, 
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiExtraModels,
  getSchemaPath
} from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchRequestDto } from './dto/search-request.dto';
import { 
  SearchResultDto, 
  CommunitySearchResult, 
  PostSearchResult 
} from './dto/search-response.dto';

@ApiTags('search')
@Controller({
  path: 'search',
  version: '1',
})
@ApiExtraModels(SearchResultDto, CommunitySearchResult, PostSearchResult)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Search for communities and posts',
    description: 'Searches across communities and posts based on the provided query string. Returns paginated results.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Search results',
    schema: {
      $ref: getSchemaPath(SearchResultDto)
    }
  })

  @ApiQuery({
    name: 'query',
    required: true,
    description: 'Search query string',
    example: 'programming',
    type: String
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Type of content to search for',
    enum: ['all', 'communities', 'posts'],
    example: 'all'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number,
    example: 10
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'Sort order for results',
    enum: ['relevance', 'newest', 'top'],
    example: 'relevance'
  })
  @ApiOkResponse({ 
    description: 'Search results', 
    type: SearchResultDto,
    schema: {
      example: {
        communities: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'programming',
            description: 'A community for programming discussions',
            iconUrl: 'https://example.com/icon.jpg',
            memberCount: 1000,
            createdAt: '2023-01-01T00:00:00.000Z'
          }
        ],
        posts: [
          {
            id: '550e8400-e29b-41d4-a716-446655440001',
            title: 'Introduction to Programming',
            content: 'This is a post about programming...',
            score: 42,
            commentCount: 5,
            community: {
              id: '550e8400-e29b-41d4-a716-446655440000',
              name: 'programming'
            },
            author: {
              id: '550e8400-e29b-41d4-a716-446655440002',
              username: 'devuser'
            },
            createdAt: '2023-01-02T00:00:00.000Z'
          }
        ],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Invalid request parameters',
    schema: {
      example: {
        statusCode: 400,
        message: ['query must be a string'],
        error: 'Bad Request'
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'No results found',
    schema: {
      example: {
        statusCode: 404,
        message: 'No results found',
        error: 'Not Found'
      }
    }
  })
  async search(@Query() searchRequest: SearchRequestDto): Promise<SearchResultDto> {
    return this.searchService.search(searchRequest);
  }
}
