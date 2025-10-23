import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ collection: 'notifications', timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiverId: Types.ObjectId;

  @Prop({ type: String, trim: true })
  message?: string;

  @Prop({ type: Boolean, default: false })
  isRead: boolean;

  @Prop({ 
    type: String, 
    enum: [
      'like',
      'comment',
      'follow',
      'share',
      'system',
      'tag',
      'mention',
      'reaction',
      'friend_request',
      'friend_accept',
      'security',
    ], 
    required: true 
  })
  type: string;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
