import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  InternalServerErrorException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { OtpService } from '../otp/otp.service';
import { SignupLocalDto } from './dto/auth.dto';
import { AuthUser } from './interfaces/auth-user.interface';

// FORMAT CHUẨN cho mỗi method:
// 1. Input validation
// 2. Business rules validation
// 3. Execute business logic
// 4. Side effects (logging, events, etc.)
// 5. Return formatted response

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private otpService: OtpService,
  ) {}

  async login(user: AuthUser) {
    // VALIDATION
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Account has not been verified');
    }

    // EXECUTION
    const tokens = await this.signTokens(user.id.toString(), user.email);

    // RETURN
    return {
      accessToken: tokens.accessToken,
      user: {
        id: user.id.toString(),
        email: user.email,
        username: user.username,
      },
    };
  }

  async signup(dto: SignupLocalDto): Promise<string> {
    // VALIDATION
    const user = await this.usersService.findByEmail(dto.email);
    if (user) {
      throw new ConflictException('Email already exists');
    }

    // EXECUTION
    await this.usersService.create({
      username: dto.username,
      email: dto.email,
      password: dto.password,
    });

    // RETURN
    return await this.sendOtp(dto.email);
  }

  async verifyOtpAndActivate(email: string, otp: string): Promise<string> {
    // VALIDATION
    const isValid = await this.otpService.verifyOTP(email, otp);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // EXECUTION
    user.isVerified = true;
    await user.save();

    // RETURN
    return 'Registration successful';
  }

  async forgotPassword(email: string): Promise<string> {
    // VALIDATION
    const existingUser = await this.usersService.findByEmail(email);
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }
    // RETURN
    return this.otpService.generateOTP(email);
  }

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<string> {
    // VALIDATION
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password!);
    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    const isValid = await this.otpService.verifyOTP(email, otp);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    // EXECUTION
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();

    // RETURN
    return 'Password reset successful';
  }

  async validateUser(email: string, password: string) {
    // VALIDATION
    const user = await this.usersService.findByEmail(email);
    if (!user)
      throw new UnauthorizedException(
        'Invalid email. Please check and try again.',
      );

    // EXECUTION
    const pwMatches = await bcrypt.compare(password, user.password!);
    if (!pwMatches)
      throw new UnauthorizedException(
        'Invalid password. Please check and try again.',
      );

    // RETURN
    return user;
  }

  async sendOtp(email: string): Promise<string> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Email not found in system');
    }

    // Nếu user chưa active, cho phép gửi OTP
    if (!user.isVerified) {
      const otp = await this.otpService.generateOTP(email);
      return otp;
    }

    throw new BadRequestException('Account already activated');
  }

  async resendOtp(email: string): Promise<{ remainingTime: number }> {
    // Kiểm tra TTL của OTP hiện tại
    const ttl = await this.otpService.getOtpTTL(email);

    // Nếu không có OTP nào tồn tại
    if (ttl === -2) {
      throw new BadRequestException(
        'No previous OTP request found. Please request a new OTP.',
      );
    }

    // Chỉ cho phép resend nếu OTP cũ còn ít hơn 4 phút (240s)
    // Tránh spam khi vừa mới gửi OTP
    const RESEND_COOLDOWN = 60; // 1 phút
    if (ttl > 300 - RESEND_COOLDOWN) {
      const waitTime = ttl - (300 - RESEND_COOLDOWN);
      throw new BadRequestException(
        `Please wait ${waitTime} seconds before resending OTP`,
      );
    }

    // Gửi OTP mới
    await this.otpService.generateOTP(email);

    return {
      remainingTime: 300, // OTP mới có hiệu lực 5 phút
    };
  }

  async signTokens(userId: string, email: string) {
    // VALIDATION
    const payload = { sub: userId, email };

    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');

    if (!accessSecret) {
      throw new InternalServerErrorException('JWT secrets not configured');
    }

    // EXECUTION
    const [accessToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: '15m',
      }),
    ]);

    // RETURN
    return { accessToken };
  }
}
