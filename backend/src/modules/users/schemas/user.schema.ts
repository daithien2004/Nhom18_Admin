import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

class FriendsRequest {
  from: Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
}

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ unique: true, required: true, trim: true })
  username: string;
  @Prop({ unique: true, required: true })
  email: string;
  @Prop({ required: false })
  password?: string;
  @Prop({ required: false, unique: true })
  phone?: string;

  @Prop({ default: '' })
  avatar?: string;
  @Prop({ default: '' })
  coverPhoto?: string;
  @Prop({ default: '' })
  bio?: string;
  @Prop({ type: String, enum: Object.values(Gender), default: Gender.OTHER })
  gender: Gender;
  @Prop({ required: false })
  birthday?: Date;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  friends: Types.ObjectId[];
  @Prop({ type: [FriendsRequest], default: [] })
  friendsRequests: FriendsRequest[];

  @Prop({ default: false })
  isOnline: boolean;
  @Prop({ default: Date.now })
  lastActive: Date;
  @Prop({ required: false })
  lastSeen?: Date;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: false })
  isBanned: boolean;

  @Prop({ required: false })
  banReason?: string;

  @Prop({ required: false })
  bannedAt?: Date;

  @Prop({ default: 0 })
  warningCount: number;

  @Prop({ type: [{ 
    reason: String, 
    createdAt: Date 
  }], default: [] })
  warnings: Array<{
    reason: string;
    createdAt: Date;
  }>;
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
