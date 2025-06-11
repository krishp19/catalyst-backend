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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UserProfileDto } from './dto/user-profile.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return the current user profile with posts, comments, and votes', type: User })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: User) {
    return this.usersService.getEnhancedProfile(user.username);
  }

  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Return the updated user profile' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  update(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @ApiOperation({ summary: 'Get a user by username' })
  @ApiParam({ name: 'username', description: 'Username of the user to retrieve' })
  @ApiResponse({ status: 200, description: 'Return the user with posts, comments, and votes', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':username')
  async findByUsername(
    @Param('username') username: string,
    @Query('includeContent') includeContent = 'true'
  ) {
    return this.usersService.getEnhancedProfile(
      username,
      includeContent === 'true'
    );
  }

  @ApiOperation({ summary: 'Get reputation breakdown for a user' })
  @ApiParam({ name: 'userId', description: 'ID of the user to retrieve reputation for' })
  @ApiResponse({ status: 200, description: 'Return the reputation breakdown' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':userId/reputation')
  getReputationBreakdown(@Param('userId') userId: string) {
    return this.usersService.getReputationBreakdown(userId);
  }

  @ApiOperation({ summary: 'Get communities that the current user has joined' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns an array of communities that the current user has joined',
    type: [Object],
    isArray: true
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me/communities')
  async getMyCommunities(@CurrentUser() user: User) {
    return this.usersService.getJoinedCommunities(user.id);
  }
}