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
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { GetPostsDto } from './dto/get-posts.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'The post has been successfully created' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: User) {
    return this.postsService.create(createPostDto, user);
  }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Return all posts' })
  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
    @Query('communityId') communityId?: string,
  ) {
    return this.postsService.findAll(
      page || 1,
      limit || 10,
      sort || 'hot',
      communityId,
    );
  }

  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiResponse({ status: 200, description: 'Return the post' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200, description: 'The post has been successfully updated' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: User,
  ) {
    return this.postsService.update(id, updatePostDto, user);
  }

  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'The post has been successfully deleted' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.postsService.remove(id, user);
  }

  @ApiOperation({ summary: 'Upvote a post' })
  @ApiResponse({ status: 200, description: 'The post has been successfully upvoted' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/upvote')
  upvote(@Param('id') id: string, @CurrentUser() user: User) {
    return this.postsService.vote(id, user, 1);
  }

  @ApiOperation({ summary: 'Downvote a post' })
  @ApiResponse({ status: 200, description: 'The post has been successfully downvoted' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/downvote')
  downvote(@Param('id') id: string, @CurrentUser() user: User) {
    return this.postsService.vote(id, user, -1);
  }

  @ApiOperation({ summary: 'Remove vote from a post' })
  @ApiResponse({ status: 200, description: 'The vote has been successfully removed' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/vote')
  removeVote(@Param('id') id: string, @CurrentUser() user: User) {
    return this.postsService.removeVote(id, user);
  }

  @ApiOperation({ summary: 'Pin a post in a community' })
  @ApiResponse({ status: 200, description: 'The post has been successfully pinned' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/pin')
  pinPost(@Param('id') id: string, @CurrentUser() user: User) {
    return this.postsService.pinPost(id, user);
  }

  @ApiOperation({ summary: 'Unpin a post in a community' })
  @ApiResponse({ status: 200, description: 'The post has been successfully unpinned' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/unpin')
  unpinPost(@Param('id') id: string, @CurrentUser() user: User) {
    return this.postsService.unpinPost(id, user);
  }
}