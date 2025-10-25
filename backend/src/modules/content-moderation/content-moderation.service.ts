import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Post, PostDocument } from '../posts/schemas/post.schema';

// Toan: Service for content moderation functionality
@Injectable()
export class ContentModerationService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  // Toan: Search posts by title/content with inappropriate content detection
  async searchInappropriatePosts(options?: {
    search?: string;
    current?: number;
    pageSize?: number;
    status?: 'all' | 'visible' | 'hidden' | 'deleted';
    author?: string;
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

    // Toan: Status filter
    if (status === 'visible') {
      filter.isDeleted = false;
      filter.isHidden = false;
    } else if (status === 'hidden') {
      filter.isDeleted = false;
      filter.isHidden = true;
    } else if (status === 'deleted') {
      filter.isDeleted = true;
    }

    // Toan: Author filter
    if (author) {
      if (Types.ObjectId.isValid(author)) {
        filter.author = new Types.ObjectId(author);
      } else {
        throw new BadRequestException('Invalid author id');
      }
    }

    // Toan: Date range filter
    if (startDate || endDate) {
      const createdAt: { $gte?: Date; $lte?: Date } = {};
      if (startDate) createdAt.$gte = new Date(startDate);
      if (endDate) createdAt.$lte = new Date(endDate);

      filter.createdAt = createdAt;
    }

    // Toan: Search keyword for inappropriate content detection
    const keyword = (search || '').trim();
    if (keyword) {
      (filter as any).$or = [
        { content: { $regex: keyword, $options: 'i' } },
        { caption: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Toan: Pagination
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
      .populate('author', 'username')
      .lean()
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

  // Toan: Get post by ID for moderation
  async findById(id: string): Promise<Post | null> {
    return this.postModel.findById(id).populate('author', 'username').exec();
  }

  // Toan: Delete inappropriate post permanently
  async deleteInappropriatePost(
    id: string,
  ): Promise<{ id: string; deleted: boolean }> {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException('Post not found');

    // Toan: Hard delete the post
    await this.postModel.findByIdAndDelete(id).exec();
    return { id: (post._id as Types.ObjectId).toString(), deleted: true };
  }

  // Toan: Hide inappropriate post
  async hideInappropriatePost(
    id: string,
  ): Promise<{ id: string; isHidden: boolean }> {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException('Post not found');
    post.isHidden = true;
    await post.save();
    return { id: (post._id as Types.ObjectId).toString(), isHidden: true };
  }

  // Toan: Unhide post if content is appropriate
  async unhidePost(id: string): Promise<{ id: string; isHidden: boolean }> {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException('Post not found');
    post.isHidden = false;
    await post.save();
    return { id: (post._id as Types.ObjectId).toString(), isHidden: false };
  }

  // Toan: Count inappropriate posts
  async countInappropriatePosts(): Promise<number> {
    return this.postModel.countDocuments({ isHidden: true });
  }

  // Toan: Get posts flagged for review
  async getFlaggedPosts(): Promise<Post[]> {
    return this.postModel
      .find({ isHidden: true })
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .exec();
  }
}
