import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Updated content of the comment',
    example: 'I\'ve revised my opinion after learning more about this topic.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}