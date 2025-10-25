import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { FilterQuery } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  // Lấy tất cả bài viết theo filter, pagination và search
  async findAll(options?: {
    search?: string;
    current?: number;
    pageSize?: number;
    status?: 'all' | 'visible' | 'hidden' | 'deleted';
    author?: string; // author id
    startDate?: string;
    endDate?: string;
  }): Promise<{
    items: Post[];
    pagination: {
      current: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  }> {
    const {
      search = '',
      current = 1,
      pageSize = 10,
      status = 'all',
      author,
      startDate,
      endDate,
    } = options || {};

    const filter: FilterQuery<PostDocument> = {};

    // Status filter
    if (status === 'visible') {
      filter.isDeleted = false;
      filter.isHidden = false;
    } else if (status === 'hidden') {
      filter.isDeleted = false;
      filter.isHidden = true;
    } else if (status === 'deleted') {
      filter.isDeleted = true;
    }

    // Author filter
    if (author) {
      if (Types.ObjectId.isValid(author)) {
        filter.author = new Types.ObjectId(author);
      } else {
        throw new BadRequestException('Invalid author id');
      }
    }

    // Date range filter
    if (startDate || endDate) {
      const createdAt: { $gte?: Date; $lte?: Date } = {};
      if (startDate) createdAt.$gte = new Date(startDate);
      if (endDate) createdAt.$lte = new Date(endDate);

      filter.createdAt = createdAt;
    }

    // Search keyword
    const keyword = (search || '').trim();
    if (keyword) {
      (filter as any).$or = [
        { content: { $regex: keyword, $options: 'i' } },
        { caption: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Pagination
    let currentPage = Number(current) || 1;
    let limit = Number(pageSize) || 10;
    if (currentPage < 1) currentPage = 1;
    if (limit < 1) limit = 1;
    if (limit > 100) limit = 100;
    const skip = (currentPage - 1) * limit;

    const totalItems = await this.postModel.countDocuments(filter).exec();
    const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

    const items = await this.postModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username') // Lấy thông tin username của tác giả
      .exec();

    return {
      items,
      pagination: {
        current: currentPage,
        pageSize: limit,
        totalItems,
        totalPages,
      },
    };
  }

  async findById(id: string): Promise<Post | null> {
    return this.postModel.findById(id).exec();
  }

  async create(createPostDto: any): Promise<Post> {
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }

  // Soft delete bài viết
  async softDelete(id: string): Promise<{ id: string; isDeleted: boolean }> {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException('Post not found');
    post.isDeleted = true;
    await post.save();
    return { id: (post._id as Types.ObjectId).toString(), isDeleted: true };
  }

  // Ẩn bài viết
  async hide(id: string): Promise<{ id: string; isHidden: boolean }> {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException('Post not found');
    post.isHidden = true;
    await post.save();
    return { id: (post._id as Types.ObjectId).toString(), isHidden: true };
  }

  // Bỏ ẩn bài viết
  async unhide(id: string): Promise<{ id: string; isHidden: boolean }> {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException('Post not found');
    post.isHidden = false;
    await post.save();
    return { id: (post._id as Types.ObjectId).toString(), isHidden: false };
  }

  // Đếm tổng số bài viết
  async count(): Promise<number> {
    return this.postModel.countDocuments();
  }

  // Đếm bài viết theo khoảng thời gian
  async countByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return this.postModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });
  }
}
