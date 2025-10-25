import { IsString, IsEnum, IsOptional, IsMongoId, MaxLength } from 'class-validator';

export class CreateReportDto {
  @IsMongoId()
  reporter: string;

  @IsOptional()
  @IsMongoId()
  reportedUser?: string;

  @IsOptional()
  @IsMongoId()
  reportedPost?: string;

  @IsOptional()
  @IsMongoId()
  reportedComment?: string;

  @IsEnum(['user', 'post', 'comment'])
  reportType: 'user' | 'post' | 'comment';

  @IsEnum([
    'spam',
    'inappropriate_content',
    'harassment',
    'fake_information',
    'violence',
    'hate_speech',
    'other',
  ])
  reason: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
