import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyForgotPasswordOtpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address that received the OTP',
    required: true
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'The 6-digit OTP sent to the email',
    required: true,
    minLength: 6,
    maxLength: 6
  })
  @IsString({ message: 'OTP must be a string' })
  @IsNotEmpty({ message: 'OTP is required' })
  @Length(6, 6, { message: 'OTP must be 6 digits' })
  otp: string;
}

export class VerifyForgotPasswordOtpResponseDto {
  @ApiProperty({
    example: 'OTP verified successfully',
    description: 'Success message',
  })
  message: string;
}
