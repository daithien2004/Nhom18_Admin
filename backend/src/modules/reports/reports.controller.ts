import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '@/src/common/guards/jwt-auth.guard';
import { 
  CreateReportDto, 
  UpdateReportDto, 
  ReportActionDto,
  ReportsQueryDto 
} from './dto';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getAllReports(@Query() query: ReportsQueryDto) {
    const { page = 1, limit = 10, status, reportType, reason, search } = query;
    
    const reports = await this.reportsService.findAllWithPagination({
      page: Number(page),
      limit: Number(limit),
      status,
      reportType,
      reason,
      search
    });

    return {
      message: 'Reports retrieved successfully',
      data: reports,
    };
  }

  @Get(':id')
  async getReportById(@Param('id') id: string) {
    const report = await this.reportsService.findByIdWithDetails(id);

    return {
      message: 'Report retrieved successfully',
      data: report,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createReport(@Body() createReportDto: CreateReportDto) {
    const report = await this.reportsService.create(createReportDto);

    return {
      message: 'Report created successfully',
      data: report,
    };
  }

  @Put(':id')
  async updateReport(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    const report = await this.reportsService.update(id, updateReportDto);

    return {
      message: 'Report updated successfully',
      data: report,
    };
  }

  @Post(':id/actions')
  async handleReportAction(
    @Param('id') id: string,
    @Body() actionDto: ReportActionDto,
  ) {
    const result = await this.reportsService.handleReportAction(id, actionDto);

    return {
      message: 'Report action handled successfully',
      data: result,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReport(@Param('id') id: string) {
    await this.reportsService.delete(id);

    return {
      message: 'Report deleted successfully',
    };
  }

  @Get('stats/summary')
  async getReportsStats() {
    const stats = await this.reportsService.getReportsStats();

    return {
      message: 'Reports statistics retrieved successfully',
      data: stats,
    };
  }
}
