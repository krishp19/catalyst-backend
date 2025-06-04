import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength, Matches } from 'class-validator';

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
  iconUrl?: string;
}