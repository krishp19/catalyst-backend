import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'The comment has been successfully created' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @CurrentUser() user: User) {
    return this.commentsService.create(createCommentDto, user);
  }

  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiResponse({ status: 200, description: 'Return all comments for a post' })
  @Get('post/:postId')
  findByPost(
    @Param('postId') postId: string,
    @Query() paginationDto: PaginationDto,
    @Query('parentId') parentId?: string,
  ) {
    return this.commentsService.findByPost(
      postId,
      paginationDto.page,
      paginationDto.limit,
      parentId,
    );
  }

  @ApiOperation({ summary: 'Get replies to a comment' })
  @ApiResponse({ status: 200, description: 'Return all replies to a comment' })
  @Get(':id/replies')
  findReplies(
    @Param('id') id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.commentsService.findReplies(
      id,
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully updated' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.update(id, updateCommentDto, user);
  }

  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully deleted' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.commentsService.remove(id, user);
  }

  @ApiOperation({ summary: 'Upvote a comment' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully upvoted' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/upvote')
  upvote(@Param('id') id: string, @CurrentUser() user: User) {
    return this.commentsService.vote(id, user, 1);
  }

  @ApiOperation({ summary: 'Downvote a comment' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully downvoted' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/downvote')
  downvote(@Param('id') id: string, @CurrentUser() user: User) {
    return this.commentsService.vote(id, user, -1);
  }

  @ApiOperation({ summary: 'Remove vote from a comment' })
  @ApiResponse({ status: 200, description: 'The vote has been successfully removed' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/vote')
  removeVote(@Param('id') id: string, @CurrentUser() user: User) {
    return this.commentsService.removeVote(id, user);
  }
}