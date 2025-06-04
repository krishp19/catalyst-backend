import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength, Matches } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Bio or about information for the user',
    example: 'Software developer passionate about technology',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'URL to the user avatar image',
    example: 'https://example.com/avatars/john-doe.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'NewPassword123!',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  })
  password?: string;
}