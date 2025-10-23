import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async findAll(): Promise<Comment[]> {
    return this.commentModel.find().exec();
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
    return this.commentModel.findByIdAndUpdate(id, updateCommentDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Comment | null> {
    return this.commentModel.findByIdAndDelete(id).exec();
  }

  async count(): Promise<number> {
    return this.commentModel.countDocuments();
  }

  async countByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return this.commentModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    });
  }
}
