import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsUrl,
  IsOptional,
  MaxLength,
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
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

  @ApiProperty({
    description: 'Array of tags for the post (max 5)',
    example: ['react', 'performance', 'frontend'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5, { message: 'You can add up to 5 tags' })
  @ArrayMinSize(1, { message: 'At least one tag is required' })
  @IsString({ each: true })
  @Transform(({ value }) => 
    Array.isArray(value) 
      ? value.map((v: any) => typeof v === 'string' ? v.trim().toLowerCase() : v)
      : value
  )
  tags?: string[];
}