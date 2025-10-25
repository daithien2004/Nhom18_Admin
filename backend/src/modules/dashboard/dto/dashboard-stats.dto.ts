import { IsIn, IsOptional, IsString } from 'class-validator';

export class DashboardStatsDto {
  @IsOptional()
  @IsIn(['24h', '7d', '30d'], {
    message: 'Period must be one of: 24h, 7d, 30d',
  })
  period?: string = '24h'; // Default value
}
