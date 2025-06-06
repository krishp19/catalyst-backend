import { Controller, Post, UseGuards, Query, DefaultValuePipe, ParseBoolPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SeedService } from './seed.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  // @UseGuards(JwtAuthGuard, AdminGuard) // Only allow admins to seed
  @ApiOperation({ summary: 'Seed the database with initial data' })
  @ApiQuery({ name: 'force', required: false, type: Boolean, description: 'Force reseed even if data exists' })
  @ApiResponse({ status: 201, description: 'Database seeded successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden. Admin access required' })
  async seed(
    @Query('force', new DefaultValuePipe(false), ParseBoolPipe) force: boolean
  ) {
    await this.seedService.onModuleInit(force);
    return { 
      message: 'Database seeded successfully',
      forceReseed: force 
    };
  }
}
