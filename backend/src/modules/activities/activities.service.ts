import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity, ActivityDocument } from './schemas/activity.schema';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  async findAll(): Promise<Activity[]> {
    return this.activityModel.find().exec();
  }

  async findById(id: string): Promise<Activity | null> {
    return this.activityModel.findById(id).exec();
  }

  async findByActor(actorId: string): Promise<Activity[]> {
    return this.activityModel.find({ actor: actorId }).exec();
  }

  async findByPost(postId: string): Promise<Activity[]> {
    return this.activityModel.find({ post: postId }).exec();
  }

  async findByType(type: string): Promise<Activity[]> {
    return this.activityModel.find({ type }).exec();
  }

  async findRecent(limit: number = 20): Promise<Activity[]> {
    return this.activityModel
      .find()
      .populate('actor', 'username email')
      .populate('post', 'content')
      .populate('comment', 'content')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async create(createActivityDto: any): Promise<Activity> {
    const createdActivity = new this.activityModel(createActivityDto);
    return createdActivity.save();
  }

  async update(id: string, updateActivityDto: any): Promise<Activity | null> {
    return this.activityModel.findByIdAndUpdate(id, updateActivityDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Activity | null> {
    return this.activityModel.findByIdAndDelete(id).exec();
  }

  async count(): Promise<number> {
    return this.activityModel.countDocuments();
  }

  async countByType(type: string): Promise<number> {
    return this.activityModel.countDocuments({ type });
  }

  async countByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return this.activityModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    });
  }

  async getActiveUsers(startDate: Date): Promise<string[]> {
    const userIds = await this.activityModel.distinct('actor', {
      createdAt: { $gte: startDate }
    });
    return userIds.map(id => id.toString());
  }
}
