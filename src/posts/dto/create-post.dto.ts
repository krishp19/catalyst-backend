import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsString, 
  IsEnum, 
  IsUrl, 
  IsOptional,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { PostType } from '../entities/post.entity';

export class CreatePostDto {
  @ApiProperty({
    description: 'Title of the post',
    example: 'How to optimize React performance',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  title: string;

  @ApiProperty({
    description: 'Content of the post (required for text posts)',
    example: 'Here are some tips to optimize your React application...',
    required: false,
  })
  @ValidateIf(o => o.type === PostType.TEXT)
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'URL to the image (required for image posts)',
    example: 'https://example.com/images/diagram.png',
    required: false,
  })
  @ValidateIf(o => o.type === PostType.IMAGE)
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({
    description: 'URL to external resource (required for link posts)',
    example: 'https://reactjs.org/docs/optimizing-performance.html',
    required: false,
  })
  @ValidateIf(o => o.type === PostType.LINK)
  @IsUrl()
  linkUrl?: string;

  @ApiProperty({
    description: 'Type of post',
    enum: PostType,
    example: PostType.TEXT,
  })
  @IsEnum(PostType)
  type: PostType;

  @ApiProperty({
    description: 'ID of the community to post in',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  communityId: string;
}