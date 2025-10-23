import { Controller, Get, Query, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
import { JwtAuthGuard } from '@/src/common/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getDashboardStats(@Query() query: DashboardStatsDto) {
    const stats = await this.dashboardService.getDashboardStats(query.period);
    
    return {
      message: 'Dashboard statistics retrieved successfully',
      data: stats,
    };
  }

  @Get('active-users')
  async getActiveUsers(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    const users = await this.dashboardService.getActiveUsers(limitNumber);
    
    return {
      message: 'Active users retrieved successfully',
      data: users,
    };
  }

  @Get('recent-reports')
  async getRecentReports(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    const reports = await this.dashboardService.getRecentReports(limitNumber);
    
    return {
      message: 'Recent reports retrieved successfully',
      data: reports,
    };
  }

  @Get('recent-activities')
  async getRecentActivities(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : 20;
    const activities = await this.dashboardService.getRecentActivities(limitNumber);
    
    return {
      message: 'Recent activities retrieved successfully',
      data: activities,
    };
  }
}
