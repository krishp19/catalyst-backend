import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength, Matches, IsArray, IsOptional, IsUUID } from 'class-validator';

export class CreateCommunityDto {
  @ApiProperty({
    description: 'Name of the community',
    example: 'programming',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Name can only contain letters, numbers, underscores and hyphens',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the community',
    example: 'A community for programmers to share knowledge and ask questions',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  description: string;

  @ApiProperty({
    description: 'URL to the community banner image',
    example: 'https://example.com/banners/programming.jpg',
    required: false,
  })
  @IsString()
  bannerUrl?: string;

  @ApiProperty({
    description: 'URL to the community icon image',
    example: 'https://example.com/icons/programming.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  iconUrl?: string;

  @ApiProperty({
    description: 'Array of topic IDs to associate with the community',
    example: ['550e8400-e29b-41d4-a716-446655440000'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsUUID(4, { each: true })
  @IsOptional()
  topicIds?: string[];
}