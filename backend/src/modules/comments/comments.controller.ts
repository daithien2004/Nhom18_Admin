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
import { CommentsService } from './comments.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/src/common/guards/jwt-auth.guard';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // Lấy tất cả bình luận với filter, pagination, search
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
    const result = await this.commentsService.findAll({
      search,
      current: Number(current),
      pageSize: Number(pageSize),
      status,
      author,
      startDate,
      endDate,
    });

    return {
      message: 'Comments retrieved successfully',
      data: {
        items: result.items,
        pagination: result.pagination,
      },
    };
  }

  // Lấy 1 bình luận theo id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const comment = await this.commentsService.findById(id);
    return { message: 'Comment retrieved successfully', data: comment };
  }

  // Ẩn bình luận
  @Patch(':id/hide')
  async hide(@Param('id') id: string) {
    const res = await this.commentsService.hide(id);
    return { message: 'Comment hidden successfully', data: res };
  }

  // Bỏ ẩn bình luận
  @Patch(':id/unhide')
  async unhide(@Param('id') id: string) {
    const res = await this.commentsService.unhide(id);
    return { message: 'Comment unhidden successfully', data: res };
  }

  // Xóa mềm bình luận
  @Patch(':id/delete')
  async softDelete(@Param('id') id: string) {
    const res = await this.commentsService.softDelete(id);
    return { message: 'Comment deleted successfully', data: res };
  }
}
