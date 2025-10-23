import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityDocument = Activity & Document;

@Schema({ collection: 'activities', timestamps: true })
export class Activity {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  actor: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  post: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  postOwner: Types.ObjectId;

  @Prop({ 
    type: String, 
    enum: ['like', 'comment'], 
    required: true 
  })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  comment?: Types.ObjectId;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
