import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address associated with the account',
    required: true
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty({
    example: 'If an account with this email exists, a password reset OTP has been sent',
    description: 'Success message'
  })
  message: string;
}
