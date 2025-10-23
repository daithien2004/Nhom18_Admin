import { IsOptional, IsString } from 'class-validator';

export class DashboardStatsDto {
  @IsOptional()
  @IsString()
  period?: string = '24h'; // 24h, 7d, 30d
}
