import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().exec();
  }

  async findById(id: string): Promise<Notification | null> {
    return this.notificationModel.findById(id).exec();
  }

  async findByReceiver(receiverId: string): Promise<Notification[]> {
    return this.notificationModel.find({ receiverId }).exec();
  }

  async findBySender(senderId: string): Promise<Notification[]> {
    return this.notificationModel.find({ senderId }).exec();
  }

  async findByType(type: string): Promise<Notification[]> {
    return this.notificationModel.find({ type }).exec();
  }

  async findUnread(receiverId: string): Promise<Notification[]> {
    return this.notificationModel.find({ receiverId, isRead: false }).exec();
  }

  async create(createNotificationDto: any): Promise<Notification> {
    const createdNotification = new this.notificationModel(createNotificationDto);
    return createdNotification.save();
  }

  async update(id: string, updateNotificationDto: any): Promise<Notification | null> {
    return this.notificationModel.findByIdAndUpdate(id, updateNotificationDto, { new: true }).exec();
  }

  async markAsRead(id: string): Promise<Notification | null> {
    return this.notificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true }).exec();
  }

  async markAllAsRead(receiverId: string): Promise<void> {
    await this.notificationModel.updateMany(
      { receiverId, isRead: false },
      { isRead: true }
    ).exec();
  }

  async delete(id: string): Promise<Notification | null> {
    return this.notificationModel.findByIdAndDelete(id).exec();
  }

  async count(): Promise<number> {
    return this.notificationModel.countDocuments();
  }

  async countUnread(receiverId: string): Promise<number> {
    return this.notificationModel.countDocuments({ receiverId, isRead: false });
  }

  async countByType(type: string): Promise<number> {
    return this.notificationModel.countDocuments({ type });
  }

  async countByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return this.notificationModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    });
  }
}
