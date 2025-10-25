import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ContentModerationService } from './content-moderation.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/src/common/guards/jwt-auth.guard';

// Toan: Controller for content moderation functionality
@Controller('content-moderation')
@UseGuards(JwtAuthGuard)
export class ContentModerationController {
  constructor(
    private readonly contentModerationService: ContentModerationService,
  ) {}

  // Toan: Search for inappropriate posts
  @Get('search')
  async searchInappropriatePosts(
    @Query('search') search?: string,
    @Query('current') current?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: 'all' | 'visible' | 'hidden' | 'deleted',
    @Query('author') author?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const result = await this.contentModerationService.searchInappropriatePosts(
      {
        search,
        current: Number(current),
        pageSize: Number(pageSize),
        status,
        author,
        startDate,
        endDate,
      },
    );

    return {
      message: 'Inappropriate posts retrieved successfully',
      data: {
        items: result.items,
        pagination: result.pagination,
      },
    };
  }

  // Toan: Get flagged posts for review
  @Get('flagged')
  async getFlaggedPosts() {
    const posts = await this.contentModerationService.getFlaggedPosts();
    return {
      message: 'Flagged posts retrieved successfully',
      data: posts,
    };
  }

  // Toan: Get post details for moderation
  @Get('post/:id')
  async getPostForModeration(@Param('id') id: string) {
    const post = await this.contentModerationService.findById(id);
    return { message: 'Post retrieved successfully', data: post };
  }

  // Toan: Delete inappropriate post permanently
  @Patch('post/:id/delete')
  @HttpCode(HttpStatus.OK)
  async deleteInappropriatePost(@Param('id') id: string) {
    const result =
      await this.contentModerationService.deleteInappropriatePost(id);
    return { message: 'Inappropriate post deleted successfully', data: result };
  }

  // Toan: Hide inappropriate post
  @Patch('post/:id/hide')
  @HttpCode(HttpStatus.OK)
  async hideInappropriatePost(@Param('id') id: string) {
    const result =
      await this.contentModerationService.hideInappropriatePost(id);
    return { message: 'Post hidden successfully', data: result };
  }

  // Toan: Unhide post if content is appropriate
  @Patch('post/:id/unhide')
  @HttpCode(HttpStatus.OK)
  async unhidePost(@Param('id') id: string) {
    const result = await this.contentModerationService.unhidePost(id);
    return { message: 'Post unhidden successfully', data: result };
  }

  // Toan: Get statistics for content moderation
  @Get('stats')
  async getModerationStats() {
    const inappropriateCount =
      await this.contentModerationService.countInappropriatePosts();
    return {
      message: 'Moderation statistics retrieved successfully',
      data: {
        inappropriatePosts: inappropriateCount,
      },
    };
  }
}
