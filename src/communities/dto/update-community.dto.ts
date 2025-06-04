import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCommunityDto {
  @ApiProperty({
    description: 'Description of the community',
    example: 'A community for programmers to share knowledge and ask questions',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'URL to the community banner image',
    example: 'https://example.com/banners/programming.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiProperty({
    description: 'URL to the community icon image',
    example: 'https://example.com/icons/programming.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  iconUrl?: string;
}