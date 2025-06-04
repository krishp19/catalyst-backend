import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Username or email address of the user',
    example: 'johndoe',
  })
  @IsNotEmpty()
  @IsString()
  usernameOrEmail: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'Password123!',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}