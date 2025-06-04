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
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Community } from './entities/community.entity';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@ApiTags('communities')
@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @ApiOperation({ summary: 'Create a new community' })
  @ApiResponse({ status: 201, description: 'The community has been successfully created' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createCommunityDto: CreateCommunityDto,
    @CurrentUser() user: User,
  ) {
    return this.communitiesService.create(createCommunityDto, user);
  }

  @ApiOperation({ summary: 'Get all communities' })
  @ApiResponse({ status: 200, description: 'Return all communities' })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.communitiesService.findAll(
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @ApiOperation({ summary: 'Get a community by name' })
  @ApiResponse({ status: 200, description: 'Return the community' })
  @Get(':name')
  findByName(@Param('name') name: string) {
    return this.communitiesService.findByName(name);
  }

  @ApiOperation({ summary: 'Update a community' })
  @ApiResponse({ status: 200, description: 'The community has been successfully updated' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommunityDto: UpdateCommunityDto,
    @CurrentUser() user: User,
  ) {
    return this.communitiesService.update(id, updateCommunityDto, user);
  }

  @ApiOperation({ summary: 'Join a community' })
  @ApiResponse({ status: 200, description: 'Successfully joined the community' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  join(@Param('id') id: string, @CurrentUser() user: User) {
    return this.communitiesService.joinCommunity(id, user);
  }

  @ApiOperation({ summary: 'Leave a community' })
  @ApiResponse({ status: 200, description: 'Successfully left the community' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/leave')
  leave(@Param('id') id: string, @CurrentUser() user: User) {
    return this.communitiesService.leaveCommunity(id, user);
  }

  @ApiOperation({ summary: 'Get members of a community' })
  @ApiResponse({ status: 200, description: 'Return all community members' })
  @Get(':id/members')
  getMembers(
    @Param('id') id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.communitiesService.getMembers(
      id,
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get('user/joined')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get communities joined by the current user' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of communities joined by the user',
    type: PaginatedResponseDto<Community>,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getJoinedCommunities(
    @CurrentUser() user: User,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    return this.communitiesService.getJoinedCommunities(user.id, page, limit);
  }
}