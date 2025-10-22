import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  username: string;
  email: string;
  password?: string; // Optional
  avatar?: string;
  isVerified?: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
