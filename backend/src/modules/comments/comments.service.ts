import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  // Lấy tất cả bình luận theo filter, pagination và search
  async findAll(options?: {
    search?: string;
    current?: number;
    pageSize?: number;
    status?: 'all' | 'visible' | 'hidden' | 'deleted';
    author?: string; // author id
    startDate?: string;
    endDate?: string;
  }): Promise<{
    items: Comment[];
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

    const filter: FilterQuery<CommentDocument> = {};

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
      (filter as any).$or = [{ content: { $regex: keyword, $options: 'i' } }];
    }

    // Pagination
    let currentPage = Number(current) || 1;
    let limit = Number(pageSize) || 10;
    if (currentPage < 1) currentPage = 1;
    if (limit < 1) limit = 1;
    if (limit > 100) limit = 100;
    const skip = (currentPage - 1) * limit;

    const totalItems = await this.commentModel.countDocuments(filter).exec();
    const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

    const items = await this.commentModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username') // Lấy thông tin username của tác giả
      .populate({
        path: 'postId',
        select: 'content author',
        populate: {
          path: 'author',
          select: 'username',
        },
      })
      .lean()
      .exec();

    return {
      items: items as Comment[],
      pagination: {
        current: currentPage,
        pageSize: limit,
        totalItems,
        totalPages,
      },
    };
  }

  async findById(id: string): Promise<Comment | null> {
    return this.commentModel.findById(id).exec();
  }

  async findByPost(postId: string): Promise<Comment[]> {
    return this.commentModel.find({ postId }).exec();
  }

  async findByAuthor(authorId: string): Promise<Comment[]> {
    return this.commentModel.find({ author: authorId }).exec();
  }

  async create(createCommentDto: any): Promise<Comment> {
    const createdComment = new this.commentModel(createCommentDto);
    return createdComment.save();
  }

  async update(id: string, updateCommentDto: any): Promise<Comment | null> {
    return this.commentModel
      .findByIdAndUpdate(id, updateCommentDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Comment | null> {
    return this.commentModel.findByIdAndDelete(id).exec();
  }

  async count(): Promise<number> {
    return this.commentModel.countDocuments();
  }

  async countByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return this.commentModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });
  }

  // Ẩn bình luận
  async hide(id: string): Promise<Comment | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid comment id');
    }

    const comment = await this.commentModel
      .findByIdAndUpdate(id, { isHidden: true }, { new: true })
      .exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  // Bỏ ẩn bình luận
  async unhide(id: string): Promise<Comment | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid comment id');
    }

    const comment = await this.commentModel
      .findByIdAndUpdate(id, { isHidden: false }, { new: true })
      .exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  // Xóa mềm bình luận
  async softDelete(id: string): Promise<Comment | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid comment id');
    }

    const comment = await this.commentModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }
}
