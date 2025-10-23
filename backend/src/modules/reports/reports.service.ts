import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from './schemas/report.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
  ) {}

  async findAll(): Promise<Report[]> {
    return this.reportModel.find().exec();
  }

  async findById(id: string): Promise<Report | null> {
    return this.reportModel.findById(id).exec();
  }

  async findByReporter(reporterId: string): Promise<Report[]> {
    return this.reportModel.find({ reporter: reporterId }).exec();
  }

  async findByStatus(status: string): Promise<Report[]> {
    return this.reportModel.find({ status }).exec();
  }

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
    return this.reportModel.findByIdAndUpdate(id, updateReportDto, { new: true }).exec();
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
      createdAt: { $gte: startDate, $lte: endDate }
    });
  }
}
