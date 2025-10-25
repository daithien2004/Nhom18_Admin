import { IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';

export class ReportActionDto {
  @IsEnum(['dismiss', 'hide_content', 'ban_user', 'warn_user'])
  action: 'dismiss' | 'hide_content' | 'ban_user' | 'warn_user';

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  adminNotes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
