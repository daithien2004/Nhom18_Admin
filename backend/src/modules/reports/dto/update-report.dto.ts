import { IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';

export class UpdateReportDto {
  @IsOptional()
  @IsEnum(['pending', 'reviewing', 'resolved', 'dismissed'])
  status?: 'pending' | 'reviewing' | 'resolved' | 'dismissed';

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  adminNotes?: string;

  @IsOptional()
  @IsString()
  resolvedBy?: string;
}
