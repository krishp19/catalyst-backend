import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsUrl,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Title of the post',
    example: 'Updated: How to optimize React performance',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  title?: string;

  @ApiProperty({
    description: 'Content of the post',
    example: 'Updated content with more optimization tips...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'URL to the image',
    example: 'https://example.com/images/updated-diagram.png',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({
    description: 'URL to external resource',
    example: 'https://reactjs.org/docs/optimizing-performance.html',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  linkUrl?: string;
}