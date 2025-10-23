import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '@/src/common/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully',
      data: {
        id: user._id.toString(),
        email: user.email,
      },
    };
  }

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('current') current?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const result = await this.usersService.findAll(
      search,
      Number(current),
      Number(pageSize),
    );

    return {
      message: 'Users retrieved successfully',
      data: {
        items: result.items,
        pagination: result.pagination,
      },
    };
  }

  // Lấy thông tin profile của user theo id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.getProfile(id);
    return {
      message: 'User profile retrieved successfully',
      data: user,
    };
  }

  // Ban user
  @Patch(':id/ban')
  async ban(@Param('id') id: string) {
    const result = await this.usersService.banUser(id);
    return { message: 'User banned successfully', data: result };
  }

  // Gỡ ban user
  @Patch(':id/unban')
  async unban(@Param('id') id: string) {
    const result = await this.usersService.unbanUser(id);
    return { message: 'User unbanned successfully', data: result };
  }

  // Xác minh tài khoản
  @Patch(':id/verify')
  async verify(@Param('id') id: string) {
    const result = await this.usersService.verifyUser(id);
    return { message: 'User verified successfully', data: result };
  }

  // Hủy xác minh tài khoản
  @Patch(':id/unverify')
  async unverify(@Param('id') id: string) {
    const result = await this.usersService.unverifyUser(id);
    return { message: 'User unverified successfully', data: result };
  }

  //  Admin đặt lại mật khẩu
  @Post(':id/reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Param('id') id: string,
    @Body() body: { newPassword: string },
  ) {
    const result = await this.usersService.adminResetPassword(
      id,
      body.newPassword,
    );
    return { message: 'Password reset successfully', data: result };
  }
}
