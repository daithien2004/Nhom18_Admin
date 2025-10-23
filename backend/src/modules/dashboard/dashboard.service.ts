import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { PostsService } from '../posts/posts.service';
import { CommentsService } from '../comments/comments.service';
import { ReportsService } from '../reports/reports.service';
import { ActivitiesService } from '../activities/activities.service';
import { NotificationsService } from '../notifications/notifications.service';
import { DashboardStats, UserActivity } from './interfaces/dashboard-stats.interface';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private postsService: PostsService,
    private commentsService: CommentsService,
    private reportsService: ReportsService,
    private activitiesService: ActivitiesService,
    private notificationsService: NotificationsService,
  ) {}

  async getDashboardStats(period: string = '24h'): Promise<DashboardStats> {
    // VALIDATION
    const validPeriods = ['24h', '7d', '30d'];
    if (!validPeriods.includes(period)) {
      throw new BadRequestException('Invalid period. Must be one of: 24h, 7d, 30d');
    }

    // EXECUTION
    const now = new Date();
    let startDate: Date;

    // Tính toán thời gian bắt đầu dựa trên period
    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    // Tổng số users
    const totalUsers = await this.userModel.countDocuments();

    // Số users mới trong khoảng thời gian
    const newUsers = await this.userModel.countDocuments({
      createdAt: { $gte: startDate }
    });

    // Tổng số posts
    const totalPosts = await this.postsService.count();

    // Số posts mới trong khoảng thời gian
    const newPosts = await this.postsService.countByDateRange(startDate, now);

    // Tổng số comments
    const totalComments = await this.commentsService.count();

    // Số comments mới trong khoảng thời gian
    const newComments = await this.commentsService.countByDateRange(startDate, now);

    // Tổng số reports
    const totalReports = await this.reportsService.count();

    // Số reports mới trong khoảng thời gian
    const newReports = await this.reportsService.countByDateRange(startDate, now);

    // Số users hoạt động trong 24h (dựa trên activity)
    const activeUsers24h = await this.activitiesService.getActiveUsers(
      new Date(now.getTime() - 24 * 60 * 60 * 1000)
    ).then(users => users.length);

    // Thống kê reports theo status
    const pendingReports = await this.reportsService.countByStatus('pending');
    const resolvedReports = await this.reportsService.countByStatus('resolved');
    const dismissedReports = await this.reportsService.countByStatus('dismissed');

    // RETURN
    return {
      totalUsers,
      newUsers,
      totalPosts,
      newPosts,
      totalComments,
      newComments,
      totalReports,
      newReports,
      activeUsers24h,
      pendingReports,
      resolvedReports,
      dismissedReports,
    };
  }

  async getActiveUsers(limit: number = 10): Promise<UserActivity[]> {
    // VALIDATION
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }

    // EXECUTION
    const now = new Date();
    const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Lấy danh sách users hoạt động trong 24h
    const activeUserIds = await this.activitiesService.getActiveUsers(startDate);

    // Lấy thông tin chi tiết của users
    const users = await this.userModel.find({
      _id: { $in: activeUserIds }
    }).limit(limit);

    // Tính toán thống kê cho từng user
    const userActivities: UserActivity[] = await Promise.all(
      users.map(async (user) => {
        const postCount = await this.postsService.count();
        const commentCount = await this.commentsService.count();
        const likeCount = await this.activitiesService.countByType('like');

        // Lấy hoạt động gần nhất
        const lastActivity = await this.activitiesService.findByActor(user._id.toString());

        return {
          userId: user._id.toString(),
          username: user.username,
          email: user.email,
          lastActivity: (lastActivity?.[0] as any)?.createdAt || (user as any).createdAt,
          postCount,
          commentCount,
          likeCount,
        };
      })
    );

    // Sắp xếp theo hoạt động gần nhất
    const sortedActivities = userActivities.sort((a, b) => 
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    );

    // RETURN
    return sortedActivities;
  }

  async getRecentReports(limit: number = 10) {
    // VALIDATION
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }

    // EXECUTION
    const reports = await this.reportsService.findRecent(limit);

    // RETURN
    return reports;
  }

  async getRecentActivities(limit: number = 20) {
    // VALIDATION
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }

    // EXECUTION
    const activities = await this.activitiesService.findRecent(limit);

    // RETURN
    return activities;
  }
}
