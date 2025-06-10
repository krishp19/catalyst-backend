import { IsString, IsOptional, IsNumber, Min, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchRequestDto {
  @ApiProperty({
    description: 'Search query string',
    example: 'programming',
    required: true
  })
  @IsString()
  query: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    default: 1,
    minimum: 1,
    example: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
    maximum: 100,
    example: 10
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Sort order for results',
    enum: ['relevance', 'newest', 'top'],
    default: 'relevance',
    example: 'relevance'
  })
  @IsOptional()
  @IsIn(['relevance', 'newest', 'top'])
  sort: 'relevance' | 'newest' | 'top' = 'relevance';

  @ApiPropertyOptional({
    description: 'Type of content to search for',
    enum: ['all', 'communities', 'posts'],
    default: 'all',
    example: 'all'
  })
  @IsOptional()
  @IsIn(['all', 'communities', 'posts'])
  type: 'all' | 'communities' | 'posts' = 'all';
}
