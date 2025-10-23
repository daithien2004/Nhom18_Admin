import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import aqp from 'api-query-params';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async isEmailExist(email: string) {
    const user = await this.userModel.exists({ email });
    return !!user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { username, email, password } = createUserDto;

    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(
        `Email đã tồn tại: ${email}. Vui lòng sử dụng email khác.`,
      );
    }

    const hashPassword = await bcrypt.hash(password!, 10);
    return this.userModel.create({
      username,
      email,
      password: hashPassword,
    });
  }

  async findAll(search?: string, current = 1, pageSize = 10) {
    const filter: any = {};

    // 👉 Nếu có search, tìm theo username hoặc email (regex, không phân biệt hoa thường)
    if (search && search.trim() !== '') {
      const keyword = search.trim();
      filter.$or = [
        { username: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Giới hạn phân trang
    current = Number(current) || 1;
    pageSize = Number(pageSize) || 10;
    if (current < 1) current = 1;
    if (pageSize < 1) pageSize = 1;
    if (pageSize > 100) pageSize = 100;

    const totalItems = await this.userModel.countDocuments(filter).exec();
    const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
    const offset = (current - 1) * pageSize;

    const items = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(pageSize)
      .select('-password -hashedRt')
      .lean()
      .exec();

    return {
      items,
      pagination: {
        current,
        pageSize,
        totalItems,
        totalPages,
      },
    };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  // Lấy thông tin profile (ẩn mật khẩu)
  async getProfile(id: string) {
    const user = await this.userModel
      .findById(id)
      .select('-password -hashedRt')
      .lean()
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Ban (cấm) người dùng
  async banUser(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    user.isBanned = true;
    await user.save();
    return { id: user._id.toString(), isBanned: user.isBanned };
  }

  // Gỡ ban người dùng
  async unbanUser(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    user.isBanned = false;
    await user.save();
    return { id: user._id.toString(), isBanned: user.isBanned };
  }

  // Xác minh tài khoản
  async verifyUser(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    user.isVerified = true;
    await user.save();
    return { id: user._id.toString(), isVerified: user.isVerified };
  }

  // Hủy xác minh tài khoản
  async unverifyUser(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    user.isVerified = false;
    await user.save();
    return { id: user._id.toString(), isVerified: user.isVerified };
  }

  // Admin đặt lại mật khẩu cho người dùng
  async adminResetPassword(id: string, newPassword: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');

    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException(
        'New password must be at least 6 characters',
      );
    }

    // Không cho đặt lại cùng mật khẩu cũ
    const isSame = user.password
      ? await bcrypt.compare(newPassword, user.password)
      : false;
    if (isSame) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    // Hash mật khẩu mới và lưu lại
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();
    return { id: user._id.toString() };
  }
}
