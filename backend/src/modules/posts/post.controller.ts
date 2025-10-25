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
import { PostsService } from './posts.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/src/common/guards/jwt-auth.guard';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Lấy tất cả bài viết với filter, pagination, search
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('current') current?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: 'all' | 'visible' | 'hidden' | 'deleted',
    @Query('author') author?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const result = await this.postsService.findAll({
      search,
      current: Number(current),
      pageSize: Number(pageSize),
      status,
      author,
      startDate,
      endDate,
    });

    return {
      message: 'Posts retrieved successfully',
      data: {
        items: result.items,
        pagination: result.pagination,
      },
    };
  }

  // Lấy 1 bài viết theo id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const post = await this.postsService.findById(id);
    return { message: 'Post retrieved successfully', data: post };
  }

  // Ẩn bài viết
  @Patch(':id/hide')
  async hide(@Param('id') id: string) {
    const res = await this.postsService.hide(id);
    return { message: 'Post hidden successfully', data: res };
  }

  // Bỏ ẩn bài viết
  @Patch(':id/unhide')
  async unhide(@Param('id') id: string) {
    const res = await this.postsService.unhide(id);
    return { message: 'Post unhidden successfully', data: res };
  }

  // Xóa mềm bài viết
  @Patch(':id/delete')
  async softDelete(@Param('id') id: string) {
    const res = await this.postsService.softDelete(id);
    return { message: 'Post deleted successfully', data: res };
  }
}
