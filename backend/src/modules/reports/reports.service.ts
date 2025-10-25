import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from './schemas/report.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { Comment, CommentDocument } from '../comments/schemas/comment.schema';
import {
  CreateReportDto,
  UpdateReportDto,
  ReportActionDto,
  ReportsQueryDto,
} from './dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async findRecent(limit: number = 10): Promise<Report[]> {
    return this.reportModel
      .find()
      .populate('reporter', 'username email')
      .populate('reportedUser', 'username email')
      .populate('reportedPost', 'content')
      .populate('reportedComment', 'content')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async create(createReportDto: any): Promise<Report> {
    const createdReport = new this.reportModel(createReportDto);
    return createdReport.save();
  }

  async update(id: string, updateReportDto: any): Promise<Report | null> {
    return this.reportModel
      .findByIdAndUpdate(id, updateReportDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Report | null> {
    return this.reportModel.findByIdAndDelete(id).exec();
  }

  async count(): Promise<number> {
    return this.reportModel.countDocuments();
  }

  async countByStatus(status: string): Promise<number> {
    return this.reportModel.countDocuments({ status });
  }

  async countByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return this.reportModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });
  }

  async findAllWithPagination(query: {
    page: number;
    limit: number;
    status?: string;
    reportType?: string;
    reason?: string;
    search?: string;
  }) {
    const { page, limit, status, reportType, reason, search } = query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (reportType) filter.reportType = reportType;
    if (reason) filter.reason = reason;
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { adminNotes: { $regex: search, $options: 'i' } },
      ];
    }

    const [reports, total] = await Promise.all([
      this.reportModel
        .find(filter)
        .populate('reporter', 'username email')
        .populate('reportedUser', 'username email')
        .populate('reportedPost', 'content')
        .populate('reportedComment', 'content')
        .populate('resolvedBy', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.reportModel.countDocuments(filter),
    ]);

    return {
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findByIdWithDetails(id: string) {
    const report = await this.reportModel
      .findById(id)
      .populate('reporter', 'username email')
      .populate('reportedUser', 'username email')
      .populate('reportedPost', 'content')
      .populate('reportedComment', 'content')
      .populate('resolvedBy', 'username email')
      .exec();

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async handleReportAction(id: string, actionDto: ReportActionDto) {
    const report = await this.reportModel.findById(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    const { action, adminNotes, reason } = actionDto;

    switch (action) {
      case 'dismiss':
        return this.dismissReport(report, adminNotes);

      case 'hide_content':
        return this.deleteReportedContent(report, adminNotes);

      case 'ban_user':
        return this.banReportedUser(report, adminNotes, reason);

      case 'warn_user':
        return this.warnReportedUser(report, adminNotes);

      default:
        throw new BadRequestException('Invalid action');
    }
  }

  private async dismissReport(report: ReportDocument, adminNotes?: string) {
    report.status = 'dismissed';
    report.resolvedAt = new Date();
    if (adminNotes) report.adminNotes = adminNotes;

    await report.save();
    return { message: 'Report dismissed successfully', report };
  }

  private async deleteReportedContent(
    report: ReportDocument,
    adminNotes?: string,
  ) {
    // Update the reported content to hidden instead of deleting
    if (report.reportedPost) {
      await this.postModel.findByIdAndUpdate(report.reportedPost, {
        isHidden: true,
      });
    }
    if (report.reportedComment) {
      await this.commentModel.findByIdAndUpdate(report.reportedComment, {
        isHidden: true,
      });
    }

    // Update report status
    report.status = 'resolved';
    report.resolvedAt = new Date();
    if (adminNotes) report.adminNotes = adminNotes;

    await report.save();
    return { message: 'Content deleted and report resolved', report };
  }

  private async banReportedUser(
    report: ReportDocument,
    adminNotes?: string,
    reason?: string,
  ) {
    if (!report.reportedUser) {
      throw new BadRequestException('No user to ban for this report');
    }

    // Ban the user
    await this.userModel.findByIdAndUpdate(report.reportedUser, {
      isBanned: true,
      banReason: reason || 'Violation of community guidelines',
      bannedAt: new Date(),
    });

    // Update report status
    report.status = 'resolved';
    report.resolvedAt = new Date();
    if (adminNotes) report.adminNotes = adminNotes;

    await report.save();
    return { message: 'User banned and report resolved', report };
  }

  private async warnReportedUser(report: ReportDocument, adminNotes?: string) {
    if (!report.reportedUser) {
      throw new BadRequestException('No user to warn for this report');
    }

    // Add warning to user
    await this.userModel.findByIdAndUpdate(report.reportedUser, {
      $inc: { warningCount: 1 },
      $push: {
        warnings: {
          reason: adminNotes || 'Community guideline violation',
          createdAt: new Date(),
        },
      },
    });

    // Update report status
    report.status = 'resolved';
    report.resolvedAt = new Date();
    if (adminNotes) report.adminNotes = adminNotes;

    await report.save();
    return { message: 'User warned and report resolved', report };
  }

  async getReportsStats() {
    const [
      totalReports,
      pendingReports,
      resolvedReports,
      dismissedReports,
      reportsByTypeResult,
      reportsByReasonResult,
    ] = await Promise.all([
      this.reportModel.countDocuments(),
      this.reportModel.countDocuments({ status: 'pending' }),
      this.reportModel.countDocuments({ status: 'resolved' }),
      this.reportModel.countDocuments({ status: 'dismissed' }),
      this.reportModel.aggregate([
        { $group: { _id: '$reportType', count: { $sum: 1 } } },
      ]),
      this.reportModel.aggregate([
        { $group: { _id: '$reason', count: { $sum: 1 } } },
      ]),
    ]);

    const reportsByType = reportsByTypeResult.map((item) => ({
      id: item._id,
      count: item.count,
    }));

    const reportsByReason = reportsByReasonResult.map((item) => ({
      id: item._id,
      count: item.count,
    }));

    return {
      totalReports,
      pendingReports,
      resolvedReports,
      dismissedReports,
      reportsByType,
      reportsByReason,
    };
  }
}
