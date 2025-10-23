import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReportDocument = Report & Document;

@Schema({ collection: 'reports', timestamps: true })
export class Report {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reporter: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reportedUser?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  reportedPost?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Comment' })
  reportedComment?: Types.ObjectId;

  @Prop({ 
    type: String, 
    enum: ['user', 'post', 'comment'], 
    required: true 
  })
  reportType: string;

  @Prop({ 
    type: String, 
    enum: [
      'spam',
      'inappropriate_content',
      'harassment',
      'fake_information',
      'violence',
      'hate_speech',
      'other',
    ], 
    required: true 
  })
  reason: string;

  @Prop({ type: String, maxlength: 500 })
  description?: string;

  @Prop({ 
    type: String, 
    enum: ['pending', 'reviewing', 'resolved', 'dismissed'],
    default: 'pending' 
  })
  status: string;

  @Prop({ type: String, maxlength: 1000 })
  adminNotes?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  resolvedBy?: Types.ObjectId;

  @Prop({ type: Date })
  resolvedAt?: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);

// Indexes for better query performance
ReportSchema.index({ reporter: 1, reportType: 1 });
ReportSchema.index({ status: 1 });
ReportSchema.index({ createdAt: -1 });
