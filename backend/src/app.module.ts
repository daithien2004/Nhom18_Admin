import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import mongoose from 'mongoose';

// Cấu hình toàn cục cho Mongoose để chuẩn hóa id
const MongooseGlobalConfig = {
  virtuals: true, // Bật trường ảo 'id' (tạo từ _id)
  versionKey: false, // Xóa trường __v
  transform: (doc: any, ret: any) => {
    // Xóa trường _id sau khi trường id ảo đã được tạo
    if (ret._id) {
      delete ret._id;
    }
    // Xóa __v nếu chưa bị xóa bởi versionKey: false
    if (ret.__v) {
      delete ret.__v;
    }
    return ret;
  },
};

// Cấu hình toJSON: áp dụng khi gọi .toJSON() hoặc NestJS trả về kết quả
mongoose.set('toJSON', MongooseGlobalConfig);

// Cấu hình toObject: áp dụng khi gọi .toObject()
mongoose.set('toObject', MongooseGlobalConfig);

import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/src/common/guards/jwt-auth.guard';
import { OtpModule } from './modules/otp/otp.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(
          'MONGO_URI',
          'mongodb://localhost:27017/zaloute',
        ),
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASS'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>('EMAIL_USER')}>`,
        },
      }),
    }),
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379', // Hoặc từ env variable
    }),
    ThrottlerModule.forRoot([
      {
        name: 'global', // đặt tên tuỳ ý
        ttl: 60, // 60 giây
        limit: 10, // 10 request trong 60s
      },
    ]),
    UsersModule,
    AuthModule,
    OtpModule,
    DashboardModule,
    PostsModule,
    CommentsModule,
    ReportsModule,
    ActivitiesModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
