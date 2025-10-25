import { IsOptional, IsString, IsEnum, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ReportsQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsEnum(['pending', 'reviewing', 'resolved', 'dismissed'])
  status?: 'pending' | 'reviewing' | 'resolved' | 'dismissed';

  @IsOptional()
  @IsEnum(['user', 'post', 'comment'])
  reportType?: 'user' | 'post' | 'comment';

  @IsOptional()
  @IsEnum([
    'spam',
    'inappropriate_content',
    'harassment',
    'fake_information',
    'violence',
    'hate_speech',
    'other',
  ])
  reason?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
