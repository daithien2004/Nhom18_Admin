import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ collection: 'posts', timestamps: true })
export class Post {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String })
  caption?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  likes: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Comment', default: [] })
  comments: Types.ObjectId[];

  @Prop({ type: Number, default: 0 })
  views: number;

  @Prop({ type: [Types.ObjectId], ref: 'Post', default: [] })
  shares: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Post', default: null })
  sharedFrom?: Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
