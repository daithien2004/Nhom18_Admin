import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'posts',
  timestamps: true,
})
export class Post {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  author: Types.ObjectId;

  @Prop({
    type: String,
    required: [
      function () {
        return !this.sharedFrom;
      },
      'Content is required for original posts',
    ],
    maxlength: [5000, 'Content cannot exceed 5000 characters'],
    trim: true,
  })
  content: string;

  @Prop({
    type: String,
    maxlength: [500, 'Caption cannot exceed 500 characters'],
    trim: true,
  })
  caption?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  likes: Types.ObjectId[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Comment' }],
    default: [],
  })
  comments: Types.ObjectId[];

  @Prop({ type: Number, default: 0, min: 0 })
  views: number;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Post' }],
    default: [],
  })
  shares: Types.ObjectId[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', default: null })
  sharedFrom?: Types.ObjectId;

  // Virtual fields
  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  // Indexes for performance
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', index: true })
  _author?: Types.ObjectId; // duplicate for index

  @Prop({ type: Date, default: Date.now })
  _createdAt?: Date;
}

export type PostDocument = HydratedDocument<Post>;

export const PostSchema = SchemaFactory.createForClass(Post);
