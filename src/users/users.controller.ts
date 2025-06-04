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

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return the current user profile' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
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
  @ApiResponse({ status: 200, description: 'Return the user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @ApiOperation({ summary: 'Get reputation breakdown for a user' })
  @ApiParam({ name: 'userId', description: 'ID of the user to retrieve reputation for' })
  @ApiResponse({ status: 200, description: 'Return the reputation breakdown' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':userId/reputation')
  getReputationBreakdown(@Param('userId') userId: string) {
    return this.usersService.getReputationBreakdown(userId);
  }
}