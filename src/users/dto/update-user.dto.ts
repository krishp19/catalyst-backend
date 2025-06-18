import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsEmail, 
  IsOptional, 
  IsString, 
  MinLength, 
  Matches, 
  IsBoolean, 
  IsDateString, 
  Length 
} from 'class-validator';

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
    description: 'Whether the user\'s email is verified',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @ApiProperty({
    description: 'OTP code for password reset',
    example: '123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(6, 6)
  passwordResetOtp?: string;

  @ApiProperty({
    description: 'Expiration timestamp for the password reset OTP',
    example: '2023-12-31T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  passwordResetExpires?: string | Date;

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

  @ApiPropertyOptional({
    description: 'OTP code for email verification',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  @Length(6, 6, { message: 'OTP must be 6 digits' })
  @Matches(/^\d+$/, { message: 'OTP must contain only numbers' })
  otpCode?: string;

  @ApiPropertyOptional({
    description: 'Expiration date for the OTP code',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  otpExpires?: Date;
}